import Effect from './effect';
import Context from '../audio-context';

export default class Distortion extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
  
    this.node = Context.createWaveShaper();
    this.node.oversample = '4x';
    this.setDistortion(400);
  }
  
  setDistortion(value) {
    this.node.curve = Distortion.makeDistortionCurve(value);
  }
  
  /*eslint-disable */
  
  static makeDistortionCurve(amount) {
    let k = typeof amount === 'number' ? amount : 50,
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
  
  /*eslint-enable */
}
