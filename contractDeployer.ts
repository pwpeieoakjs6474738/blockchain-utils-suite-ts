export interface DeployConfig {
  bytecode: string;
  abi: any[];
  constructorParams: any[];
  gasLimit: number;
  gasPrice: string;
  chainId: number;
}

export interface DeployResult {
  contractAddress: string;
  txHash: string;
  blockNumber: number;
  gasUsed: number;
  deployTime: number;
}

export class ContractDeployer {
  private provider: any;
  private signer: any;

  constructor(provider: any, signer: any) {
    this.provider = provider;
    this.signer = signer;
  }

  async deploy(config: DeployConfig): Promise<DeployResult> {
    this.validateConfig(config);
    
    const deployTx = await this.buildDeployTransaction(config);
    const txResponse = await this.signer.sendTransaction(deployTx);
    const receipt = await txResponse.wait();

    return {
      contractAddress: receipt.contractAddress,
      txHash: receipt.transactionHash,
      blockNumber: receipt.blockNumber,
      gasUsed: Number(receipt.gasUsed),
      deployTime: Date.now()
    };
  }

  private validateConfig(config: DeployConfig): void {
    if (!config.bytecode || !config.abi) {
      throw new Error('字节码和ABI不能为空');
    }
    if (config.gasLimit < 100000) {
      throw new Error('Gas限制过低');
    }
  }

  private async buildDeployTransaction(config: DeployConfig): Promise<any> {
    const contractFactory = new this.provider.eth.Contract(config.abi);
    const deployData = contractFactory.deploy({
      data: config.bytecode,
      arguments: config.constructorParams
    }).encodeABI();

    return {
      data: deployData,
      gas: config.gasLimit,
      gasPrice: config.gasPrice,
      chainId: config.chainId
    };
  }

  estimateDeployGas(config: DeployConfig): Promise<number> {
    const contractFactory = new this.provider.eth.Contract(config.abi);
    const deployData = contractFactory.deploy({
      data: config.bytecode,
      arguments: config.constructorParams
    }).encodeABI();

    return this.provider.eth.estimateGas({ data: deployData });
  }
}
