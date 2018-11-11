import { Effect } from './effect';

export class Distortion extends Effect<WaveShaperNode> {
  constructor(context: AudioContext, name: string, enabled: boolean = true) {
    const node = context.createWaveShaper();
    node.oversample = '4x';

    super(name, node, enabled);

    this.setDistortion(400);
  }
  
  setDistortion(value: number) {
    this.node.curve = Distortion.makeDistortionCurve(value);
  }
  
  static makeDistortionCurve(amount: number) {
    let k = amount,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x = 0;
    for (; i < n_samples; ++i) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  }
}
