import { Effect } from "./Effect";

export class Delay extends Effect<GainNode> {
  private output: GainNode;
  private delay: DelayNode;
  private feedback: GainNode;
  private filter: BiquadFilterNode;

  public constructor(context: AudioContext, name: string, enabled = true) {
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

  public setDelayTime(value: number): void {
    this.delay.delayTime.value = value;
  }

  public setFeedback(value: number): void {
    this.feedback.gain.value = value;
  }

  public setFilterFrequency(value: number): void {
    this.filter.frequency.value = value;
  }

  public connect(target: AudioNode): void {
    this.output.connect(target);
  }

  public disconnect(): void {
    this.output.disconnect();
  }
}
