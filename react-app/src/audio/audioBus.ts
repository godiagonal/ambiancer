import { Effect } from './effects';

export class AudioBus {
  private _input: AudioNode;
  private _output: AudioNode;
  private _fxChain: Array<Effect<AudioNode>>;
  private _handleFxChainChanged: (fxChain: Array<Effect<AudioNode>>) => void;

  constructor(context: AudioContext, input: AudioNode = context.createGain(), output: AudioNode = context.createGain()) {
    this._input = input;
    this._output = output;
  
    this.setFxChain([]);
  }

  get input() {
    return this._input;
  }

  get output() {
    return this._output;
  }
  
  connect(target: AudioNode) {
    this._output.connect(target);
  }
  
  findFx(name: string) {
    return this._fxChain.find(fx => fx.name === name);
  }
  
  setFxChain(fxChain: Array<Effect<AudioNode>>) {
    this._fxChain = fxChain;
    this._connectFxChain();
  
    if (this._handleFxChainChanged) {
      this._handleFxChainChanged(this._fxChain);
    }
  }
  
  toggleFx(name: string) {
    const foundFx = this.findFx(name);
    if (foundFx) {
      foundFx.enabled = !foundFx.enabled;
      this._connectFxChain();

      if (this._handleFxChainChanged) {
        this._handleFxChainChanged(this._fxChain);
      }
    }
  }
  
  onFxChainChanged(callback: (fxChain: Array<Effect<AudioNode>>) => void) {
    this._handleFxChainChanged = callback;
    callback(this._fxChain);
  }
  
  private _connectFxChain() {
    const fxChain = this._fxChain.filter(fx => fx.enabled);
    
    if (fxChain.length) {
      this._input.disconnect();
      this._input.connect(fxChain[0].node);
      
      for (let i = 1; i < fxChain.length; i++) {
        fxChain[i - 1].disconnect();
        fxChain[i - 1].connect(fxChain[i].node);
      }
  
      fxChain[fxChain.length - 1].disconnect();
      fxChain[fxChain.length - 1].connect(this._output);
    } else {
      this._input.disconnect();
      this._input.connect(this._output);
    }
  }
}
