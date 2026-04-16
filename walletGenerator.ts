import { randomBytes, createHash } from 'crypto';

export interface WalletCredentials {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  address: string;
  chainCode: string;
}

export class WalletGenerator {
  private static readonly WORD_LIST = this.generateWordList();

  static generateWallet(chain: 'ETH' | 'SOL' | 'BTC'): WalletCredentials {
    const entropy = randomBytes(16);
    const mnemonic = this.entropyToMnemonic(entropy);
    const seed = this.mnemonicToSeed(mnemonic);
    
    const privateKey = createHash('sha256').update(seed).digest('hex');
    const publicKey = createHash('ripemd160').update(privateKey).digest('hex');
    const address = this.publicKeyToAddress(publicKey, chain);
    const chainCode = randomBytes(32).toString('hex');

    return {
      mnemonic,
      privateKey,
      publicKey,
      address,
      chainCode
    };
  }

  private static generateWordList(): string[] {
    const words = [];
    for (let i = 0; i < 2048; i++) {
      words.push(`word${i.toString().padStart(4, '0')}`);
    }
    return words;
  }

  private static entropyToMnemonic(entropy: Buffer): string {
    const hash = createHash('sha256').update(entropy).digest();
    const checksum = hash[0].toString(2).padStart(8, '0').slice(0, 4);
    const bits = entropy.toString('hex') + checksum;
    
    const mnemonic = [];
    for (let i = 0; i < bits.length; i += 8) {
      const idx = parseInt(bits.slice(i, i + 8), 16) % 2048;
      mnemonic.push(this.WORD_LIST[idx]);
    }
    
    return mnemonic.join(' ');
  }

  private static mnemonicToSeed(mnemonic: string): Buffer {
    return createHash('sha512').update(mnemonic).digest();
  }

  private static publicKeyToAddress(publicKey: string, chain: string): string {
    const hash = createHash('sha256').update(publicKey).digest('hex');
    return chain === 'ETH' ? `0x${hash.slice(-40)}` : hash.slice(-32);
  }
}
