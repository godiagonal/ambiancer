import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";
import { synthReducer } from "../features/synth";

export const rootReducer = combineReducers({
  synth: synthReducer,
});

export type RootState = StateType<typeof rootReducer>;
