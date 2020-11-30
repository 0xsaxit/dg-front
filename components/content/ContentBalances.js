import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import ButtonApproveMANA from '../button/ButtonApproveMANA';
import ButtonApproveDAI from '../button/ButtonApproveDAI';
import Global from '../Constants';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';

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
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Matic DAI directly',
});

const ContentBalances = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const dataPlay = state.transactions[1];
  const [margin, setMargin] = useState('125px');
  const [boxDAI, setBoxDAI] = useState('none');
  const [boxMANA, setBoxMANA] = useState('none');
  const [buttonDAI, setButtonDAI] = useState('block');
  const [buttonMANA, setButtonMANA] = useState('block');
  const [totalDAI, setTotalDAI] = useState(0);
  const [totalMANA, setTotalMANA] = useState(0);
  const [totalPLAY, setTotalPLAY] = useState(0);
  let userAddress = '';


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
      // setBoxMANA('none');
      setButtonDAI('none');
      setButtonMANA('block');
    } else if (state.userStatus === 7) {
      // setBoxDAI('none');
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
  }
  function show_transak_2() {
    transak_2.init();
  }


  // get user address
  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
    }
  }, [state.userStatus]);


  // top up user to 5000 play tokens
  async function topUp() {
    await Fetch.TOP_UP_USER(userAddress);

    let responseInfo = await Fetch.PLAYER_INFO(userAddress);
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
    userAddress = state.userInfo[1];

    (async function () {
      const response = await Fetch.PLAYER_DATA(userAddress);
      const json = await response.json();
      setTotalDAI((json.DAI.payout_player / Global.CONSTANTS.FACTOR).toLocaleString());
      setTotalMANA((json.MANA.payout_player / Global.CONSTANTS.FACTOR).toLocaleString());
      setTotalPLAY((json.PLAY.payout_player / Global.CONSTANTS.FACTOR).toLocaleString());    
    })();
  }, [totalDAI, totalMANA, totalDAI]);


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

  
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAccountPage() {
    return (
      <Grid className="balances-container" style={marginTop}>
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
                <p className="welcome-text"> Play </p>
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
              <p className="earned-text"> Total Winnings </p>
              <p className="earned-amount"> {totalPLAY} </p>
            </span>
            <Divider />

            <span className="balances-button-span">
              <Button
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
              <p className="earned-text">Total Winnings </p>
              <p className="earned-amount"> {totalMANA} </p>
            </span>

            <Divider />

            <div style={styles.boxMANA}>
              <span className="balances-button-span">
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  id="balances-padding-correct"
                  data-default-page="deposit"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  DEPOSIT
                </Button>
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  id="balances-padding-correct"
                  data-default-page="withdraw"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  WITHDRAW
                </Button>

                <script
                  src="https://wallet.matic.network/embeds/widget-button.js"
                  data-script-name="matic-embeds"
                ></script>
              </span>
            </div>

            <div style={styles.buttonMANA}>
              <span>
                <ButtonApproveMANA />
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
                <p className="account-name">{parseInt(state.userBalances[0][1]).toLocaleString()}</p>
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
              <p className="earned-text"> Total Winnings </p>
              <p className="earned-amount"> {totalDAI} </p>
            </span>

            <Divider />

            <div style={styles.boxDAI}>
              <span className="balances-button-span">
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  id="balances-padding-correct"
                  data-default-page="deposit"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  DEPOSIT
                </Button>
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  id="balances-padding-correct"
                  data-default-page="deposit"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  WITHDRAW
                </Button>

                <script
                  src="https://wallet.matic.network/embeds/widget-button.js"
                  data-script-name="matic-embeds"
                ></script>
              </span>
            </div>

            <div style={styles.buttonDAI}>
              <span>
                <ButtonApproveDAI />
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
