export enum WalletType {
  METAMASK = 'metamask',
  TRUST_WALLET = 'trustwallet',
  COINBASE = 'coinbase',
  WALLET_CONNECT = 'walletconnect'
}

export interface ConnectedWallet {
  address: string;
  type: WalletType;
  chainId: number;
  connected: boolean;
  connectTime: number;
}

export class WalletConnectManager {
  private connectedWallet: ConnectedWallet | null = null;

  async connectWallet(type: WalletType, chainId: number): Promise<ConnectedWallet> {
    if (this.connectedWallet?.connected) {
      throw new Error('已有钱包连接，请先断开');
    }

    const address = await this.requestWalletAddress(type);
    const wallet: ConnectedWallet = {
      address,
      type,
      chainId,
      connected: true,
      connectTime: Date.now()
    };

    this.connectedWallet = wallet;
    return wallet;
  }

  disconnectWallet(): void {
    if (this.connectedWallet) {
      this.connectedWallet.connected = false;
      this.connectedWallet = null;
    }
  }

  getConnectedWallet(): ConnectedWallet | null {
    return this.connectedWallet ? { ...this.connectedWallet } : null;
  }

  switchChain(chainId: number): boolean {
    if (!this.connectedWallet || !this.connectedWallet.connected) return false;
    
    this.connectedWallet.chainId = chainId;
    return true;
  }

  isWalletConnected(): boolean {
    return this.connectedWallet?.connected || false;
  }

  private async requestWalletAddress(type: WalletType): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return `0x${Math.random().toString(16).slice(2, 42)}`;
  }
}
