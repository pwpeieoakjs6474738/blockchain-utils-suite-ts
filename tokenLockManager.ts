export interface TokenLock {
  id: string;
  tokenAddress: string;
  owner: string;
  amount: string;
  unlockTime: number;
  isRevocable: boolean;
  isClaimed: boolean;
  createTime: number;
}

export class TokenLockManager {
  private locks: Map<string, TokenLock> = new Map();

  createLock(
    tokenAddress: string,
    owner: string,
    amount: string,
    unlockTime: number,
    isRevocable: boolean
  ): TokenLock {
    if (unlockTime <= Date.now()) {
      throw new Error('解锁时间必须晚于当前时间');
    }

    const id = `lock_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`;
    const lock: TokenLock = {
      id,
      tokenAddress,
      owner,
      amount,
      unlockTime,
      isRevocable,
      isClaimed: false,
      createTime: Date.now()
    };

    this.locks.set(id, lock);
    return lock;
  }

  claimLock(lockId: string, claimant: string): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || lock.isClaimed || lock.owner !== claimant) return false;
    if (Date.now() < lock.unlockTime) return false;

    lock.isClaimed = true;
    return true;
  }

  revokeLock(lockId: string, operator: string): boolean {
    const lock = this.locks.get(lockId);
    if (!lock || !lock.isRevocable || lock.isClaimed) return false;
    if (lock.owner !== operator) return false;

    this.locks.delete(lockId);
    return true;
  }

  getUserLocks(userAddress: string): TokenLock[] {
    return Array.from(this.locks.values()).filter(
      lock => lock.owner.toLowerCase() === userAddress.toLowerCase()
    );
  }

  getAvailableLocks(): TokenLock[] {
    const now = Date.now();
    return Array.from(this.locks.values()).filter(
      lock => !lock.isClaimed && lock.unlockTime <= now
    );
  }
}
