import { combineReducers } from "redux";
import { StateType } from "typesafe-actions";
import { synthReducer } from "../features/synth";

declare module "react-redux" {
  function useSelector<TState = RootState, TSelected = unknown>(
    selector: (state: TState) => TSelected,
    equalityFn?: (left: TSelected, right: TSelected) => boolean,
  ): TSelected;
}

export const rootReducer = combineReducers({
  synth: synthReducer,
});

export type RootState = StateType<typeof rootReducer>;
