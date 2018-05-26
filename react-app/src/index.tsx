import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Synth } from './features/synth';
import registerServiceWorker from './registerServiceWorker';
import withRootStyles from './withRootStyles';

// TODO: add HOC for Provider store, withStore
const Root = withRootStyles(() => (
  <Synth />
));

ReactDOM.render(<Root />, document.getElementById('root') as HTMLElement);

registerServiceWorker();
