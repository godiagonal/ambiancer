import { createStandardAction } from 'typesafe-actions';
import { Note } from './models';

export const toggleAudioSettings = createStandardAction('synth/TOGGLE_AUDIOSETTINGS')<boolean>();
export const updateBpm = createStandardAction('synth/UPDATE_BPM')<number>();
export const updateAmbience = createStandardAction('synth/UPDATE_AMBIENCE')<number>();
export const toggleAutoPlay = createStandardAction('synth/TOGGLE_AUTOPLAY')();
export const selectNotes = createStandardAction('synth/SELECT_NOTES')<Note[]>();
