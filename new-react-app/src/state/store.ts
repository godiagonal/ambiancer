import { applyMiddleware, createStore, Store } from "redux";
import { logger } from "redux-logger";
import { persistStore, persistReducer, Persistor } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { theme } from "../theme";
import { rootReducer } from "./reducer";
import { RootState } from "./state";
import { synthMiddleware } from "./synthMiddleware";

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
  },
  rootReducer,
);

export function configureStore(): {
  store: Store<RootState>;
  persistor: Persistor;
} {
  const middleware = [synthMiddleware()];

  if (process.env.NODE_ENV !== "production") {
    middleware.push(logger);
  }

  const store: Store<RootState> = createStore(
    persistedReducer,
    {
      audioSettingsHeight: theme.audioSettingsClosedHeight,
    },
    applyMiddleware(...middleware),
  );

  const persistor = persistStore(store);

  return { store, persistor };
}
