export default class Effect {
  constructor(name, node = null, enabled = true) {
    this.name = name;
    this.node = node;
    this.enabled = enabled;
  }
  
  connect(target) {
    this.node.connect(target);
  }
  
  disconnect() {
    this.node.disconnect();
  }
}
