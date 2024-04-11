export class Logger {
  constructor(
    private readonly name: string,
    private readonly logEvents?: boolean
  ) {}
  log(...args: unknown[]) {
    this.logEvents && console.log(`[query cache: ${this.name}]: `, ...args);
  }
}
