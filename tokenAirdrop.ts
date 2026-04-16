export interface AirdropConfig {
  tokenAddress: string;
  totalAmount: string;
  recipients: string[];
  amountPerUser: string;
  startBlock: number;
  endBlock: number;
}

export interface AirdropStatus {
  processed: number;
  failed: number;
  total: number;
  completed: boolean;
  txHashes: string[];
}

export class TokenAirdrop {
  async executeAirdrop(config: AirdropConfig, signer: any): Promise<AirdropStatus> {
    const status: AirdropStatus = {
      processed: 0,
      failed: 0,
      total: config.recipients.length,
      completed: false,
      txHashes: []
    };

    for (const recipient of config.recipients) {
      try {
        const txHash = await this.sendToken(
          config.tokenAddress,
          recipient,
          config.amountPerUser,
          signer
        );
        status.processed++;
        status.txHashes.push(txHash);
      } catch (error) {
        status.failed++;
      }

      if (status.processed + status.failed >= status.total) {
        status.completed = true;
      }
    }

    return status;
  }

  private async sendToken(
    tokenAddress: string,
    recipient: string,
    amount: string,
    signer: any
  ): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 100));
    return `0x${Math.random().toString(16).slice(2, 66)}`;
  }

  validateRecipients(recipients: string[]): { valid: string[]; invalid: string[] } {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const addr of recipients) {
      if (/^0x[a-fA-F0-9]{40}$/.test(addr)) {
        valid.push(addr);
      } else {
        invalid.push(addr);
      }
    }

    return { valid, invalid };
  }

  calculateTotalCost(amountPerUser: string, recipientCount: number): string {
    return (Number(amountPerUser) * recipientCount).toFixed(18);
  }
}
