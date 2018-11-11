import SbReverb from 'soundbank-reverb';
import { Effect } from './effect';

// TODO: Typings for reverb node
export class Reverb extends Effect<any> {
  constructor(context: AudioContext, name: string, enabled: boolean = true) {
    const node = SbReverb(context);
    node.time = 6;
    node.wet.value = 1;
    node.dry.value = 0.5;
    node.filterType = 'lowpass';
    node.cutoff.value = 4000;

    super(name, node, enabled);
  }
}
