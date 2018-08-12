// import { createSelector } from 'reselect';

import { SynthState } from './models';

export const getAutoPlay = (state: SynthState) => state.autoPlay;
export const getAmbience = (state: SynthState) => state.ambience;
export const getBpm = (state: SynthState) => state.bpm;
export const getNotes = (state: SynthState) => state.notes;
