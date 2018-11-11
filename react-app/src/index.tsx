import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './audio/polyfill';

import { Synth } from './features/synth';
import registerServiceWorker from './registerServiceWorker';
import withRootStyles from './withRootStyles';
import withStore from './withStore';

const Root =
  withStore(
    withRootStyles(
      Synth
    )
  );

ReactDOM.render(<Root />, document.getElementById('root') as HTMLElement);

registerServiceWorker();
