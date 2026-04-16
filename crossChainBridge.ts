export interface BridgeTransaction {
  id: string;
  fromChain: string;
  toChain: string;
  sender: string;
  recipient: string;
  amount: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  timestamp: number;
  fee: string;
}

export class CrossChainBridge {
  private transactions: Map<string, BridgeTransaction> = new Map();

  createBridgeTx(
    fromChain: string,
    toChain: string,
    sender: string,
    recipient: string,
    amount: string,
    fee: string
  ): BridgeTransaction {
    const id = `bridge_${Date.now()}_${Math.random().toString(16).slice(2, 10)}`;
    
    const tx: BridgeTransaction = {
      id,
      fromChain,
      toChain,
      sender,
      recipient,
      amount,
      status: 'pending',
      timestamp: Date.now(),
      fee
    };

    this.transactions.set(id, tx);
    return tx;
  }

  updateTxStatus(txId: string, status: BridgeTransaction['status']): boolean {
    const tx = this.transactions.get(txId);
    if (!tx) return false;
    
    tx.status = status;
    return true;
  }

  getTransaction(txId: string): BridgeTransaction | null {
    return this.transactions.get(txId) || null;
  }

  getUserTransactions(userAddress: string): BridgeTransaction[] {
    return Array.from(this.transactions.values()).filter(
      tx => tx.sender.toLowerCase() === userAddress.toLowerCase()
    );
  }

  getPendingTransactions(): BridgeTransaction[] {
    return Array.from(this.transactions.values()).filter(tx => tx.status === 'pending');
  }
}
