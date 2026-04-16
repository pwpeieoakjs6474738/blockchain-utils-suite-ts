export interface StakingParams {
  principal: number;
  apy: number;
  durationDays: number;
  compoundFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface RewardResult {
  totalReward: number;
  finalAmount: number;
  dailyReward: number;
  rewardBreakdown: number[];
}

export class StakingRewardCalculator {
  static calculate(params: StakingParams): RewardResult {
    const { principal, apy, durationDays, compoundFrequency } = params;
    
    const ratePerPeriod = this.getRatePerPeriod(apy, compoundFrequency);
    const periods = this.getTotalPeriods(durationDays, compoundFrequency);
    const breakdown = [];
    
    let current = principal;
    for (let i = 0; i < periods; i++) {
      const reward = current * ratePerPeriod;
      current += reward;
      breakdown.push(Number(reward.toFixed(4)));
    }

    const totalReward = current - principal;
    const dailyReward = totalReward / durationDays;

    return {
      totalReward: Number(totalReward.toFixed(4)),
      finalAmount: Number(current.toFixed(4)),
      dailyReward: Number(dailyReward.toFixed(4)),
      rewardBreakdown: breakdown
    };
  }

  private static getRatePerPeriod(apy: number, frequency: string): number {
    const freqMap: Record<string, number> = {
      daily: 365,
      weekly: 52,
      monthly: 12
    };
    return apy / 100 / freqMap[frequency];
  }

  private static getTotalPeriods(days: number, frequency: string): number {
    const freqMap: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30
    };
    return Math.floor(days / freqMap[frequency]);
  }
}
