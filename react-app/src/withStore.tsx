import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import configureStore from './store';

const { store, persistor } = configureStore();

function withStore(Component: React.ComponentType) {
  const WithStore = (props: object) => (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Component {...props} />
      </PersistGate>
    </Provider>
  );

  return WithStore;
}

export default withStore;
