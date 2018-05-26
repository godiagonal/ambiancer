import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as synthActions from './actions';

export type SynthAction = ActionType<typeof synthActions>;

export type SynthState = Readonly<{
  autoPlay: boolean;
  bpm: number;
}>;

export default combineReducers<SynthState, SynthAction>({
  autoPlay: (state = false, action) => {
    switch (action.type) {
      case getType(synthActions.toggleAutoPlay):
        return !state;

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
});
