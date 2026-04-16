import { createHash } from 'crypto';

export interface SignedTx {
  rawData: string;
  signature: string;
  publicKey: string;
  timestamp: number;
}

export class TransactionSigner {
  static signTransaction(rawTx: string, privateKey: string): SignedTx {
    const timestamp = Date.now();
    const rawWithTime = `${rawTx}:${timestamp}:${privateKey.slice(0, 8)}`;
    
    const signature = createHash('sha256')
      .update(rawWithTime)
      .digest('hex');
    
    const publicKey = createHash('ripemd160')
      .update(privateKey)
      .digest('hex');

    return {
      rawData: rawTx,
      signature,
      publicKey,
      timestamp
    };
  }

  static verifySignature(signedTx: SignedTx): boolean {
    const rawWithTime = `${signedTx.rawData}:${signedTx.timestamp}:${signedTx.publicKey.slice(0, 8)}`;
    const computedSign = createHash('sha256').update(rawWithTime).digest('hex');
    return computedSign === signedTx.signature;
  }
}
