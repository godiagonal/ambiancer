import * as actionTypes from './actionTypes';

export const setBpm = (bpm: number) => ({
  type: actionTypes.SET_BPM,
  payload: { bpm }
});