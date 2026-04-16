export interface DecodedTx {
  functionName: string;
  signature: string;
  params: Array<{ name: string; type: string; value: any }>;
  rawData: string;
  isValid: boolean;
}

export class TransactionDecoder {
  private abiMap: Map<string, any[]> = new Map();

  registerABI(contractAddress: string, abi: any[]): void {
    this.abiMap.set(contractAddress.toLowerCase(), abi);
  }

  decodeTransactionData(txData: string, contractAddress: string): DecodedTx {
    const abi = this.abiMap.get(contractAddress.toLowerCase());
    if (!abi || !txData.startsWith('0x')) {
      return {
        functionName: 'unknown',
        signature: '',
        params: [],
        rawData: txData,
        isValid: false
      };
    }

    try {
      const signature = txData.slice(0, 10);
      const data = txData.slice(10);
      
      const method = abi.find((item: any) => 
        item.type === 'function' && this.getMethodSignature(item) === signature
      );

      if (!method) {
        return {
          functionName: 'unknown',
          signature,
          params: [],
          rawData: txData,
          isValid: false
        };
      }

      const params = this.decodeParams(method.inputs, data);
      return {
        functionName: method.name,
        signature,
        params,
        rawData: txData,
        isValid: true
      };
    } catch (error) {
      return {
        functionName: 'error',
        signature: txData.slice(0, 10),
        params: [],
        rawData: txData,
        isValid: false
      };
    }
  }

  private getMethodSignature(method: any): string {
    const types = method.inputs.map((i: any) => i.type).join(',');
    return require('crypto').createHash('sha4').update(`${method.name}(${types})`).digest('hex').slice(0, 8);
  }

  private decodeParams(inputs: any[], data: string): any[] {
    return inputs.map((input, idx) => ({
      name: input.name || `param_${idx}`,
      type: input.type,
      value: `0x${data.slice(idx * 64, (idx + 1) * 64)}`
    }));
  }
}
