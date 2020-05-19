import React from 'react'
import { Grid, Card, Reveal, Image } from 'semantic-ui-react'
import mana from '../../static/images/mana.png';
import LogoSpinner from '../LogoSpinner'
import Spinner from '../Spinner'
import Fade from 'react-reveal/Fade'
import Menu from './menu';


let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  isRunningTransaction: false,
  isDashboard: false,
  isLoading: true,
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
  render() {
    if ( this.state.isLoading === true) {
      return (
        <div>
          <Spinner show={this.state.isLoading}/>
        </div>
      )
    }
    return (
      <div className="games-dashboard">
        <Menu dashboard={this.state.isDashboard}/>
        <LogoSpinner show={this.state.isRunningTransaction}/>
        <div className="games-dashboard-content">
          <Fade bottom distance="20px" duration="600">
            <h3 className="account-other-h3 games"> Exchange </h3>
            <p className="account-other-p games" style={{ paddingTop: '6px' }}>  Swap mainchain assets before depositing to Matic. </p>
          </Fade>
          <Fade bottom distance="20px" duration="600" delay="300">
            <div className="games-container">
              <iframe
                src="https://uniswap.exchange/swap?outputCurrency=0x0f5d2fb29fb7d3cfee444a200298f468908cc942"
                height="600px"
                style={{
                  border: '0',
                  margin: '0 0 0 0 ',
                  display: 'block',
                  borderRadius: '3px',
                  width: '87.7vw'
                }}
                id="myId"
              />
            </div>
          </Fade>
        </div>
      </div>
    )
  }
}

export default Exchange;
