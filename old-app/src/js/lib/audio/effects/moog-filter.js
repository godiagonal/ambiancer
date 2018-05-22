import Effect from './effect';
import Context from '../audio-context';

const bufferSize = 4096;

export default class MoogFilter extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
    
    this.node = Context.createScriptProcessor(bufferSize, 1, 1);
    let in1;
    let in2;
    let in3;
    let in4;
    let out1;
    let out2;
    let out3;
    let out4;
    in1 = in2 = in3 = in4 = out1 = out2 = out3 = out4 = 0.0;
    this.node.cutoff = 0.065; // between 0.0 and 1.0
    this.node.resonance = 3.99; // between 0.0 and 4.0
    this.node.onaudioprocess = (e) => {
      const input = e.inputBuffer.getChannelData(0);
      const output = e.outputBuffer.getChannelData(0);
      const f = this.node.cutoff * 1.16;
      const fb = this.node.resonance * (1.0 - 0.15 * f * f);
      for (let i = 0; i < bufferSize; i++) {
        input[i] -= out4 * fb;
        input[i] *= 0.35013 * (f * f) * (f * f);
        out1 = input[i] + 0.3 * in1 + (1 - f) * out1; // Pole 1
        in1 = input[i];
        out2 = out1 + 0.3 * in2 + (1 - f) * out2; // Pole 2
        in2 = out1;
        out3 = out2 + 0.3 * in3 + (1 - f) * out3; // Pole 3
        in3 = out2;
        out4 = out3 + 0.3 * in4 + (1 - f) * out4; // Pole 4
        in4 = out3;
        output[i] = out4;
      }
    };
  }
}
