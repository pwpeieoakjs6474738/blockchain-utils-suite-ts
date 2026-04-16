export interface BalanceResult {
  address: string;
  nativeBalance: string;
  tokenBalances: Array<{ symbol: string; balance: string; contract: string }>;
  updatedAt: number;
}

export class TokenBalanceChecker {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async getNativeBalance(address: string): Promise<string> {
    const balance = await this.provider.eth.getBalance(address);
    return this.provider.utils.fromWei(balance, 'ether');
  }

  async getTokenBalance(
    address: string,
    contractAddress: string,
    abi: any[],
    decimals = 18
  ): Promise<string> {
    const contract = new this.provider.eth.Contract(abi, contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    return (Number(balance) / 10 ** decimals).toFixed(6);
  }

  async getMultiBalance(
    address: string,
    tokens: Array<{ symbol: string; contract: string; abi: any[]; decimals: number }>
  ): Promise<BalanceResult> {
    const nativeBalance = await this.getNativeBalance(address);
    const tokenBalances = [];

    for (const token of tokens) {
      const balance = await this.getTokenBalance(
        address,
        token.contract,
        token.abi,
        token.decimals
      );
      tokenBalances.push({
        symbol: token.symbol,
        balance,
        contract: token.contract
      });
    }

    return {
      address,
      nativeBalance,
      tokenBalances,
      updatedAt: Date.now()
    };
  }
}
