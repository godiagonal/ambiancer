import { Effect } from "./Effect";

export class LowpassFilter extends Effect<BiquadFilterNode> {
  public constructor(context: AudioContext, name: string, enabled = true) {
    const node = context.createBiquadFilter();
    node.type = "lowpass";
    node.frequency.value = 600;

    super(name, node, enabled);
  }
}
