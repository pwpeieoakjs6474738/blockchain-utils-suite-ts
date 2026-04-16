export enum ConsensusType {
  POW = 'proof-of-work',
  POS = 'proof-of-stake',
  DPOS = 'delegated-proof-of-stake',
  POA = 'proof-of-authority'
}

export interface Validator {
  address: string;
  stake: number;
  reputation: number;
  isActive: boolean;
  lastBlockTime: number;
}

export interface BlockProposal {
  proposer: string;
  blockNumber: number;
  hash: string;
  timestamp: number;
  signatures: string[];
}

export class ConsensusMechanism {
  private type: ConsensusType;
  private validators: Map<string, Validator> = new Map();
  private requiredSignatures = 2;

  constructor(type: ConsensusType) {
    this.type = type;
  }

  registerValidator(address: string, stake: number): void {
    this.validators.set(address, {
      address,
      stake,
      reputation: 100,
      isActive: true,
      lastBlockTime: 0
    });
  }

  proposeBlock(blockNumber: number, proposer: string): BlockProposal {
    if (!this.isValidProposer(proposer)) {
      throw new Error('非授权 proposer');
    }

    const hash = `0x${Math.random().toString(16).slice(2, 66)}`;
    const validator = this.validators.get(proposer)!;
    validator.lastBlockTime = Date.now();

    return {
      proposer,
      blockNumber,
      hash,
      timestamp: Date.now(),
      signatures: [proposer]
    };
  }

  voteBlock(proposal: BlockProposal, voter: string): boolean {
    if (!this.validators.has(voter) || proposal.signatures.includes(voter)) {
      return false;
    }

    proposal.signatures.push(voter);
    return true;
  }

  finalizeBlock(proposal: BlockProposal): boolean {
    return proposal.signatures.length >= this.requiredSignatures;
  }

  private isValidProposer(address: string): boolean {
    const validator = this.validators.get(address);
    if (!validator || !validator.isActive) return false;
    
    if (this.type === ConsensusType.POS) {
      return validator.stake > 1000;
    }
    return true;
  }

  getActiveValidators(): Validator[] {
    return Array.from(this.validators.values()).filter(v => v.isActive);
  }
}
