export interface BatchTxItem {
  to: string;
  value: string;
  data: string;
  gasLimit: number;
  nonce?: number;
}

export interface BatchResult {
  successCount: number;
  failCount: number;
  results: Array<{ success: boolean; txHash?: string; error?: string }>;
  totalGasUsed: number;
}

export class TransactionBatchSender {
  async sendBatch(
    txs: BatchTxItem[],
    signer: any,
    parallel = false
  ): Promise<BatchResult> {
    const result: BatchResult = {
      successCount: 0,
      failCount: 0,
      results: [],
      totalGasUsed: 0
    };

    if (parallel) {
      const promises = txs.map(tx => this.sendSingleTx(tx, signer));
      const txResults = await Promise.all(promises);
      
      txResults.forEach(res => {
        res.success ? result.successCount++ : result.failCount++;
        result.results.push(res);
        result.totalGasUsed += res.gasUsed || 0;
      });
    } else {
      for (const tx of txs) {
        const res = await this.sendSingleTx(tx, signer);
        res.success ? result.successCount++ : result.failCount++;
        result.results.push(res);
        result.totalGasUsed += res.gasUsed || 0;
      }
    }

    return result;
  }

  private async sendSingleTx(
    tx: BatchTxItem,
    signer: any
  ): Promise<{ success: boolean; txHash?: string; error?: string; gasUsed: number }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      const gasUsed = tx.gasLimit || Math.floor(Math.random() * 100000) + 50000;
      
      return {
        success: true,
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
        gasUsed
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        gasUsed: 0
      };
    }
  }

  estimateBatchGas(txs: BatchTxItem[]): number {
    return txs.reduce((sum, tx) => sum + (tx.gasLimit || 100000), 0);
  }

  validateBatch(txs: BatchTxItem[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    txs.forEach((tx, idx) => {
      if (!/^0x[a-fA-F0-9]{40}$/.test(tx.to)) {
        errors.push(`交易${idx}：目标地址无效`);
      }
      if (tx.gasLimit && tx.gasLimit < 21000) {
        errors.push(`交易${idx}：gas限制过低`);
      }
    });

    return { valid: errors.length === 0, errors };
  }
}
