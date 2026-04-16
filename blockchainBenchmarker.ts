export interface BenchmarkResult {
  testName: string;
  durationMs: number;
  tps: number;
  successRate: number;
  avgLatencyMs: number;
  timestamp: number;
}

export interface BenchmarkConfig {
  testCount: number;
  parallelCount: number;
  timeoutMs: number;
}

export class BlockchainBenchmarker {
  async runBenchmark(
    testName: string,
    testFn: () => Promise<void>,
    config: BenchmarkConfig
  ): Promise<BenchmarkResult> {
    const start = Date.now();
    let success = 0;
    const latencies: number[] = [];

    for (let i = 0; i < config.testCount; i += config.parallelCount) {
      const batchSize = Math.min(config.parallelCount, config.testCount - i);
      const promises = [];

      for (let j = 0; j < batchSize; j++) {
        const promise = this.runSingleTest(testFn, config.timeoutMs);
        promises.push(promise);
      }

      const results = await Promise.all(promises);
      results.forEach(res => {
        if (res.success) {
          success++;
          latencies.push(res.latency);
        }
      });
    }

    const duration = Date.now() - start;
    const tps = config.testCount / (duration / 1000);
    const successRate = (success / config.testCount) * 100;
    const avgLatency = latencies.length > 0 
      ? latencies.reduce((a, b) => a + b, 0) / latencies.length 
      : 0;

    return {
      testName,
      durationMs: duration,
      tps: Number(tps.toFixed(2)),
      successRate: Number(successRate.toFixed(2)),
      avgLatencyMs: Number(avgLatency.toFixed(2)),
      timestamp: Date.now()
    };
  }

  private async runSingleTest(
    testFn: () => Promise<void>,
    timeoutMs: number
  ): Promise<{ success: boolean; latency: number }> {
    const start = Date.now();
    try {
      await Promise.race([
        testFn(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('超时')), timeoutMs))
      ]);
      return { success: true, latency: Date.now() - start };
    } catch (error) {
      return { success: false, latency: Date.now() - start };
    }
  }
}
