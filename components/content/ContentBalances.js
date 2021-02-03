import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import Global from '../Constants';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import ModalAcceptMana from '../modal/ModalAcceptMana';
import ModalAcceptDai from '../modal/ModalAcceptDai';
import { ConnextModal } from '@connext/vector-modal';

let transak_1 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  defaultCryptoCurrency: 'MANA',
  cryptoCurrencyList: 'MANA',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Matic MANA directly',
});

let transak_2 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  defaultCryptoCurrency: 'DAI',
  cryptoCurrencyList: 'DAI',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Matic DAI directly',
});

const ContentBalances = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [margin, setMargin] = useState('125px');
  const [boxDAI, setBoxDAI] = useState('none');
  const [boxMANA, setBoxMANA] = useState('none');
  const [buttonDAI, setButtonDAI] = useState('block');
  const [buttonMANA, setButtonMANA] = useState('block');
  const [totalDAI, setTotalDAI] = useState(0);
  const [totalMANA, setTotalMANA] = useState(0);
  const [totalPLAY, setTotalPLAY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showModal_3, setShowModal_3] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  const [injectedProvider, setInjectedProvider] = useState('');

  let buttonPlay = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // set top padding of balancees container dependent on top bar message height
  useEffect(() => {
    const interval = setInterval(() => {
      var messageBar = document.getElementById('message-bar');
      if (messageBar) {
        var height = messageBar.offsetHeight;
        setMargin(90 + height + 'px');
      } else {
        setMargin('90px');
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.userStatus === 6) {
      setBoxDAI('block');
      setButtonDAI('none');
      setButtonMANA('block');
    } else if (state.userStatus === 7) {
      setBoxMANA('block');
      setButtonDAI('block');
      setButtonMANA('none');
    } else if (state.userStatus === 8) {
      setBoxDAI('block');
      setBoxMANA('block');
      setButtonDAI('none');
      setButtonMANA('none');
    }
  }, [state.userStatus]);

  useEffect(() => {
    buttonPlay = document.getElementById('play-now-button-balances');
  }, []);

  useEffect(() => {
    if (buttonPlay) {
      analytics.trackLink(buttonPlay, 'Clicked PLAY NOW (balances page)');
    }
  }, [buttonPlay]);

  useEffect(() => {
    // get all the events
    transak_1.on(transak_1.ALL_EVENTS, (data) => {
      console.log(data);
    });
    transak_2.on(transak_2.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // triggers when the user closes the widget
    transak_1.on(transak_1.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_1.close();
    });
    transak_2.on(transak_2.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_2.close();
    });

    // triggers when the payment is complete
    transak_1.on(transak_1.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak_1.close();
    });
    transak_2.on(transak_2.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak_2.close();
    });
  }, []);

  // initialize transak modal
  function show_transak_1() {
    transak_1.init();

    // initializePings();
  }
  function show_transak_2() {
    transak_2.init();

    // initializePings();
  }

  // top up user to 5000 play tokens
  async function topUp() {
    await Fetch.TOP_UP_USER(state.userAddress);

    let responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
    let json = await responseInfo.json();

    let arrayInfo = state.userInfo;
    arrayInfo[3] = json.callCount;

    dispatch({
      type: 'user_info',
      data: arrayInfo,
    });
  }

  // fetch total bet from API
  useEffect(() => {
    if (state.userAddress) {
      (async function () {
        const response = await Fetch.PLAYER_DATA(state.userAddress);
        const json = await response.json();

        setTotalDAI(
          (json.DAI.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
        );
        setTotalMANA(
          (json.MANA.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
        );
        setTotalPLAY(
          (json.PLAY.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
        );
      })();
    }
  }, [state.userAddress]);

  // initialize token contract pings
  function initializePings() {
    if (state.userStatus >= 6) {
      console.log('Ping token contract');
    }
  }

  // close function
  function close() {
    if (state.balancesOverlay === 3) {
      dispatch({
        type: 'balances_overlay',
        data: 2,
      });
    } else {
      dispatch({
        type: 'balances_overlay',
        data: 0,
      });
    }
  }

  const marginTop = {
    marginTop: margin,
  };

  const styles = {
    boxDAI: {
      display: boxDAI || 'none',
    },
    buttonDAI: {
      display: buttonDAI || 'none',
    },
    boxMANA: {
      display: boxMANA || 'none',
    },
    buttonMANA: {
      display: buttonMANA || 'none',
    },
  };

  useEffect(() => {
    if (state.userAddress) {
      setInjectedProvider(window.ethereum);
    } else {
      setInjectedProvider('');
    }
  }, [state.userAddress]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAccountPage() {
    return (
      <Grid className="balances-container" style={marginTop}>
        <div className="DG-column top" style={{ marginBottom: '15px' }}>
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="DG-h3">How To Deposit and Withdraw Crypto</h3>
            <p>
              To deposit to Matic, click deposit and select the amount you'd
              like to send. To withdraw to Ethereum, ensure you've switched to{' '}
              <a
                href="https://docs.matic.network/docs/develop/metamask/config-matic/"
                style={{ color: '#2085f4' }}
                target="_blank"
              >
                Matic RPC{' '}
              </a>
              in Metamask and then click withdraw. For further explanation,
              please visit our{' '}
              <a
                href="https://docs.decentral.games"
                style={{ color: '#2085f4' }}
                target="_blank"
              >
                docs
              </a>
              .
            </p>
          </span>
        </div>

        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column one"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.PLAY_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Play</p>
                <p className="account-name">{state.userInfo[2]}</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled
                className="balances-top-button"
                target="_blank"
                style={{ marginTop: '-75px' }}
              >
                FREE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount"> {totalPLAY} </p>
            </span>

            <Divider />

            <span className="balances-button-span">
              <Button
                id="play-now-button-balances"
                className="balances-play-button"
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                target="_blank"
              >
                PLAY NOW
              </Button>
              {state.userInfo[3] === 2 ? (
                <Button disabled className="balances-play-button">
                  TOP UP
                </Button>
              ) : (
                <Button
                  onClick={() => topUp()}
                  className="balances-play-button"
                  id="balances-padding-correct"
                >
                  TOP UP
                </Button>
              )}
            </span>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column two"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.MANA_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Mana</p>
                <p className="account-name">
                  {parseInt(state.userBalances[1][1]).toLocaleString()}
                </p>
              </span>
            </span>

            <div style={styles.boxMANA}>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  className="balances-top-button"
                  onClick={() => show_transak_1()}
                  style={{ marginTop: '-75px' }}
                >
                  PURCHASE
                </Button>
              </span>
            </div>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount">{totalMANA}</p>
            </span>

            <Divider />

            <div style={styles.boxMANA}>
              <span className="balances-button-span">
                <Button
                  className="balances-play-button"
                  disabled={!injectedProvider}
                  onClick={() => setShowModal(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  DEPOSIT
                </Button>
                <ConnextModal
                  showModal={showModal}
                  onClose={() => setShowModal(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  depositAssetId={'0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'}
                  depositChainId={1}
                  depositChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  withdrawAssetId={'0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'}
                  withdrawChainId={137}
                  withdrawChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                />
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_2(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  WITHDRAW
                </Button>
                <ConnextModal
                  showModal={showModal_2}
                  onClose={() => setShowModal_2(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  withdrawAssetId={'0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'}
                  withdrawChainId={1}
                  withdrawChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  depositAssetId={'0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'}
                  depositChainId={137}
                  depositChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                />
              </span>
            </div>

            <div style={styles.buttonMANA}>
              <span>
                <ModalAcceptMana />
              </span>
            </div>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column three"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.DAI_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Dai</p>
                <p className="account-name">
                  {parseInt(state.userBalances[0][1]).toLocaleString()}
                </p>
              </span>
            </span>

            <div style={styles.boxDAI}>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  className="balances-top-button two"
                  onClick={() => show_transak_2()}
                  style={{ marginTop: '-75px' }}
                >
                  PURCHASE
                </Button>
              </span>
            </div>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount">{totalDAI}</p>
            </span>

            <Divider />

            <div style={styles.boxDAI}>
              <span className="balances-button-span">
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_3(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  DEPOSIT
                </Button>
                <ConnextModal
                  showModal={showModal_3}
                  onClose={() => setShowModal_3(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  depositAssetId={'0x6B175474E89094C44Da98b954EedeAC495271d0F'}
                  depositChainId={1}
                  depositChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  withdrawAssetId={'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'}
                  withdrawChainId={137}
                  withdrawChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                />
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_4(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  WITHDRAW
                </Button>
                <ConnextModal
                  showModal={showModal_4}
                  onClose={() => setShowModal_4(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  withdrawAssetId={'0x6B175474E89094C44Da98b954EedeAC495271d0F'}
                  withdrawChainId={1}
                  withdrawChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  depositAssetId={'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'}
                  depositChainId={137}
                  depositChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                />
              </span>
            </div>

            <div style={styles.buttonDAI}>
              <span>
                <ModalAcceptDai />
              </span>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return contentAccountPage();
};

export default ContentBalances;
