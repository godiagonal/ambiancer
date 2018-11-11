import { Effect } from './effect';

export class LowpassFilter extends Effect<BiquadFilterNode> {
  constructor(context: AudioContext, name: string, enabled: boolean = true) {
    const node = context.createBiquadFilter();
    node.type = 'lowpass';
    node.frequency.value = 600;

    super(name, node, enabled);
  
  }
}
