export class Oscillator {
  private _oscillator: OscillatorNode;
  private _gain: GainNode;
  private _volume: AudioParam;

  public constructor(
    context: AudioContext,
    frequency: number,
    destination: AudioNode = context.destination,
  ) {
    this._oscillator = context.createOscillator();
    this._gain = context.createGain();
    this._volume = this._gain.gain;

    this._oscillator.frequency.value = frequency;
    this._volume.value = 0;

    this._oscillator.connect(this._gain);
    this._gain.connect(destination);

    this._oscillator.start(0);
  }

  public setType(type: OscillatorType): void {
    this._oscillator.type = type;
  }

  public start(): void {
    this._volume.value = 1;
  }

  public stop(): void {
    this._volume.value = 0;
  }
}
