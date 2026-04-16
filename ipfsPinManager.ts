export interface PinObject {
  cid: string;
  name: string;
  size: number;
  pinnedAt: number;
  expireAt?: number;
  status: 'pinned' | 'unpinned' | 'expired';
  peers: number;
}

export class IPFSPinManager {
  private pinnedObjects: Map<string, PinObject> = new Map();
  private maxPins = 1000;

  addPin(cid: string, name: string, size: number, expireDays?: number): PinObject {
    if (this.pinnedObjects.size >= this.maxPins) {
      throw new Error('已达到最大Pin数量限制');
    }

    const now = Date.now();
    const pin: PinObject = {
      cid,
      name,
      size,
      pinnedAt: now,
      status: 'pinned',
      peers: Math.floor(Math.random() * 20) + 5
    };

    if (expireDays) {
      pin.expireAt = now + expireDays * 86400000;
    }

    this.pinnedObjects.set(cid, pin);
    return pin;
  }

  removePin(cid: string): boolean {
    const pin = this.pinnedObjects.get(cid);
    if (!pin) return false;
    
    pin.status = 'unpinned';
    return true;
  }

  checkExpired(): void {
    const now = Date.now();
    this.pinnedObjects.forEach(pin => {
      if (pin.expireAt && pin.expireAt <= now && pin.status === 'pinned') {
        pin.status = 'expired';
      }
    });
  }

  getPinInfo(cid: string): PinObject | null {
    return this.pinnedObjects.get(cid) || null;
  }

  listPinnedFiles(): PinObject[] {
    return Array.from(this.pinnedObjects.values()).filter(p => p.status === 'pinned');
  }

  getStorageUsage(): { totalSize: number; count: number } {
    let totalSize = 0;
    let count = 0;
    
    this.pinnedObjects.forEach(pin => {
      if (pin.status === 'pinned') {
        totalSize += pin.size;
        count++;
      }
    });

    return { totalSize, count };
  }
}
