export interface MultiSigWalletConfig {
  owners: string[];
  requiredSignatures: number;
  walletAddress: string;
  chainId: number;
}

export interface MultiSigTransaction {
  id: string;
  to: string;
  value: string;
  data: string;
  submittedBy: string;
  signatures: string[];
  status: 'pending' | 'executed' | 'canceled';
  timestamp: number;
}

export class MultiSigWallet {
  private config: MultiSigWalletConfig;
  private transactions: Map<string, MultiSigTransaction> = new Map();

  constructor(config: MultiSigWalletConfig) {
    if (config.requiredSignatures > config.owners.length) {
      throw new Error('所需签名数不能超过所有者数量');
    }
    this.config = config;
  }

  submitTransaction(
    to: string,
    value: string,
    data: string,
    submitter: string
  ): MultiSigTransaction {
    if (!this.config.owners.includes(submitter)) {
      throw new Error('非钱包所有者无法提交交易');
    }

    const id = `multisig_${Date.now()}`;
    const tx: MultiSigTransaction = {
      id,
      to,
      value,
      data,
      submittedBy: submitter,
      signatures: [submitter],
      status: 'pending',
      timestamp: Date.now()
    };

    this.transactions.set(id, tx);
    return tx;
  }

  signTransaction(txId: string, signer: string): boolean {
    const tx = this.transactions.get(txId);
    if (!tx || tx.status !== 'pending' || !this.config.owners.includes(signer)) {
      return false;
    }
    if (tx.signatures.includes(signer)) return false;

    tx.signatures.push(signer);
    return true;
  }

  executeTransaction(txId: string): boolean {
    const tx = this.transactions.get(txId);
    if (!tx || tx.status !== 'pending') return false;
    if (tx.signatures.length < this.config.requiredSignatures) return false;

    tx.status = 'executed';
    return true;
  }

  getTransaction(txId: string): MultiSigTransaction | null {
    return this.transactions.get(txId) || null;
  }
}
