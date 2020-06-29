import React from 'react';
import { Provider } from '../store';
import App from 'next/app';
import 'decentraland-ui/lib/styles.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import Aux from '../components/_Aux';
import Status from '../components/Status';
import Balances from '../components/Balances';
import Transactions from '../components/Transactions';

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props;
    return (
      <Aux>
        <Provider store={store}>
          <Status />
          <Balances />
          <Transactions />

          <Component {...pageProps} />
        </Provider>
      </Aux>
    );
  }
}
export default Application;
