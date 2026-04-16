export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  txHash?: string;
}

export class BlockchainLogger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogLevel, module: string, message: string, data?: any, txHash?: string): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      module,
      message,
      data,
      txHash
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    this.printLog(entry);
  }

  info(module: string, message: string, data?: any, txHash?: string): void {
    this.log(LogLevel.INFO, module, message, data, txHash);
  }

  warn(module: string, message: string, data?: any, txHash?: string): void {
    this.log(LogLevel.WARN, module, message, data, txHash);
  }

  error(module: string, message: string, data?: any, txHash?: string): void {
    this.log(LogLevel.ERROR, module, message, data, txHash);
  }

  debug(module: string, message: string, data?: any, txHash?: string): void {
    this.log(LogLevel.DEBUG, module, message, data, txHash);
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  private printLog(entry: LogEntry): void {
    const time = new Date(entry.timestamp).toISOString();
    const tx = entry.txHash ? `[${entry.txHash.slice(0, 10)}...]` : '';
    console.log(`[${time}] [${entry.level}] [${entry.module}] ${tx} ${entry.message}`);
  }
}
