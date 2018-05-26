import * as React from 'react';
import { Provider } from 'react-redux';

import store from './store';

function withStore(Component: React.ComponentType) {
  const WithStore = (props: object) => (
    <Provider store={store}>
      <Component {...props} />
    </Provider>
  );

  return WithStore;
}

export default withStore;