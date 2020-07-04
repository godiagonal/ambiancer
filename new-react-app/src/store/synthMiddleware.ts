import { Middleware } from "redux";
import {
  createAudioContext,
  Delay,
  Distortion,
  LowpassFilter,
  NoteGenerator,
  Panner,
  Reverb,
  Synthesizer,
} from "../audio";
import { RootState } from "./rootReducer";

export function synthMiddleware(): Middleware<unknown, RootState> {
  const context = createAudioContext();

  const distortion = new Distortion(context, "distortion");
  const reverb = new Reverb(context, "reverb");
  const reverb2 = new Reverb(context, "reverb2");
  const delay = new Delay(context, "delay");
  const lowpassFilter = new LowpassFilter(context, "lowpass");
  const panner = new Panner(context, "panner");

  const synth = new Synthesizer(context, false, "sawtooth");
  synth.audioBus.setFxChain([
    distortion,
    delay,
    reverb,
    reverb2,
    lowpassFilter,
    panner,
  ]);

  const setAmbienceLevel = (level: number) => {
    const lowThreshold = 0.25;
    const mediumThreshold = 0.5;
    const highThreshold = 0.75;

    if (level < lowThreshold) {
      const relLevel = level / lowThreshold;
      delay.setFeedback(relLevel * 0.6);
    } else {
      delay.setFeedback(0.6);
    }

    if (level < mediumThreshold) {
      const relLevel = level / mediumThreshold;
      reverb.node.wet.value = relLevel;
    } else {
      reverb.node.wet.value = 1;
    }

    if (level < highThreshold) {
      const relLevel = level / highThreshold;
      reverb.node.dry.value = 1 - relLevel;
      reverb.node.cutoff.value = (1 - relLevel) * 3000 + 1000;
      reverb.node.time = relLevel * 10;
    } else {
      reverb.node.dry.value = 0;
      reverb.node.cutoff.value = 1000;
      reverb.node.time = 10;
    }

    if (level >= mediumThreshold) {
      const relLevel = (level - mediumThreshold) / mediumThreshold;
      reverb2.node.dry.value = 1 - relLevel;
      reverb2.node.wet.value = relLevel;
      reverb2.node.cutoff.value = (1 - relLevel) * 3000 + 1000;
      reverb2.node.time = relLevel * 10;
    } else {
      reverb2.node.dry.value = 1;
      reverb2.node.wet.value = 0;
      reverb2.node.cutoff.value = 4000;
      reverb2.node.time = 0;
    }
  };

  const synthMiddleware: Middleware<unknown, RootState> = ({ getState }) => (
    next,
  ) => (action) => {
    const prevState = getState().synth;
    const returnValue = next(action);
    const state = getState().synth;

    if (prevState.autoPlay !== state.autoPlay) {
      synth.toggleAutoPlay(state.autoPlay);
    }

    if (prevState.bpm !== state.bpm) {
      synth.setAutoPlayBpm(state.bpm);
    }

    if (
      prevState.notes !== state.notes ||
      prevState.octaveMin !== state.octaveMin ||
      prevState.octaveMax !== state.octaveMax
    ) {
      synth.setAutoPlayNoteGenerator(
        new NoteGenerator(state.notes, {
          min: state.octaveMin,
          max: state.octaveMax,
        }),
      );
    }

    if (prevState.ambience !== state.ambience) {
      setAmbienceLevel(state.ambience * 0.01);
    }

    return returnValue;
  };

  return synthMiddleware;
}
