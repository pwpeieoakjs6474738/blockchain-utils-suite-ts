export interface ChainMetrics {
  blockHeight: number;
  txCount24h: number;
  activeAddresses: number;
  gasUsedAvg: number;
  networkHashrate: number;
  totalValueLocked: number;
  timestamp: number;
}

export interface MetricHistory {
  metric: string;
  values: Array<{ time: number; value: number }>;
}

export class BlockchainMetrics {
  private metrics: ChainMetrics[] = [];
  private maxHistory = 100;

  updateMetrics(newMetrics: Omit<ChainMetrics, 'timestamp'>): void {
    const entry: ChainMetrics = {
      ...newMetrics,
      timestamp: Date.now()
    };

    this.metrics.push(entry);
    if (this.metrics.length > this.maxHistory) {
      this.metrics.shift();
    }
  }

  getLatestMetrics(): ChainMetrics | null {
    return this.metrics.length > 0 ? this.metrics[this.metrics.length - 1] : null;
  }

  getMetricHistory(metric: keyof ChainMetrics): MetricHistory {
    const values = this.metrics.map(m => ({
      time: m.timestamp,
      value: Number(m[metric]) || 0
    }));

    return { metric, values };
  }

  calculateGrowthRate(metric: keyof ChainMetrics): number {
    if (this.metrics.length < 2) return 0;
    
    const latest = this.metrics[this.metrics.length - 1][metric] as number;
    const previous = this.metrics[this.metrics.length - 2][metric] as number;
    
    return previous === 0 ? 0 : ((latest - previous) / previous) * 100;
  }

  getDailyAverage(metric: keyof ChainMetrics): number {
    if (this.metrics.length === 0) return 0;
    
    const sum = this.metrics.reduce((acc, m) => acc + (Number(m[metric]) || 0), 0);
    return sum / this.metrics.length;
  }
}
