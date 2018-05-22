import Effect from './effect';
import Context from '../audio-context';

export default class Delay extends Effect {
  constructor(name, node = null, enabled = true) {
    super(name, node, enabled);
  
    this.input = Context.createGain();
    this.output = Context.createGain();
    
    this.delay = Context.createDelay();
    this.delay.delayTime.value = 0.4;
  
    this.feedback = Context.createGain();
    this.feedback.gain.value = 0.6;
  
    this.filter = Context.createBiquadFilter();
    this.filter.frequency.value = 1000;
  
    this.delay.connect(this.feedback);
    this.feedback.connect(this.filter);
    this.filter.connect(this.delay);
  
    this.input.connect(this.delay);
    this.input.connect(this.output);
    this.delay.connect(this.output);
  
    this.node = this.input;
  }
  
  setDelayTime(value) {
    this.delay.delayTime.value = value;
  }
  
  setFeedback(value) {
    this.feedback.gain.value = value;
  }
  
  setFilterFrequency(value) {
    this.filter.frequency.value = value;
  }
  
  connect(target) {
    this.output.connect(target);
  }
  
  disconnect() {
    this.output.disconnect();
  }
}
