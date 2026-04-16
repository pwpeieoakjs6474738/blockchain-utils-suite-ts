export interface ChainInfo {
  chainId: number;
  name: string;
  symbol: string;
  rpcUrl: string;
  explorer: string;
  testnet: boolean;
  decimals: number;
}

export class ChainIdResolver {
  private chainMap: Map<number, ChainInfo> = new Map();

  constructor() {
    this.initDefaultChains();
  }

  private initDefaultChains(): void {
    const chains: ChainInfo[] = [
      { chainId: 1, name: 'Ethereum', symbol: 'ETH', rpcUrl: 'https://eth.llamarpc.com', explorer: 'https://etherscan.io', testnet: false, decimals: 18 },
      { chainId: 56, name: 'BNB Chain', symbol: 'BNB', rpcUrl: 'https://bsc-dataseed.binance.org', explorer: 'https://bscscan.com', testnet: false, decimals: 18 },
      { chainId: 137, name: 'Polygon', symbol: 'MATIC', rpcUrl: 'https://polygon-rpc.com', explorer: 'https://polygonscan.com', testnet: false, decimals: 18 },
      { chainId: 5, name: 'Goerli', symbol: 'ETH', rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', explorer: 'https://goerli.etherscan.io', testnet: true, decimals: 18 }
    ];

    chains.forEach(chain => this.chainMap.set(chain.chainId, chain));
  }

  getChainInfo(chainId: number): ChainInfo | null {
    return this.chainMap.get(chainId) || null;
  }

  addCustomChain(chain: ChainInfo): void {
    this.chainMap.set(chain.chainId, chain);
  }

  removeChain(chainId: number): boolean {
    return this.chainMap.delete(chainId);
  }

  getMainnetChains(): ChainInfo[] {
    return Array.from(this.chainMap.values()).filter(c => !c.testnet);
  }

  getTestnetChains(): ChainInfo[] {
    return Array.from(this.chainMap.values()).filter(c => c.testnet);
  }

  isValidChain(chainId: number): boolean {
    return this.chainMap.has(chainId);
  }
}
