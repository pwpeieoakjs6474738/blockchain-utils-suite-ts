export interface PeerNode {
  id: string;
  ip: string;
  port: number;
  chainId: number;
  latency: number;
  isConnected: boolean;
}

export class P2PNetworkManager {
  private peers: Map<string, PeerNode> = new Map();
  private maxPeers = 50;

  addPeer(peer: PeerNode): boolean {
    if (this.peers.size >= this.maxPeers) return false;
    if (this.peers.has(peer.id)) return false;
    
    this.peers.set(peer.id, { ...peer, latency: this.randomLatency() });
    return true;
  }

  removePeer(peerId: string): boolean {
    return this.peers.delete(peerId);
  }

  connectToPeer(peerId: string): boolean {
    const peer = this.peers.get(peerId);
    if (!peer) return false;
    
    peer.isConnected = true;
    peer.latency = this.randomLatency();
    return true;
  }

  disconnectPeer(peerId: string): void {
    const peer = this.peers.get(peerId);
    if (peer) peer.isConnected = false;
  }

  getBestPeer(): PeerNode | null {
    const connectedPeers = Array.from(this.peers.values()).filter(p => p.isConnected);
    if (connectedPeers.length === 0) return null;
    
    return connectedPeers.reduce((best, current) => 
      current.latency < best.latency ? current : best
    );
  }

  private randomLatency(): number {
    return Math.floor(Math.random() * 500) + 20;
  }

  getAllPeers(): PeerNode[] {
    return Array.from(this.peers.values());
  }
}
