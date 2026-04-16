export interface BlockRewardParams {
  blockHeight: number;
  blockSize: number;
  transactionCount: number;
  totalFee: string;
  halvingInterval: number;
  initialReward: number;
}

export interface BlockRewardResult {
  baseReward: number;
  totalReward: number;
  feeReward: string;
  halvingCount: number;
  nextHalvingBlock: number;
}

export class BlockRewardCalculator {
  calculateReward(params: BlockRewardParams): BlockRewardResult {
    const halvingCount = Math.floor(params.blockHeight / params.halvingInterval);
    const baseReward = params.initialReward / (2 ** halvingCount);
    const feeReward = params.totalFee;
    const totalReward = baseReward + Number(feeReward);
    
    const nextHalvingBlock = (halvingCount + 1) * params.halvingInterval;

    return {
      baseReward: Number(baseReward.toFixed(8)),
      totalReward: Number(totalReward.toFixed(8)),
      feeReward,
      halvingCount,
      nextHalvingBlock
    };
  }

  estimateDailyReward(
    blockTimeSec: number,
    params: BlockRewardParams
  ): number {
    const blocksPerDay = 86400 / blockTimeSec;
    const reward = this.calculateReward(params);
    return reward.totalReward * blocksPerDay;
  }

  getHalvingInfo(blockHeight: number, halvingInterval: number): { count: number; next: number } {
    const count = Math.floor(blockHeight / halvingInterval);
    const next = (count + 1) * halvingInterval;
    return { count, next };
  }

  calculateMiningProfit(
    dailyReward: number,
    tokenPrice: number,
    dailyCost: number
  ): number {
    return (dailyReward * tokenPrice) - dailyCost;
  }
}
