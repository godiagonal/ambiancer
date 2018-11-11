import {Effect} from './effects';

export class AudioBus {
  private _input: AudioNode;
  private _output: AudioNode;
  private _fxChain: Effect<AudioNode>[];
  private _handleFxChainChanged: (fxChain: Effect<AudioNode>[]) => void;

  constructor(context: AudioContext, input: AudioNode = context.createGain(), output: AudioNode = context.createGain()) {
    this._input = input;
    this._output = output;
  
    this.setFxChain([]);
  }

  public get input() {
    return this._input;
  }

  public get output() {
    return this._output;
  }
  
  public connect(target: AudioNode) {
    this._output.connect(target);
  }
  
  public findFx(name: string) {
    return this._fxChain.find(fx => fx.name === name);
  }
  
  public setFxChain(fxChain: Effect<AudioNode>[]) {
    this._fxChain = fxChain;
    this._connectFxChain();
  
    if (this._handleFxChainChanged) {
      this._handleFxChainChanged(this._fxChain);
    }
  }
  
  public toggleFx(name: string) {
    const foundFx = this.findFx(name);
    if (foundFx) {
      foundFx.enabled = !foundFx.enabled;
      this._connectFxChain();

      if (this._handleFxChainChanged) {
        this._handleFxChainChanged(this._fxChain);
      }
    }
  }
  
  public onFxChainChanged(callback: (fxChain: Effect<AudioNode>[]) => void) {
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
