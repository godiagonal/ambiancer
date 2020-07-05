import { createStandardAction as createAction } from "typesafe-actions";
import { NoteString } from "../../audio";

export const toggleAudioSettings = createAction("synth/TOGGLE_AUDIOSETTINGS")<
  boolean
>();

export const toggleAutoPlay = createAction("synth/TOGGLE_AUTOPLAY")<boolean>();

export const setBpm = createAction("synth/UPDATE_BPM")<number>();

export const setAmbience = createAction("synth/UPDATE_AMBIENCE")<number>();

export const setNotes = createAction("synth/SELECT_NOTES")<NoteString[]>();

export const setOctaveMin = createAction("synth/UPDATE_OCTAVEMIN")<number>();

export const setOctaveMax = createAction("synth/UPDATE_OCTAVEMAX")<number>();
