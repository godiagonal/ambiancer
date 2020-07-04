import { createStandardAction } from "typesafe-actions";
import { NoteString } from "../../audio";

export const toggleAudioSettings = createStandardAction(
  "synth/TOGGLE_AUDIOSETTINGS",
)<boolean>();
export const toggleAutoPlay = createStandardAction("synth/TOGGLE_AUTOPLAY")<
  boolean
>();
export const updateBpm = createStandardAction("synth/UPDATE_BPM")<number>();
export const updateAmbience = createStandardAction("synth/UPDATE_AMBIENCE")<
  number
>();
export const selectNotes = createStandardAction("synth/SELECT_NOTES")<
  NoteString[]
>();
export const updateOctaveMin = createStandardAction("synth/UPDATE_OCTAVEMIN")<
  number
>();
export const updateOctaveMax = createStandardAction("synth/UPDATE_OCTAVEMAX")<
  number
>();
