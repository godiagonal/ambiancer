import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';

import rootReducer from './rootReducer';

function configureStore(initialState = {}) {
  const middleware = [];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }

  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
}

const store = configureStore();

export default store;
