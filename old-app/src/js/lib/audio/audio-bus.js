import Context from './audio-context';

export default class AudioBus {
  constructor(input = Context.createGain(), output = Context.createGain()) {
    this.input = input;
    this.output = output;
  
    this.setFxChain([]);
  }
  
  connect(target) {
    this.output.connect(target);
  }
  
  findFx(name) {
    return this.fxChain.find(fx => fx.name === name);
  }
  
  setFxChain(fxChain) {
    this.fxChain = fxChain;
    this.connectFxChain();
  
    if (this.handleFxChainChanged) {
      this.handleFxChainChanged(this.fxChain);
    }
  }
  
  toggleFx(name) {
    const foundFx = this.findFx(name);
    if (foundFx) {
      foundFx.enabled = !foundFx.enabled;
      this.connectFxChain();
    }
  
    if (this.handleFxChainChanged) {
      this.handleFxChainChanged(this.fxChain);
    }
  }
  
  connectFxChain() {
    const fxChain = this.fxChain.filter(fx => fx.enabled);
    
    if (fxChain.length) {
      this.input.disconnect();
      this.input.connect(fxChain[0].node);
      
      for (let i = 1; i < fxChain.length; i++) {
        fxChain[i - 1].disconnect();
        fxChain[i - 1].connect(fxChain[i].node);
      }
  
      fxChain[fxChain.length - 1].disconnect();
      fxChain[fxChain.length - 1].connect(this.output);
    } else {
      this.input.disconnect();
      this.input.connect(this.output);
    }
  }
  
  onFxChainChanged(callback) {
    this.handleFxChainChanged = callback;
    callback(this.fxChain);
  }
}
