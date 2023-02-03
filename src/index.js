import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './redux';

import App from './App';
import * as serviceWorker from './serviceWorker';
import packageJson from '../package.json';

ReactDOM.render(
  <Provider store={store}>
    <App version={packageJson.version} />
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
