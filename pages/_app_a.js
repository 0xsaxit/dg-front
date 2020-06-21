// import React from 'react';
import React, { useEffect, useContext } from 'react';

// import { GlobalContext } from '../store';
import { Provider, GlobalContext } from '../store';

import App from 'next/app';

import 'decentraland-ui/lib/styles.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
// import GetStatusVerify from '../components/modal/GetStatusVerify';
import Aux from '../components/_Aux';
import { sendData } from 'next/dist/next-server/server/api-utils';

// class Application extends App {
function Application(props) {
  // render() {

  const { Component, pageProps, store } = props;
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    const sendData = () => {
      const data = true;

      console.log('sending reducer data...');

      dispatch({
        type: 'update_status',
        data,
      });
    };

    sendData();
  }, []);

  return (
    <Aux>
      <Provider store={store}>
        <Component {...pageProps} sendData={sendData()} />
      </Provider>
    </Aux>
  );

  // }
}
export default Application;
