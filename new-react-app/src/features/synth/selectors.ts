import { NoteString } from "../../audio";
import { SynthState } from "./models";

export const getAudioSettingsOpen = (state: SynthState): boolean =>
  state.audioSettingsOpen;
export const getAutoPlay = (state: SynthState): boolean => state.autoPlay;
export const getAmbience = (state: SynthState): number => state.ambience;
export const getBpm = (state: SynthState): number => state.bpm;
export const getNotes = (state: SynthState): NoteString[] => state.notes;
export const getOctaveMin = (state: SynthState): number => state.octaveMin;
export const getOctaveMax = (state: SynthState): number => state.octaveMax;
