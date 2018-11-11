import { Effect } from './effect';

export class Delay extends Effect<AudioNode> {
  private output: GainNode;
  private delay: DelayNode;
  private feedback: GainNode;
  private filter: BiquadFilterNode;

  constructor(context: AudioContext, name: string, enabled: boolean = true) {
    const input = context.createGain();
  
    super(name, input, enabled);

    this.output = context.createGain();
    
    this.delay = context.createDelay();
    this.delay.delayTime.value = 0.4;
  
    this.feedback = context.createGain();
    this.feedback.gain.value = 0.6;
  
    this.filter = context.createBiquadFilter();
    this.filter.frequency.value = 1000;
  
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);
  
    this.node.connect(this.delay);
    this.node.connect(this.output);
    this.delay.connect(this.output);
  }
  
  setDelayTime(value: number) {
    this.delay.delayTime.value = value;
  }
  
  setFeedback(value: number) {
    this.feedback.gain.value = value;
  }
  
  setFilterFrequency(value: number) {
    this.filter.frequency.value = value;
  }
  
  connect(target: AudioNode) {
    this.output.connect(target);
  }
  
  disconnect() {
    this.output.disconnect();
  }
}
