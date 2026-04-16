export interface GasPriceData {
  slow: number;
  standard: number;
  fast: number;
  instant: number;
  baseFee: number;
}

export class GasPriceOptimizer {
  private readonly network: string;
  private gasHistory: number[] = [];
  private readonly maxHistory = 50;

  constructor(network: 'ETH' | 'BSC' | 'POLYGON') {
    this.network = network;
  }

  updateGasPrice(gasPrice: number): void {
    this.gasHistory.push(gasPrice);
    if (this.gasHistory.length > this.maxHistory) {
      this.gasHistory.shift();
    }
  }

  getOptimalGas(priority: 'low' | 'medium' | 'high'): number {
    if (this.gasHistory.length === 0) {
      return this.getDefaultGas();
    }

    const sorted = [...this.gasHistory].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    switch (priority) {
      case 'low':
        return sorted[Math.floor(sorted.length * 0.2)];
      case 'medium':
        return sorted[mid];
      case 'high':
        return sorted[Math.floor(sorted.length * 0.8)];
      default:
        return sorted[mid];
    }
  }

  private getDefaultGas(): number {
    const defaults: Record<string, number> = {
      ETH: 30,
      BSC: 5,
      POLYGON: 80
    };
    return defaults[this.network] || 20;
  }

  getGasEstimate(txSize: number): number {
    const baseGas = this.getOptimalGas('medium');
    return Math.ceil(baseGas * (1 + txSize / 10000));
  }
}
