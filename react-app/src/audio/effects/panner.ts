import { Effect } from './effect';

export class Panner extends Effect<StereoPannerNode> {
  constructor(context: AudioContext, name: string, enabled: boolean = true) {
    const node = context.createStereoPanner();
    node.pan.value = 0;

    super(name, node, enabled);
  }
}
