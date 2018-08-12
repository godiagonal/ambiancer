import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as synthActions from './actions';
import { SynthState } from './models';

export type SynthAction = ActionType<typeof synthActions>;

export default combineReducers<SynthState, SynthAction>({
  audioSettingsOpen: (state = false, action) => {
    switch (action.type) {
      case getType(synthActions.toggleAudioSettings):
        return action.payload;

      default:
        return state;
    }
  },
  autoPlay: (state = false, action) => {
    switch (action.type) {
      case getType(synthActions.toggleAutoPlay):
        return action.payload;

      default:
        return state;
    }
  },
  ambience: (state = 50, action) => {
    switch (action.type) {
      case getType(synthActions.updateAmbience):
        return action.payload;

      default:
        return state;
    }
  },
  bpm: (state = 120, action) => {
    switch (action.type) {
      case getType(synthActions.updateBpm):
        return action.payload;

      default:
        return state;
    }
  },
  notes: (state = ['A', 'D', 'E', 'F#', 'G'], action) => {
    switch (action.type) {
      case getType(synthActions.selectNotes):
        return action.payload.sort((a, b) => {
            if(a < b) { return -1; }
            if(a > b) { return 1; }
            return 0;
        });

      default:
        return state;
    }
  },
  octaveMin: (state = 3, action) => {
    switch (action.type) {
      case getType(synthActions.updateOctaveMin):
        return action.payload;

      default:
        return state;
    }
  },
  octaveMax: (state = 6, action) => {
    switch (action.type) {
      case getType(synthActions.updateOctaveMax):
        return action.payload;

      default:
        return state;
    }
  },
});
