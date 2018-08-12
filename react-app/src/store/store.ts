import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './rootReducer';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

function configureStore(initialState = {}) {
  const middleware = [];

  if (process.env.NODE_ENV !== 'production') {
    middleware.push(logger);
  }

  const store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(...middleware)
  );

  const persistor = persistStore(store)

  return { store, persistor };
}

export default configureStore;
