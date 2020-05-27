import React from 'react'
import { Grid, Card, Reveal, Image } from 'semantic-ui-react'
import mana from '../../static/images/mana.png';
import LogoSpinner from '../LogoSpinner'
import Spinner from '../Spinner'
import Fade from 'react-reveal/Fade'
import Menu from './menu';
import transakSDK from '@transak/transak-sdk'

let Global;
let transak = new transakSDK({
  apiKey: '4fcd6904-706b-4aff-bd9d-77422813bbb7',  // Your API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'ETH',
  walletAddress: '', // Your customer's wallet address
  themeColor: '000000', // App theme color
  fiatCurrency: '', // INR/GBP
  email: '', // Your customer's email address
  redirectURL: '',
  // hostURL: window.location.origin,
  widgetHeight: '550px',
  widgetWidth: '450px'
});
var USER_ADDRESS;

const INITIAL_STATE = {
  isRunningTransaction: false,
  isDashboard: false,
  isLoading: true,
  exchangeState: 0,
};

class Exchange extends React.Component {
  showSpinner = () => this.setState({isRunningTransaction: true})
  hideSpinner = () => this.setState({isRunningTransaction: false})

  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../constant').default;
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
    await this.getUserData();
    this.setState({isLoading: false});
    
    transak.init();
    // To get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
        console.log(data)
    });
    // This will trigger when the user closed the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
        transak.close();
    });
    // This will trigger when the user marks payment is made.
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
        console.log(orderData);
        transak.close();
    });

  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      })
    })
  }
  getUserData = async () => {
    try {
      let response = await this.getUserVerify();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }
        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          this.setState({isDashboard: true});
        }
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  buy = () => {
    transak.init();
    this.setState({ exchangeState: 0 });
  };
  exchange = () => {
    transak.close();
    this.setState({ exchangeState: 1 });
  };

  render() {
    if (this.state.isLoading === true) {
      return (
        <div>
          <Spinner show={this.state.isLoading} />
        </div>
      );
    }
    return (
      <div className="games-dashboard">
        <Menu dashboard={this.state.isDashboard} />
          <div className="games-dashboard-content">
            <Fade bottom distance="20px" duration="600">
              <h3 className="account-other-h3 games"> Exchange </h3>
            </Fade>
            <Fade bottom distance="20px" duration="600">
              {this.state.exchangeState == 0 ? (
                <p className="account-other-p">
                  <b className="account-hover" style={{ color: 'white' }}>Buy Crypto</b>{' '}
                  <span style={{ color: 'white' }}>|</span>{' '}
                  <abbr
                    className="account-hover"
                    style={{ color: 'white' }}
                    onClick={() => this.exchange()}
                  >
                    Exchange Crypto{' '}
                  </abbr>
                </p>
              ) : (
                <p className="account-other-p">
                  <abbr className="account-hover" onClick={() => this.buy()} style={{ color: 'white' }}>
                    Buy Crypto
                  </abbr>{' '}
                  <span style={{ color: 'white' }}>|</span> 
                  <b className="account-hover" style={{ color: 'white' }}> Exchange Crypto</b>
                </p>
              )}
            </Fade>

            {this.state.exchangeState == 0 ? ( 
              <div>
              </div>
            ) : (               
              <div className="games-container"
                style={{ marginLeft: 'calc(50vw - 350px)'}}>
                <iframe
                  src="https://uniswap.exchange/swap?outputCurrency=0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
                  style={{
                    border: '0',
                    margin: '0 0 0 0 ',
                    display: 'block',
                    borderRadius: '3px',
                    width: '450px',
                    height: 'calc(100vh - 230px)',
                    marginTop: '15px'
                  }}
                />
              </div>
            )}
        </div>
      </div>

    )
  }
}

export default Exchange;
