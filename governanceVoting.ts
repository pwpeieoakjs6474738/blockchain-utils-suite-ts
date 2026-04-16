export interface Proposal {
  id: string;
  title: string;
  description: string;
  creator: string;
  startTime: number;
  endTime: number;
  options: string[];
  votes: Record<string, number>;
  status: 'active' | 'passed' | 'rejected' | 'canceled';
}

export interface Vote {
  proposalId: string;
  voter: string;
  optionIndex: number;
  weight: number;
  timestamp: number;
}

export class GovernanceVoting {
  private proposals: Map<string, Proposal> = new Map();
  private votes: Map<string, Vote> = new Map();

  createProposal(
    title: string,
    description: string,
    creator: string,
    options: string[],
    durationHours = 72
  ): Proposal {
    const id = `prop_${Date.now()}`;
    const endTime = Date.now() + durationHours * 3600000;
    
    const votes: Record<string, number> = {};
    options.forEach((_, idx) => votes[idx] = 0);

    const proposal: Proposal = {
      id,
      title,
      description,
      creator,
      startTime: Date.now(),
      endTime,
      options,
      votes,
      status: 'active'
    };

    this.proposals.set(id, proposal);
    return proposal;
  }

  castVote(proposalId: string, voter: string, optionIndex: number, weight: number): boolean {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active' || Date.now() > proposal.endTime) {
      return false;
    }
    if (optionIndex < 0 || optionIndex >= proposal.options.length) {
      return false;
    }

    const voteId = `${proposalId}_${voter}`;
    if (this.votes.has(voteId)) return false;

    const vote: Vote = {
      proposalId,
      voter,
      optionIndex,
      weight,
      timestamp: Date.now()
    };

    this.votes.set(voteId, vote);
    proposal.votes[optionIndex] += weight;
    return true;
  }

  finalizeProposal(proposalId: string): boolean {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'active' || Date.now() < proposal.endTime) {
      return false;
    }

    const totalVotes = Object.values(proposal.votes).reduce((a, b) => a + b, 0);
    const maxVotes = Math.max(...Object.values(proposal.votes));
    
    proposal.status = maxVotes > totalVotes * 0.5 ? 'passed' : 'rejected';
    return true;
  }
}
