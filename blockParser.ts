export interface BlockData {
  blockNumber: number;
  blockHash: string;
  parentHash: string;
  timestamp: number;
  transactions: string[];
  miner: string;
  gasUsed: number;
  gasLimit: number;
}

export class BlockParser {
  static parseRawBlock(rawBlock: any): BlockData {
    return {
      blockNumber: Number(rawBlock.number || 0),
      blockHash: rawBlock.hash || '',
      parentHash: rawBlock.parentHash || '',
      timestamp: Number(rawBlock.timestamp || 0),
      transactions: rawBlock.transactions || [],
      miner: rawBlock.miner || '',
      gasUsed: Number(rawBlock.gasUsed || 0),
      gasLimit: Number(rawBlock.gasLimit || 0)
    };
  }

  static filterTransactionsByAddress(block: BlockData, address: string): string[] {
    return block.transactions.filter(tx => 
      tx.includes(address.toLowerCase()) || tx.includes(address.toUpperCase())
    );
  }

  static calculateBlockTime(prevBlock: BlockData, currentBlock: BlockData): number {
    return currentBlock.timestamp - prevBlock.timestamp;
  }

  static isBlockFinalized(block: BlockData, latestBlock: number): boolean {
    return latestBlock - block.blockNumber >= 12;
  }
}
