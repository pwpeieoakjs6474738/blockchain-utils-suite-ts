export enum ProviderType {
  HTTP = 'http',
  WEBSOCKET = 'ws',
  INJECTED = 'injected'
}

export interface ProviderConfig {
  type: ProviderType;
  url?: string;
  chainId: number;
  timeout?: number;
}

export interface ProviderInstance {
  instance: any;
  chainId: number;
  isConnected: boolean;
  latency: number;
}

export class Web3ProviderManager {
  private providers: Map<string, ProviderInstance> = new Map();

  createProvider(config: ProviderConfig): ProviderInstance {
    const key = `${config.type}_${config.chainId}`;
    const existing = this.providers.get(key);
    
    if (existing) return existing;

    const instance = this.createProviderInstance(config);
    const provider: ProviderInstance = {
      instance,
      chainId: config.chainId,
      isConnected: true,
      latency: this.randomLatency()
    };

    this.providers.set(key, provider);
    return provider;
  }

  getProvider(chainId: number, type: ProviderType): ProviderInstance | null {
    const key = `${type}_${chainId}`;
    return this.providers.get(key) || null;
  }

  disconnectProvider(chainId: number, type: ProviderType): void {
    const key = `${type}_${chainId}`;
    const provider = this.providers.get(key);
    if (provider) provider.isConnected = false;
  }

  testLatency(chainId: number, type: ProviderType): number {
    const provider = this.getProvider(chainId, type);
    if (!provider) return -1;
    
    provider.latency = this.randomLatency();
    return provider.latency;
  }

  private createProviderInstance(config: ProviderConfig): any {
    return {
      type: config.type,
      chainId: config.chainId,
      url: config.url,
      isConnected: true
    };
  }

  private randomLatency(): number {
    return Math.floor(Math.random() * 300) + 50;
  }
}
