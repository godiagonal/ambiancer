import Effect from './effect';
import Context from '../audio-context';

export default class LowpassFilter extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
  
    this.node = Context.createBiquadFilter();
    this.node.type = 'lowpass';
    this.node.frequency.value = 600;
  }
}
