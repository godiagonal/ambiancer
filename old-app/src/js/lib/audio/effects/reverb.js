import SbReverb from 'soundbank-reverb';
import Effect from './effect';
import Context from '../audio-context';

export default class Reverb extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
  
    this.node = SbReverb(Context);
    this.node.time = 6;
    this.node.wet.value = 1;
    this.node.dry.value = 0.5;
    this.node.filterType = 'lowpass';
    this.node.cutoff.value = 4000;
  }
}
