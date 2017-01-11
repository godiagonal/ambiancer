import Effect from './effect';
import Context from '../audio-context';

export default class Panner extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
    
    this.node = Context.createStereoPanner();
    this.node.pan.value = 0;
  }
}
