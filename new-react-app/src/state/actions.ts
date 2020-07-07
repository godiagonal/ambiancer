import {
  createStandardAction as createAction,
  ActionType,
} from "typesafe-actions";
import { NoteString } from "../audio";

export const rootActions = {
  toggleAudioSettings: createAction("TOGGLE_AUDIOSETTINGS")<boolean>(),
  toggleAutoPlay: createAction("TOGGLE_AUTOPLAY")<boolean>(),
  setBpm: createAction("SET_BPM")<number>(),
  setAmbience: createAction("SET_AMBIENCE")<number>(),
  setNotes: createAction("SELECT_NOTES")<NoteString[]>(),
  setOctaveMin: createAction("SET_OCTAVEMIN")<number>(),
  setOctaveMax: createAction("SET_OCTAVEMAX")<number>(),
  setTouchPosition: createAction("SET_TOUCHPOS")<[number, number] | null>(),
};

export type RootAction = ActionType<typeof rootActions>;
