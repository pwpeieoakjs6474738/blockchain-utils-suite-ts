interface ValidationResult {
  isValid: boolean;
  chainType: 'BTC' | 'ETH' | 'SOL' | 'TRX' | null;
  errorMsg?: string;
}

export class BlockchainAddressValidator {
  private static readonly ETH_REGEX = /^0x[a-fA-F0-9]{40}$/;
  private static readonly BTC_REGEX = /^(1|3|bc1)[a-zA-Z0-9]{25,39}$/;
  private static readonly SOL_REGEX = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  private static readonly TRX_REGEX = /^T[A-Za-z1-9]{33}$/;

  static validate(address: string): ValidationResult {
    if (!address || typeof address !== 'string') {
      return { isValid: false, chainType: null, errorMsg: '地址格式无效' };
    }

    if (this.ETH_REGEX.test(address)) {
      return { isValid: true, chainType: 'ETH' };
    }
    if (this.BTC_REGEX.test(address)) {
      return { isValid: true, chainType: 'BTC' };
    }
    if (this.SOL_REGEX.test(address)) {
      return { isValid: true, chainType: 'SOL' };
    }
    if (this.TRX_REGEX.test(address)) {
      return { isValid: true, chainType: 'TRX' };
    }

    return { isValid: false, chainType: null, errorMsg: '不支持的链地址' };
  }

  static batchValidate(addresses: string[]): ValidationResult[] {
    return addresses.map(addr => this.validate(addr));
  }
}
