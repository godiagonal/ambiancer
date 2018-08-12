import { createStandardAction } from 'typesafe-actions';
import { Note } from './models';

export const updateBpm = createStandardAction('synth/UPDATE_BPM')<number>();
export const updateAmbience = createStandardAction('synth/UPDATE_AMBIENCE')<number>();
export const toggleAutoPlay = createStandardAction('synth/TOGGLE_AUTOPLAY')();
export const selectNotes = createStandardAction('synth/SELECT_NOTES')<Note[]>();
