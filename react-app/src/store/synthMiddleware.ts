import {
  Dispatch,
  Middleware,
  MiddlewareAPI,
} from 'redux';

import {
  createAudioContext,
  Delay,
  Distortion,
  LowpassFilter,
  NoteGenerator,
  Panner,
  Reverb,
  Synthesizer,
} from 'src/audio';

export default function() {
  const context = createAudioContext();

  const distortion = new Distortion(context, 'distortion');
  const reverb = new Reverb(context, 'reverb');
  const reverb2 = new Reverb(context, 'reverb2');
  const delay = new Delay(context, 'delay');
  const lowpassFilter = new LowpassFilter(context, 'lowpass');
  const panner = new Panner(context, 'panner');

  const synth = new Synthesizer(context, false, 'sawtooth');
  synth.audioBus.setFxChain([
    distortion,
    delay,
    reverb,
    reverb2,
    lowpassFilter,
    panner,
  ]);

  const noteGenerator = new NoteGenerator(["A", "C", "D"], {start: 2, end: 5});
  synth.setAutoPlayNoteGenerator(noteGenerator);
  synth.setAutoPlayBpm(60);
  // synth.toggleAutoPlay();

  const synthMiddleware: Middleware = ({ getState }: MiddlewareAPI) => (
    next: Dispatch
  ) => action => {
    console.log('will dispatch', action)

    const returnValue = next(action)

    console.log('state after dispatch', getState())

    return returnValue
  }

  return synthMiddleware
}