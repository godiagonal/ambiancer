import { createStandardAction } from 'typesafe-actions';

import {
  TOGGLE_AUTOPLAY,
  UPDATE_BPM,
} from './actionTypes';

export const updateBpm = createStandardAction(UPDATE_BPM)<number>();
export const toggleAutoPlay = createStandardAction(TOGGLE_AUTOPLAY)();
