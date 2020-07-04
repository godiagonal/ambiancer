import { Effect } from "./Effect";

export class Distortion extends Effect<WaveShaperNode> {
  public constructor(context: AudioContext, name: string, enabled = true) {
    const node = context.createWaveShaper();
    node.oversample = "4x";

    super(name, node, enabled);

    this.setDistortion(400);
  }

  public setDistortion(value: number): void {
    this.node.curve = Distortion.makeDistortionCurve(value);
  }

  public static makeDistortionCurve(amount: number): Float32Array {
    const nSamples = 44100;
    const curve = new Float32Array(nSamples);
    const deg = Math.PI / 180;
    let i = 0;
    let x = 0;
    for (; i < nSamples; i += 1) {
      x = (i * 2) / nSamples - 1;
      curve[i] =
        ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
  }
}
