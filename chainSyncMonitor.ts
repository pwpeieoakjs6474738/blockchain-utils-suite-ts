export interface SyncStatus {
  currentBlock: number;
  targetBlock: number;
  progress: number;
  isSyncing: boolean;
  peers: number;
  syncSpeed: number;
}

export class ChainSyncMonitor {
  private chainType: string;
  private lastBlock = 0;
  private lastCheckTime = Date.now();

  constructor(chainType: string) {
    this.chainType = chainType;
  }

  getSyncStatus(currentBlock: number, targetBlock: number, peers: number): SyncStatus {
    const now = Date.now();
    const timeDiff = (now - this.lastCheckTime) / 1000;
    const blockDiff = currentBlock - this.lastBlock;
    
    const syncSpeed = timeDiff > 0 ? Math.floor(blockDiff / timeDiff) : 0;
    const progress = targetBlock > 0 ? (currentBlock / targetBlock) * 100 : 0;
    
    this.lastBlock = currentBlock;
    this.lastCheckTime = now;

    return {
      currentBlock,
      targetBlock,
      progress: Number(progress.toFixed(2)),
      isSyncing: currentBlock < targetBlock,
      peers,
      syncSpeed
    };
  }

  checkHealth(status: SyncStatus): { healthy: boolean; message: string } {
    if (status.isSyncing && status.syncSpeed < 10) {
      return { healthy: false, message: '同步速度过慢' };
    }
    if (status.peers < 3) {
      return { healthy: false, message: '节点连接数不足' };
    }
    if (status.progress > 99) {
      return { healthy: true, message: '同步完成' };
    }
    return { healthy: true, message: '运行正常' };
  }

  resetMonitor(): void {
    this.lastBlock = 0;
    this.lastCheckTime = Date.now();
  }
}
