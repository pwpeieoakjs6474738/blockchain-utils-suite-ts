import { createHash } from 'crypto';

export class MerkleTreeGenerator {
  private leaves: string[];
  private layers: string[][];

  constructor(data: string[]) {
    this.leaves = data.map(item => this.hash(item));
    this.layers = [this.leaves];
    this.buildTree();
  }

  private hash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  private buildTree(): void {
    let currentLayer = this.leaves;
    
    while (currentLayer.length > 1) {
      const nextLayer: string[] = [];
      
      for (let i = 0; i < currentLayer.length; i += 2) {
        const left = currentLayer[i];
        const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left;
        nextLayer.push(this.hash(left + right));
      }
      
      this.layers.push(nextLayer);
      currentLayer = nextLayer;
    }
  }

  getRoot(): string {
    return this.layers[this.layers.length - 1][0];
  }

  getProof(index: number): string[] {
    const proof: string[] = [];
    let currentIndex = index;

    for (let i = 0; i < this.layers.length - 1; i++) {
      const layer = this.layers[i];
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < layer.length) {
        proof.push(layer[siblingIndex]);
      }

      currentIndex = Math.floor(currentIndex / 2);
    }

    return proof;
  }
}
