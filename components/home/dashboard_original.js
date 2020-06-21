import React from 'react';
import { Image, Button, Icon, Modal } from 'semantic-ui-react';
import Spinner from '../Spinner';
// import Menu from './menu';
import Fade from 'react-reveal/Fade';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import defaultBackground from '../../static/images/default.png';

let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  // isRunningTransaction: false,
  isDashboard: false,
  // selectedMenu: 0,
  isLoading: true,
  isVideoLoading: true,
};

class Dashboard extends React.Component {
  // showSpinner = () => this.setState({ isRunningTransaction: true });
  // hideSpinner = () => this.setState({ isRunningTransaction: false });

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../Constants').default;
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      // this.isBrowserMetamsk = 1;
    }
    await this.getUserData();
    this.setState({ isLoading: false });

    var video = document.getElementById('myVideo');
    video.onloadedmetadata = function () {
      var bgImg = document.getElementById('bgImg');
      bgImg.style.display = 'none';
    };
  }

  // getUserVerify = () => {
  //   return fetch(`${Global.API_BASE_URL}/order/verifyAddress`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       address: USER_ADDRESS,
  //     }),
  //   });
  // };

  getUserData = async () => {
    //   console.log('USER_ADDRESS: ' + USER_ADDRESS);

    //   try {
    //     let response = await this.getUserVerify();
    //     let json = await response.json();
    //     if (json.status === 'ok') {
    //       if (json.result === 'false') {
    //         return;
    //       }
    //       let stepValue = parseInt(json.result);
    //       if (stepValue > 3) {
    this.setState({ isDashboard: true });
    //       }
    //       return;
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
  };

  // walletInfo = () => {
  //   this.setState({ isDashboard: true });
  // };

  // selectedMenu = async (index) => {
  //   this.setState({ selectedMenu: index });
  // };

  getContent = () => {
    return (
      <div>
        <div className="mobile-menu">
          <img
            className="mobile-menu-image"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
          />
        </div>
        <div className="mobile-menu-words">
          <a className="mobile-menu-item-1" href="/blog">
            {' '}
            BLOG{' '}
          </a>
          <a
            className="mobile-menu-item-2"
            href="https://docs.decentral.games"
            target="_blank"
          >
            {' '}
            DOCS{' '}
          </a>
          <Modal
            trigger={<a className="mobile-menu-item-2"> DEMO </a>}
            closeIcon
            basic
            size="small"
          >
            <Modal.Content>
              <iframe
                className="mobile-demo-video"
                src="https://www.youtube.com/embed/qklQZBooM-8?&autoplay=1"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </Modal.Content>
          </Modal>
        </div>

        {/* <LogoSpinner show={this.state.isRunningTransaction} /> */}

        <div className="home-video-container">
          {this.state.isVideoLoading === true ? (
            <img
              id="bgImg"
              src={defaultBackground}
              style={{ width: '100vw' }}
            ></img>
          ) : (
            <div></div>
          )}
          <video
            id="myVideo"
            src="https://res.cloudinary.com/dnzambf4m/video/upload/v1590041720/dg_site_vid_1_ytcfka.mp4"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
            className="home-dashboard-video"
          ></video>
        </div>
        <div className="home-dashboard-content">
          <div>
            <div className="home-dashboard-description">
              <Fade bottom distance="20px" duration={600}>
                <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
                <h3
                  className="home-dashboard-h3"
                  style={{ marginBottom: '-12px' }}
                >
                  Tominoya
                </h3>
                {this.state.isDashboard === true ? (
                  <div>
                    <Button
                      color="blue"
                      className="play-button"
                      href="https://play.decentral.games"
                      target="_blank"
                      style={{ marginRight: '30px' }}
                    >
                      PLAY NOW
                    </Button>
                    <Button
                      color="blue"
                      className="play-shimmer"
                      target="_blank"
                      href="https://docs.decentral.games/getting-started"
                    >
                      HOW TO PLAY
                    </Button>
                  </div>
                ) : (
                  <Button
                    color="blue"
                    className="play-shimmer"
                    href="https://docs.decentral.games/getting-started"
                    target="_blank"
                  >
                    HOW TO PLAY
                  </Button>
                )}
                <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
                  Sporting a Japanese aesthetic, Tominoya is a virtual casino in
                  Decentraland, a decentralized virtual world. Enjoy
                  non-custodial, pseudo-anonymous, and provably fair crypto
                  gameplay with your friends.
                </p>
                <p className="home-dashboard-p">Games: Slots, Roulette</p>
              </Fade>
            </div>
          </div>
          <p className="mobile-footer">Use a Chrome desktop browser to play.</p>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.isLoading) return <Spinner background={0} />;

    return (
      <div>
        <div className="home-dashboard">
          {/* <Menu dashboard={this.state.isDashboard} /> */}
          {this.getContent()}
        </div>
      </div>
    );
  }
}

export default Dashboard;
