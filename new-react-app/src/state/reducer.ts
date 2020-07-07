import { combineReducers } from "redux";
import { getType } from "typesafe-actions";
import { rootActions, RootAction } from "./actions";
import { RootState } from "./state";

export const rootReducer = combineReducers<RootState, RootAction>({
  audioSettingsOpen: (state = false, action) => {
    switch (action.type) {
      case getType(rootActions.toggleAudioSettings):
        return action.payload;

      default:
        return state;
    }
  },
  autoPlay: (state = false, action) => {
    switch (action.type) {
      case getType(rootActions.toggleAutoPlay):
        return action.payload;

      default:
        return state;
    }
  },
  ambience: (state = 50, action) => {
    switch (action.type) {
      case getType(rootActions.setAmbience):
        return action.payload;

      default:
        return state;
    }
  },
  bpm: (state = 120, action) => {
    switch (action.type) {
      case getType(rootActions.setBpm):
        return action.payload;

      default:
        return state;
    }
  },
  notes: (state = ["A", "D", "E", "F#", "G"], action) => {
    switch (action.type) {
      case getType(rootActions.setNotes):
        return action.payload.sort((a, b) => {
          if (a < b) {
            return -1;
          }
          if (a > b) {
            return 1;
          }
          return 0;
        });

      default:
        return state;
    }
  },
  octaveMin: (state = 3, action) => {
    switch (action.type) {
      case getType(rootActions.setOctaveMin):
        return action.payload;

      default:
        return state;
    }
  },
  octaveMax: (state = 6, action) => {
    switch (action.type) {
      case getType(rootActions.setOctaveMax):
        return action.payload;

      default:
        return state;
    }
  },
  touchPosition: (state = null, action) => {
    switch (action.type) {
      case getType(rootActions.setTouchPosition):
        return action.payload;

      default:
        return state;
    }
  },
});
