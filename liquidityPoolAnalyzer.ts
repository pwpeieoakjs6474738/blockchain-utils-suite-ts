export interface PoolData {
  address: string;
  token0: string;
  token1: string;
  reserve0: string;
  reserve1: string;
  totalLiquidity: string;
  feeTier: number;
  volume24h: string;
  apr: number;
}

export interface PoolAnalysis {
  poolAddress: string;
  price: number;
  liquidityRisk: 'low' | 'medium' | 'high';
  volumeTrend: 'up' | 'down' | 'stable';
  investmentScore: number;
}

export class LiquidityPoolAnalyzer {
  analyzePool(pool: PoolData): PoolAnalysis {
    const price = this.calculatePrice(pool);
    const liquidityRisk = this.getLiquidityRisk(pool.totalLiquidity);
    const volumeTrend = this.getVolumeTrend(pool.volume24h);
    const investmentScore = this.calculateScore(pool, liquidityRisk, volumeTrend);

    return {
      poolAddress: pool.address,
      price,
      liquidityRisk,
      volumeTrend,
      investmentScore
    };
  }

  calculatePrice(pool: PoolData): number {
    const r0 = Number(pool.reserve0);
    const r1 = Number(pool.reserve1);
    return r0 > 0 && r1 > 0 ? r1 / r0 : 0;
  }

  getLiquidityRisk(liquidity: string): 'low' | 'medium' | 'high' {
    const liq = Number(liquidity);
    if (liq > 1000000) return 'low';
    if (liq > 100000) return 'medium';
    return 'high';
  }

  getVolumeTrend(volume: string): 'up' | 'down' | 'stable' {
    const vol = Number(volume);
    const random = Math.random();
    if (random > 0.6) return 'up';
    if (random > 0.3) return 'stable';
    return 'down';
  }

  calculateScore(pool: PoolData, risk: string, trend: string): number {
    let score = 50;
    if (risk === 'low') score += 30;
    else if (risk === 'medium') score += 15;
    
    if (trend === 'up') score += 20;
    else if (trend === 'stable') score += 5;
    
    if (pool.apr > 20) score += 10;
    return Math.min(score, 100);
  }

  findBestPools(pools: PoolData[], limit = 5): PoolData[] {
    return pools
      .sort((a, b) => this.analyzePool(b).investmentScore - this.analyzePool(a).investmentScore)
      .slice(0, limit);
  }
}
