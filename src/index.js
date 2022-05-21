import network from 'network';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';

import 'assets/scss/material-kit-pro-react.scss?v=1.9.0';
import './styles/index.scss';
import './i18n';

// if (network) {
  
// }

// useEffect(() => {
//   if (window.ethereum != null) {
ReactDOM.render(<Root />, document.getElementById('root'));
  // }
// }, [window.ethereum.networkVersion])

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// import * as serviceWorker from './serviceWorker';
// serviceWorker.unregister();
