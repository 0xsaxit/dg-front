import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import Global from '../components/Constants';

let transak = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  defaultCryptoCurrency: 'MANA',
  walletAddress: '', // customer wallet address
  themeColor: '000000', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  hostURL: 'https://decentral.games',
  widgetHeight: '633px',
  widgetWidth: '450px',
});

const ContentBalances = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    // get all the events
    transak.on(transak.ALL_EVENTS, (data) => {
      console.log(data);
    });
    // triggers when the user closes the widget
    transak.on(transak.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak.close();
    });
    // triggers when the payment is complete
    transak.on(transak.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak.close();
    });
  }, []);

  // get user address
  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
    }
  }, [state.userStatus]);

  // top up user to 5000 play tokens
  async function topUp() {
    await Global.FETCH.TOP_UP_USER(userAddress);

    let responseInfo = await Global.FETCH.PLAYER_INFO(userAddress);
    let json = await responseInfo.json();

    let arrayInfo = state.userInfo;
    arrayInfo[3] = json.callCount;

    dispatch({
      type: 'user_info',
      data: arrayInfo,
    });
  }

  // initialize transak modal
  function show_transak() {
    transak.init();

    initializePings();
  }

  // initialize token contract pings
  function initializePings() {
    if (state.userStatus >= 5) {
      console.log('Ping token contract');

      // start pinging the token contract for deposit confirmation
      dispatch({
        type: 'token_pings',
        data: 1,
      });
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

  function contentModal() {
    return (
      <div className="matic-overlay">
        <div className="matic-top-bar">
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.MATIC_TOP} className="matic-top-image" />
              <p className="matic-top-text-1"> Account Connected </p>
            </span>
            <span style={{ display: 'flex' }}>
              <p className="matic-top-text-2">
                {' '}
                Matic Testnet Mumbai • Metamask{' '}
              </p>
            </span>
          </span>
        </div>
        <div>
          <p className="matic-header-text"> Add Tokens </p>
          <Divider style={{ borderTop: '1px solid #f3f4f7' }} />
          <div className="matic-widget-button-container">
            <div onClick={close}>
              <Button
                className="matic-widget-button"
                data-default-page="deposit"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => initializePings()}
              >
                <span className="matic-icon-background">
                  <span
                    className="material-icons"
                    id="matic-widget-icon-left-1"
                  >
                    add
                  </span>
                </span>
                Deposit from Metamask
                <span className="material-icons" id="matic-widget-icon-right-1">
                  keyboard_arrow_right
                </span>
              </Button>

              <script
                src="https://wallet.matic.today/embeds/widget-button.js"
                data-script-name="matic-embeds"
              ></script>
            </div>

            <div onClick={close}>
              <Button className="matic-widget-button-2" onClick={show_transak}>
                <span className="matic-icon-background-2">
                  <span
                    className="material-icons"
                    id="matic-widget-icon-left-2"
                  >
                    add
                  </span>
                </span>
                Purchase with Debit Card
                <span className="material-icons" id="matic-widget-icon-right-2">
                  keyboard_arrow_right
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function contentAccountPage() {
    return (
      <Grid className="balances-container">
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
                  src={Global.IMAGES.PLAY_CIRCLE}
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
                style={{ marginTop: '-80px' }}
              >
                FREE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> 0 </p>
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
                  src={Global.IMAGES.DAI_CIRCLE}
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
                <p className="welcome-text"> Dai </p>
                <p className="account-name">{state.userBalances[0][1]}</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled
                className="balances-top-button two"
                target="_blank"
                style={{ marginTop: '-80px' }}
              >
                PURCHASE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />
            <span className="balances-button-span">
              <Button disabled color="blue" className="balances-play-button">
                DEPOSIT
              </Button>
              <Button disabled color="blue" className="balances-play-button">
                WITHDRAW
              </Button>
            </span>
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
                  src={Global.IMAGES.MANA_CIRCLE}
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
                <p className="welcome-text"> Mana </p>
                <p className="account-name">{state.userBalances[1][1]}</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                className="balances-top-button"
                onClick={() => show_transak()}
                style={{ marginTop: '-80px' }}
              >
                PURCHASE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> 0 </p>
            </span>

            <Divider />
            <span className="balances-button-span">
              <Button
                color="blue"
                className="matic-widget-button balances-play-button"
                data-default-page="deposit"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => initializePings()}
              >
                DEPOSIT
              </Button>
              <Button
                color="blue"
                className="matic-widget-button balances-play-button"
                data-default-page="withdraw"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => initializePings()}
              >
                WITHDRAW
              </Button>

              <script
                src="https://wallet.matic.today/embeds/widget-button.js"
                data-script-name="matic-embeds"
              ></script>
            </span>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  if (props.balancesOverlay === 1) {
    return contentModal();
  } else if (props.balancesOverlay === 2) {
    return contentAccountPage();
  }
};

export default ContentBalances;
