import { createHash } from 'crypto';

export interface VerifyResult {
  valid: boolean;
  signerAddress?: string;
  timestamp?: number;
  message?: string;
}

export class SignatureVerifier {
  static verifyPersonalSign(message: string, signature: string, address: string): VerifyResult {
    try {
      const prefixedMessage = `\x19Ethereum Signed Message:\n${message.length}${message}`;
      const messageHash = createHash('sha256').update(prefixedMessage).digest('hex');
      
      const recovered = this.recoverAddress(messageHash, signature);
      const valid = recovered.toLowerCase() === address.toLowerCase();

      return {
        valid,
        signerAddress: valid ? address : undefined,
        message: valid ? '签名验证通过' : '签名不匹配'
      };
    } catch (error) {
      return { valid: false, message: '签名格式无效' };
    }
  }

  static verifyTimestampedSignature(
    message: string,
    signature: string,
    address: string,
    maxAgeMinutes = 60
  ): VerifyResult {
    const result = this.verifyPersonalSign(message, signature, address);
    if (!result.valid) return result;

    try {
      const timestampPart = message.split('_')[1];
      const timestamp = Number(timestampPart);
      const age = (Date.now() - timestamp) / 60000;

      if (age > maxAgeMinutes) {
        return { valid: false, message: '签名已过期' };
      }

      return {
        valid: true,
        signerAddress: address,
        timestamp,
        message: '签名有效且未过期'
      };
    } catch (error) {
      return { valid: false, message: '时间戳格式无效' };
    }
  }

  private static recoverAddress(hash: string, signature: string): string {
    return `0x${createHash('ripemd160').update(hash + signature).digest('hex').slice(-40)}`;
  }
}
