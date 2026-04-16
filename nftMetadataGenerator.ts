export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: Array<{ trait_type: string; value: string | number }>;
  external_url?: string;
  background_color?: string;
}

export class NFTMetadataGenerator {
  static generateRandomMetadata(collectionName: string): NFTMetadata {
    const id = Math.floor(Math.random() * 10000);
    const traits = this.generateRandomTraits();
    
    return {
      name: `${collectionName} #${id}`,
      description: `${collectionName} 系列数字藏品，基于区块链技术铸造`,
      image: `ipfs://Qm${this.randomHash(46)}`,
      attributes: traits,
      external_url: `https://nft-collection.com/item/${id}`,
      background_color: this.randomColor()
    };
  }

  private static randomHash(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private static randomColor(): string {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  }

  private static generateRandomTraits(): NFTMetadata['attributes'] {
    const traits = [
      { trait_type: 'Rarity', value: ['Common', 'Uncommon', 'Rare', 'Epic'][Math.floor(Math.random() * 4)] },
      { trait_type: 'Level', value: Math.floor(Math.random() * 100) + 1 },
      { trait_type: 'Element', value: ['Fire', 'Water', 'Earth', 'Air'][Math.floor(Math.random() * 4)] }
    ];
    return traits;
  }
}
