import React from 'react'
import { Image, Button } from 'semantic-ui-react'
import LogoSpinner from '../LogoSpinner';
import Spinner from '../Spinner'
import Menu from './menu';
import Wallet from './walletOverlay';
import WalletInfo from './walletInfo';
import Fade from 'react-reveal/Fade';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import History from './history';
import Coin from './coin';
import About from './about';

let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  isRunningTransaction: false,
  isDashboard: false,
  selectedMenu: 0,
  isLoading: true,
};

class Dashboard extends React.Component {
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
      this.isBrowserMetamsk = 1;
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
  walletInfo = () => {
    this.setState({isDashboard: true});
  }

  selectedMenu = async (index) => {
    this.setState({ selectedMenu: index });
  };

  getContent = () => {
    return (
      <div>
      <div className="mobile-menu">
        <img className="mobile-menu-image" src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"/>
      </div>
      <div className="mobile-menu-words">
        <a className="mobile-menu-item-1" href="/blog"> BLOG </a>
        <a className="mobile-menu-item-2" href="https://docs.decentral.games"> DOCS </a>
      </div>
      <LogoSpinner show={this.state.isRunningTransaction} />
      <div className='home-video-container'>
        <video src="https://res.cloudinary.com/dnzambf4m/video/upload/v1589652801/account_cp9td3.mp4" type="video/mp4" frameborder="0" autoplay="true" loop muted className="home-dashboard-video">
        </video>
      </div>
      <div className="home-dashboard-content">
        <div>
          <div className="home-dashboard-description">
            <Fade bottom distance="20px" duration="600">
              <p className="featured-casino-text">FEATURED CASINO</p>
              <h3 className="home-dashboard-h3">Tominoya</h3>
              <p className="home-dashboard-p">Tominoya is Decentral Games' third casino, located at (-120, 135) in the Decentraland Metaverse. The structure sports an elegant Japenese inspired feng shui, situated in an ideal location in Vegas City.</p>
              <p className="home-dashboard-p">Games: MANA Slots, MANA Roulette</p>
            </Fade>
          </div>
          <Fade bottom distance="20px" duration="600">
            { this.state.isDashboard === true ?
              <div>
                <Button color='blue' className="play-button"
                href="https://play.decentral.games"
                >
                  PLAY NOW
                </Button>
                <Button color='blue' className="play-shimmer"
                href="https://how.decentral.games"
                >
                  HOW TO PLAY
                </Button>
              </div>
            :
              <Button color='blue' className="play-shimmer"
              href="https://how.decentral.games"
              >
                HOW TO PLAY
              </Button>
            }
          </Fade>
          <div className="teleport">
            <Fade bottom distance="20px" duration="600" delay="300">
              <p className="featured-casino-text" id="mobile-casino-text" style={{ paddingTop: '60px' }}>ALL CASINOS</p>
            </Fade>
            <Fade bottom distance="20px" duration="600" delay="300">
              <div className="dashboard-image-container">
                <a href="https://play.decentraland.org/?position=-75%2C77&realm=fenrir-gold">
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/chateau_account_preview_xezmyv_obtddn_v5r3gv.jpg" className="dashboard-image"/>
                </a>
                <a href="https://play.decentraland.org/?position=-55%2C143&realm=fenrir-gold">
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058163/serenity_account_preview_b6v4sn_lq3udz_krd9f3.jpg" className="dashboard-image" />
                </a>
                <a href="https://play.decentraland.org/?position=-118%2C134&realm=fenrir-gold">
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058165/tominoya_account_preview_tshnux_c6rgvv_rqd6ct.jpg" className="dashboard-image" />
                </a>
              </div>
            </Fade>
          </div>
        </div>
      <p className="mobile-footer">Use a Chrome desktop browser to play.</p>
      </div></div>
    );
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
      <div>
        <Fade bottom distance="20px" duration="600" delay="300">
          { this.state.isDashboard === true ?  
            <WalletInfo showSpinner={this.showSpinner} hideSpinner={this.hideSpinner}/>
          : 
            <Wallet showSpinner={this.showSpinner} hideSpinner={this.hideSpinner} walletInfo={this.walletInfo} />}
        </Fade> 
        <div className="home-dashboard">
          <Menu dashboard={this.state.isDashboard}/>
          {this.getContent()}
          </div>
      </div>
    )
  }
}

export default Dashboard;
