export interface PriceData {
  symbol: string;
  price: number;
  timestamp: number;
  source: string;
  confidence: number;
}

export interface OracleRequest {
  id: string;
  dataType: 'price' | 'volume' | 'stats';
  params: any;
  callback: string;
  status: 'pending' | 'fulfilled' | 'failed';
}

export class OracleDataFeed {
  private priceCache: Map<string, PriceData> = new Map();
  private requests: Map<string, OracleRequest> = new Map();

  async getPrice(symbol: string): Promise<PriceData> {
    const cached = this.priceCache.get(symbol);
    if (cached && Date.now() - cached.timestamp < 60000) {
      return cached;
    }

    const price = await this.fetchPriceFromAPI(symbol);
    const data: PriceData = {
      symbol,
      price,
      timestamp: Date.now(),
      source: 'decentralized-oracle',
      confidence: 0.98
    };

    this.priceCache.set(symbol, data);
    return data;
  }

  createRequest(dataType: OracleRequest['dataType'], params: any, callback: string): string {
    const id = `oracle_${Date.now()}`;
    this.requests.set(id, {
      id,
      dataType,
      params,
      callback,
      status: 'pending'
    });
    return id;
  }

  fulfillRequest(requestId: string, result: any): boolean {
    const req = this.requests.get(requestId);
    if (!req || req.status !== 'pending') return false;
    
    req.status = 'fulfilled';
    return true;
  }

  getHistoricalPrices(symbol: string, count = 10): PriceData[] {
    const prices: PriceData[] = [];
    const now = Date.now();
    
    for (let i = 0; i < count; i++) {
      prices.push({
        symbol,
        price: Math.random() * 1000 + 100,
        timestamp: now - i * 3600000,
        source: 'historical',
        confidence: 0.95
      });
    }
    
    return prices;
  }

  private async fetchPriceFromAPI(symbol: string): Promise<number> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const basePrice = symbol === 'BTC' ? 50000 : symbol === 'ETH' ? 3000 : 100;
    return basePrice * (0.95 + Math.random() * 0.1);
  }
}
