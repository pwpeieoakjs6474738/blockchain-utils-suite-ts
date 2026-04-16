export interface SmartAccount {
  address: string;
  owner: string;
  salt: string;
  isDeployed: boolean;
  nonce: number;
  balance: string;
}

export interface UserOperation {
  sender: string;
  nonce: number;
  callData: string;
  signature: string;
  gasLimit: string;
  maxFeePerGas: string;
}

export class AccountAbstraction {
  private accounts: Map<string, SmartAccount> = new Map();

  createSmartAccount(owner: string, salt?: string): SmartAccount {
    const accountSalt = salt || Math.random().toString(16).slice(2, 18);
    const address = this.computeAccountAddress(owner, accountSalt);
    
    const account: SmartAccount = {
      address,
      owner,
      salt: accountSalt,
      isDeployed: false,
      nonce: 0,
      balance: '0'
    };

    this.accounts.set(address, account);
    return account;
  }

  deployAccount(accountAddress: string): boolean {
    const account = this.accounts.get(accountAddress);
    if (!account || account.isDeployed) return false;
    
    account.isDeployed = true;
    return true;
  }

  buildUserOperation(
    accountAddress: string,
    callData: string,
    gasConfig: { gasLimit: string; maxFeePerGas: string }
  ): UserOperation {
    const account = this.accounts.get(accountAddress);
    if (!account) throw new Error('账户不存在');

    return {
      sender: accountAddress,
      nonce: account.nonce,
      callData,
      signature: '',
      ...gasConfig
    };
  }

  signUserOperation(op: UserOperation, owner: string): UserOperation {
    return {
      ...op,
      signature: `0x${Math.random().toString(16).slice(2, 130)}`
    };
  }

  private computeAccountAddress(owner: string, salt: string): string {
    return `0x${Math.random().toString(16).slice(2, 42)}`;
  }

  getAccount(address: string): SmartAccount | null {
    return this.accounts.get(address) || null;
  }
}
