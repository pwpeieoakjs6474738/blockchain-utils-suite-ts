export interface StorageFile {
  cid: string;
  name: string;
  size: number;
  mimeType: string;
  uploadTime: number;
  pinStatus: boolean;
  replicas: number;
}

export class DecentralizedStorage {
  private files: Map<string, StorageFile> = new Map();

  uploadFile(name: string, data: Buffer, mimeType: string): StorageFile {
    const cid = this.generateCID(data);
    const file: StorageFile = {
      cid,
      name,
      size: data.length,
      mimeType,
      uploadTime: Date.now(),
      pinStatus: true,
      replicas: 3
    };

    this.files.set(cid, file);
    return file;
  }

  getFile(cid: string): StorageFile | null {
    return this.files.get(cid) || null;
  }

  pinFile(cid: string): boolean {
    const file = this.files.get(cid);
    if (!file) return false;
    
    file.pinStatus = true;
    file.replicas = Math.min(file.replicas + 1, 5);
    return true;
  }

  unpinFile(cid: string): boolean {
    const file = this.files.get(cid);
    if (!file) return false;
    
    file.pinStatus = false;
    return true;
  }

  listAllFiles(): StorageFile[] {
    return Array.from(this.files.values());
  }

  private generateCID(data: Buffer): string {
    const hash = require('crypto').createHash('sha256').update(data).digest('hex');
    return `Qm${hash.slice(0, 46)}`;
  }
}
