import Context from './audio-context';

export default class Oscillator {
  constructor(frequency, destination = Context.destination) {
    this.oscillator = Context.createOscillator();
    this.gain = Context.createGain();
    this.volume = this.gain.gain;
    
    this.oscillator.frequency.value = frequency;
    this.volume.value = 0;
    
    this.oscillator.connect(this.gain);
    this.gain.connect(destination);
    
    this.oscillator.start(0);
  }
  
  setType(type) {
    this.oscillator.type = type;
  }
  
  start() {
    this.volume.value = 1;
  }
  
  stop() {
    this.volume.value = 0;
  }
}
