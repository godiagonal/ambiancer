import * as React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore } from "./store";

const { store, persistor } = configureStore();

export function withStore<TProps>(
  Component: React.ComponentType<TProps>,
): React.FC<TProps> {
  const WithStore = (props: TProps) => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...props} />
      </PersistGate>
    </Provider>
  );

  return WithStore;
}
