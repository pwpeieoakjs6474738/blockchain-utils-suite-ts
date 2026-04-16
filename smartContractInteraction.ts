export interface ContractCallOptions {
  contractAddress: string;
  abi: any[];
  method: string;
  params: any[];
  gasLimit?: number;
  value?: string;
}

export class SmartContractInteraction {
  private provider: any;

  constructor(provider: any) {
    this.provider = provider;
  }

  async callContract(options: ContractCallOptions): Promise<any> {
    try {
      const { contractAddress, abi, method, params } = options;
      const contract = new this.provider.eth.Contract(abi, contractAddress);
      return await contract.methods[method](...params).call();
    } catch (error) {
      console.error('合约调用失败:', error);
      throw new Error('合约执行异常');
    }
  }

  async sendTransaction(options: ContractCallOptions, signer: any): Promise<any> {
    try {
      const { contractAddress, abi, method, params, gasLimit, value } = options;
      const contract = new this.provider.eth.Contract(abi, contractAddress);
      
      const tx = await contract.methods[method](...params).send({
        from: signer.address,
        gas: gasLimit || 300000,
        value: value || '0'
      });
      
      return tx;
    } catch (error) {
      console.error('交易发送失败:', error);
      throw new Error('交易执行异常');
    }
  }

  estimateGas(options: ContractCallOptions): Promise<number> {
    const { contractAddress, abi, method, params } = options;
    const contract = new this.provider.eth.Contract(abi, contractAddress);
    return contract.methods[method](...params).estimateGas();
  }

  getContractEvents(contractAddress: string, abi: any[], eventName: string): Promise<any[]> {
    const contract = new this.provider.eth.Contract(abi, contractAddress);
    return contract.getPastEvents(eventName, { fromBlock: 0, toBlock: 'latest' });
  }
}
