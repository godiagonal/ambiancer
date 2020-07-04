import { Effect } from "./Effect";

export class Panner extends Effect<StereoPannerNode> {
  public constructor(context: AudioContext, name: string, enabled = true) {
    const node = context.createStereoPanner();
    node.pan.value = 0;

    super(name, node, enabled);
  }
}
