import React from 'react';
import { Provider } from '../store';
import App from 'next/app';
import 'decentraland-ui/lib/styles.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import Aux from '../components/_Aux';
import Global from '../components/Constants';

class Application extends App {
  constructor(props) {
    super(props);

    this.state = {
      isDashboard: false,
    };

    this.userAddress = '';
  }

  componentDidMount() {
    // set user's address and onboard status
    if (window.web3) {
      this.userAddress = window.web3.currentProvider.selectedAddress;
      this.getUserStatus();
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get user's onboard status
  getUserStatus = async () => {
    console.log("getting user's onboard status...");

    let response = await this.fetchUserStatus();
    let json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('no data returned');
      }

      let stepValue = parseInt(json.result);
      if (stepValue > 3) {
        this.setState({ isDashboard: true });
      }
    }
  };

  fetchUserStatus = () => {
    return fetch(`${Global.API_BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
      }),
    });
  };

  render() {
    const { Component, pageProps, store } = this.props;

    console.log('isDashboard 1: ' + this.state.isDashboard);
    console.log('initial props...');
    console.log(this.props);

    return (
      <Aux>
        <Provider store={store}>
          <Component {...pageProps} isDashboard={this.state.isDashboard} />
        </Provider>
      </Aux>
    );
  }
}
export default Application;
