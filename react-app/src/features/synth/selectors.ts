// import { createSelector } from 'reselect';

import { SynthState } from './reducer';

export const getAutoPlay = (state: SynthState) => state.autoPlay;
export const getBpm = (state: SynthState) => state.bpm;
