export class Effect<T extends AudioNode> {
  name: string;
  node: T;
  enabled: boolean;

  constructor(name: string, node: T, enabled: boolean = true) {
    this.name = name;
    this.node = node;
    this.enabled = enabled;
  }
  
  connect(target: AudioNode) {
    this.node.connect(target);
  }
  
  disconnect() {
    this.node.disconnect();
  }
}
