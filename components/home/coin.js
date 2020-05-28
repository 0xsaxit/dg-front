import React from 'react';
import Fade from 'react-reveal/Fade';
import { Image, Button, Grid, Divider, Icon } from 'semantic-ui-react';
import ABITominoya from '../ABI/ABITominoya';
import Menu from './menu';
import Spinner from '../Spinner';

let Global;

var USER_ADDRESS;
var USER_ADDRESS_TEMP = '0x968ba97EC67b5F8017419e640e19D2a0c95Bd6E2'; // change this to USER_ADDRESS later

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
  NFTstate: 0,
  isDashboard: false,
  isLoading: true,
};

class Coin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../constants').default;
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
    await this.getUserData();
    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );

    // this.verifyNetwork();
    await this.getTokenBalance();

    this.getEthBalance();
    await this.getUserName();
    this.getParcelID();
  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      }),
    });
  };
  getUserData = async () => {
    try {
      let response = await this.getUserVerify();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          location.href = '/';
          return;
        }
        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          this.setState({ isDashboard: true });
        } else {
          location.href = '/';
          return;
        }
        this.setState({ isLoading: false });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  getUserInfo = () => {
    return fetch(`${Global.BASE_URL}/order/getUser`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
      }),
    });
  };

  getUserName = async () => {
    try {
      let response = await this.getUserInfo();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }

        this.setState({ username: json.name });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getParcelID = async () => {
    try {
      const NFT_CONTRACT = window.web3.eth
        .contract(ABITominoya)
        .at('0xF4618abb5E8031454238696A0F013DcD1476dc33');

      await NFT_CONTRACT.tokenOfOwnerByIndex(
        USER_ADDRESS_TEMP,
        0,
        (err, tokens) => {
          if (err) return;

          console.log(tokens.c);
          this.setState({ result: tokens.c });
        }
      );

      return;
    } catch (error) {
      console.log('getting parcel ID failed', error);
    }
  };

  getTokenBalance = async () => {
    try {
      var amount;

      amount = await Global.balanceOfToken('matic', this.maticWeb3);
      this.setState({
        tokenBalance: window.web3.fromWei(amount, 'ether').toFixed(0),
      });
    } catch (err) {
      console.log(err);
    }
  };

  getEthBalance = () => {
    try {
      var Obj = this;
      // window.web3.eth.getBalance(USER_ADDRESS, function(err, amount) {
      //   if (err)
      //     return;

      //   Obj.setState({ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
      // });
      this.maticWeb3.eth.getBalance(USER_ADDRESS, function (err, amount) {
        if (err) return;

        Obj.setState({
          ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8),
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // verifyNetwork = () => {
  //   window.web3.version.getNetwork(async (err, network) => {
  //     if (network === Global.MATIC_NETWORK_ID) {
  //       this.isMatic = true;
  //       await this.getTokenBalance(true);
  //     } else {
  //       this.isMatic = false;
  //       await this.getTokenBalance(false);
  //     }
  //   });
  // };

  myNFTs = () => {
    this.setState({ NFTstate: 0 });
  };
  buyNFTs = () => {
    this.setState({ NFTstate: 1 });
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
      <div>
        <Menu dashboard={this.state.isDashboard} />
        <div className="contentContainer" style={{ height: '100vh' }}>
          <div className="account-other-inner-container">
            <Fade bottom distance="20px" duration="600">
              <h3 className="account-other-h3"> NFTs </h3>
            </Fade>
            <Fade bottom distance="20px" duration="600">
              {this.state.NFTstate == 0 ? (
                <p className="account-other-p">
                  <b className="account-hover">My NFTs</b> |{' '}
                  <abbr
                    className="account-hover"
                    onClick={() => this.buyNFTs()}
                  >
                    Buy NFTs{' '}
                  </abbr>
                </p>
              ) : (
                <p className="account-other-p">
                  <abbr className="account-hover" onClick={() => this.myNFTs()}>
                    My NFTs
                  </abbr>{' '}
                  | <b className="account-hover">Buy NFTs </b>
                </p>
              )}
            </Fade>

            <Fade bottom distance="20px" duration="600" delay="200">
              {this.state.NFTstate == 0 ? (
                <div id="my-nft-box">
                  <div style={{ padding: '10px' }}>
                    <Grid
                      style={{
                        justifyContent: 'space-between',
                        alignContent: 'stretch',
                      }}
                    >
                      <Grid.Row>
                        <Grid.Column
                          className="nft-grid"
                          computer={5}
                          tablet={8}
                          mobile={16}
                        >
                          <Image
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058164/tominoya_ama8c9_vps2ad.jpg"
                            className="flamingos-nft-pic"
                            style={{ borderRadius: '4px' }}
                          />
                          <h3
                            className="account-other-h3"
                            style={{ textAlign: 'left', marginTop: '0px' }}
                          >
                            {' '}
                            Tominoya{' '}
                          </h3>
                          <Grid>
                            <Grid.Row>
                              <Grid.Column
                                className="nft-grid"
                                computer={8}
                                tablet={8}
                                mobile={16}
                              >
                                <p
                                  className="account-other-p"
                                  style={{ fontSize: '15px' }}
                                >
                                  {' '}
                                  <p className="nft-bold-content">
                                    TOKEN NUMBER
                                  </p>{' '}
                                  <br />
                                  <a href="" className="nft-number-content">
                                    {/* figure out what we want displayed here, result is very long
                                  maybe a ... in the middle?
                                  {this.state.result} */}
                                    1234
                                  </a>
                                </p>
                              </Grid.Column>
                              <Grid.Column
                                className="nft-grid"
                                computer={8}
                                tablet={8}
                                mobile={16}
                              >
                                <p
                                  className="account-other-p"
                                  style={{ fontSize: '15px' }}
                                >
                                  {' '}
                                  <p className="nft-bold-content">
                                    ADDRESS
                                  </p>{' '}
                                  <br />
                                  <a
                                    href=""
                                    style={{ color: 'rgba(1, 133, 244, 1)' }}
                                    className="nft-number-content"
                                  >
                                    0x1mn2...j2hd931
                                    <Icon
                                      name="caret right"
                                      style={{ color: '#2085F4' }}
                                    />
                                  </a>
                                </p>
                              </Grid.Column>
                              <Grid.Column
                                className="nft-grid"
                                computer={8}
                                tablet={8}
                                mobile={16}
                                style={{ marginTop: '10px' }}
                              >
                                <p
                                  className="account-other-p"
                                  style={{ fontSize: '15px' }}
                                >
                                  {' '}
                                  <p className="nft-bold-content">
                                    VOLUME
                                  </p>{' '}
                                  <br />
                                  <a href="">
                                    <Image
                                      src="../../static/images/mana.png"
                                      style={{
                                        width: '18px',
                                        marginTop: '5px',
                                        float: 'left',
                                        verticalAlign: 'middle',
                                      }}
                                    ></Image>
                                    <abbr
                                      style={{
                                        float: 'left',
                                        marginTop: '5px',
                                        marginLeft: '5px',
                                      }}
                                      className="nft-number-content"
                                    >
                                      29,109 MANA
                                    </abbr>
                                  </a>
                                </p>
                              </Grid.Column>
                              <Grid.Column
                                className="nft-grid"
                                computer={8}
                                tablet={8}
                                mobile={16}
                                style={{ marginTop: '10px' }}
                              >
                                <p
                                  className="account-other-p"
                                  style={{ fontSize: '15px' }}
                                >
                                  {' '}
                                  <p className="nft-bold-content">
                                    PROFIT
                                  </p>{' '}
                                  <br />
                                  <a href="">
                                    <Image
                                      src="../../static/images/mana.png"
                                      style={{
                                        width: '18px',
                                        marginTop: '5px',
                                        float: 'left',
                                        verticalAlign: 'middle',
                                      }}
                                    ></Image>
                                    <abbr
                                      style={{
                                        float: 'left',
                                        marginTop: '5px',
                                        marginLeft: '5px',
                                      }}
                                      className="nft-number-content"
                                    >
                                      2,120 MANA
                                    </abbr>
                                  </a>
                                </p>
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                          <br />
                          <p className="account-other-p">
                            {' '}
                            <b>Location:</b> -120, 135{' '}
                          </p>
                          <Button
                            color="blue"
                            className="nft-button"
                            href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-gold"
                          >
                            Teleport in
                          </Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </div>
              ) : (
                <div id="nft-box">
                  <div style={{ padding: '10px' }}>
                    <Grid
                      style={{
                        justifyContent: 'space-between',
                        alignContent: 'stretch',
                      }}
                    >
                      <Grid.Row>
                        <Grid.Column
                          className="nft-grid"
                          computer={5}
                          tablet={8}
                          mobile={16}
                        >
                          <Image
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058171/flamingos_ipxh3j_asfmet.jpg"
                            className="flamingos-nft-pic"
                            style={{ borderRadius: '4px' }}
                          />
                          <h3
                            className="account-other-h3"
                            style={{ textAlign: 'left', marginTop: '0px' }}
                          >
                            {' '}
                            Flamingos Casino{' '}
                          </h3>
                          <p className="account-other-p">
                            {' '}
                            The Flamingos casino is a joint venture with Vegas
                            City. The casino is located on an 88 parcel estate
                            broken up into 68 separate NFTs - ground floor (15
                            ETH), second floor (10 ETH), and third floor (7
                            ETH). The casino houses Decentral Games slots and
                            roulette, and token holders make a percentage
                            revenue from the games on their specific parcel.{' '}
                          </p>
                          <p className="account-other-p">
                            {' '}
                            <b>Location:</b> -126, 118{' '}
                          </p>
                          <Button
                            color="blue"
                            className="nft-button"
                            href="https://opensea.io/assets/vegas-city-land-lease?query=flamingos"
                          >
                            BUY ON OPENSEA
                          </Button>
                        </Grid.Column>
                        <Grid.Column
                          className="nft-grid"
                          computer={5}
                          tablet={8}
                          mobile={16}
                        >
                          <Image
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058164/tominoya_ama8c9_vps2ad.jpg"
                            className="flamingos-nft-pic"
                            style={{ borderRadius: '4px' }}
                          />
                          <h3
                            className="account-other-h3"
                            style={{ textAlign: 'left', marginTop: '0px' }}
                          >
                            {' '}
                            Tominoya{' '}
                          </h3>
                          <p className="account-other-p">
                            {' '}
                            Tominoya is a joint venture with Vegas City on a 52
                            parcel estate. The casino is broken up into 40
                            separate NFTs - 20 ground floor and 20 mezzanine.
                            The casino houses Decentral Games slots and
                            roulette, and token holders make a percentage
                            revenue from the games on their specific parcel.{' '}
                          </p>
                          <p className="account-other-p">
                            {' '}
                            <b>Location:</b> To be announced{' '}
                          </p>
                          <Button
                            color="blue"
                            className="nft-button"
                            href="https://opensea.io/assets?query=tominoya"
                          >
                            BUY ON OPENSEA
                          </Button>
                        </Grid.Column>
                        <Grid.Column
                          className="nft-grid"
                          computer={5}
                          tablet={8}
                          mobile={16}
                        ></Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </div>
                </div>
              )}
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}

export default Coin;
