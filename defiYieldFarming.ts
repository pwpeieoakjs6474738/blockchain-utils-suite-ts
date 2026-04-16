export interface FarmPool {
  id: string;
  token: string;
  rewardToken: string;
  apy: number;
  tvl: number;
  lockPeriod: number;
  isActive: boolean;
}

export interface UserFarmPosition {
  userId: string;
  poolId: string;
  stakedAmount: number;
  rewardDebt: number;
  pendingReward: number;
  stakeTime: number;
}

export class DeFiYieldFarming {
  private pools: Map<string, FarmPool> = new Map();
  private positions: Map<string, UserFarmPosition> = new Map();

  createFarmPool(
    token: string,
    rewardToken: string,
    apy: number,
    lockPeriodDays: number
  ): FarmPool {
    const id = `farm_${Date.now()}`;
    const pool: FarmPool = {
      id,
      token,
      rewardToken,
      apy,
      tvl: 0,
      lockPeriod: lockPeriodDays * 86400,
      isActive: true
    };

    this.pools.set(id, pool);
    return pool;
  }

  stakeTokens(userId: string, poolId: string, amount: number): boolean {
    const pool = this.pools.get(poolId);
    if (!pool || !pool.isActive) return false;

    const key = `${userId}_${poolId}`;
    const existing = this.positions.get(key);

    if (existing) {
      existing.stakedAmount += amount;
      existing.stakeTime = Date.now();
    } else {
      this.positions.set(key, {
        userId,
        poolId,
        stakedAmount: amount,
        rewardDebt: 0,
        pendingReward: 0,
        stakeTime: Date.now()
      });
    }

    pool.tvl += amount;
    return true;
  }

  calculatePendingReward(position: UserFarmPosition, pool: FarmPool): number {
    const timeStaked = Date.now() - position.stakeTime;
    const rewardPerSecond = (pool.apy / 100 * position.stakedAmount) / 31536000;
    return timeStaked * rewardPerSecond;
  }

  claimReward(userId: string, poolId: string): number {
    const key = `${userId}_${poolId}`;
    const position = this.positions.get(key);
    const pool = this.pools.get(poolId);

    if (!position || !pool) return 0;

    const reward = this.calculatePendingReward(position, pool);
    position.pendingReward = 0;
    position.rewardDebt = 0;
    return reward;
  }
}
