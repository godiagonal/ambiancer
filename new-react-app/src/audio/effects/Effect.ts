export class Effect<T extends AudioNode> {
  public constructor(
    public name: string,
    public node: T,
    public enabled = true,
  ) {
    this.name = name;
    this.node = node;
    this.enabled = enabled;
  }

  public connect(target: AudioNode): void {
    this.node.connect(target);
  }

  public disconnect(): void {
    this.node.disconnect();
  }
}
