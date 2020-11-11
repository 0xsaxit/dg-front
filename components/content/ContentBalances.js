import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import ButtonApproveMANA from '../button/ButtonApproveMANA';
import ButtonApproveDAI from '../button/ButtonApproveDAI';
import Global from '../Constants';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';

let transak = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'STAGING', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '000000', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
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

  let userAddress = '';

  var totalPlay = 0;
  var totalMana = 0;
  var totalDai = 0;

  let temp_1 = [];
  let temp_2 = [];
  let temp_3 = [];
  
  for (const [index, value] of dataPlay.entries()) {
    if (dataPlay[index].coinName === 'PLAY') {
      temp_1.push(dataPlay[index]);
      var x = (temp_1.reduce((a, v) => a = a + v.amountWin, 0 ));
      var totalPlay = (x / 1000000000000000000).toLocaleString();
    } else if (dataPlay[index].coinName === 'MANA') {
      temp_2.push(dataPlay[index]);
      var y = (temp_2.reduce((a, v) => a = a + v.amountWin, 0 ));
      var totalMana = (y / 1000000000000000000).toLocaleString();
    } else if (dataPlay[index].coinName === 'DAI') {
      temp_3.push(dataPlay[index]);
      var z = (temp_3.reduce((a, v) => a = a + v.amountWin, 0 ));
      var totalDai = (z / 1000000000000000000).toLocaleString();
    }
  }

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

    // } else {
    //   setBoxDAI('none');
    //   setBoxMANA('none');
    //   setButtonDAI('block');
    //   setButtonMANA('block');
    // }
  }, [state.userStatus]);

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

  // initialize transak modal
  function show_transak() {
    transak.init();
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentModal() {
    return (
      <span>
        <div className="matic-overlay-container" onClick={close} />
        <div className="matic-overlay">
          <p className="matic-header-text"> Add Tokens </p>

          <Divider style={{ marginTop: '-15px' }} />

          <div className="matic-widget-button-container">
            <div onClick={close}>
              <div
                className="matic-widget-button"
                data-default-page="deposit"
                data-wapp-id="I8qoM5yxmkAm6tT72vwD"
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    marginTop: '7px',
                  }}
                >
                  <img
                    src={Images.METAMASK}
                    className="deposit-modal-image 1"
                  />
                  <p className="deposit-type-text"> Metamask </p>
                </span>
              </div>

              <script
                src="https://wallet.matic.network/embeds/widget-button.js"
                data-script-name="matic-embeds"
              ></script>
            </div>

            <div onClick={close}>
              <div
                className="matic-widget-button-2"
                onClick={() => show_transak()}
              >
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img src={Images.TRANSAK} className="deposit-modal-image 2" />
                  <p className="deposit-type-text"> Debit Card </p>
                </span>
              </div>
            </div>
          </div>
        </div>
      </span>
    );
  }

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
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> {totalPlay} </p>
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
                  onClick={() => show_transak()}
                  style={{ marginTop: '-75px' }}
                >
                  PURCHASE
                </Button>
              </span>
            </div>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Earned</p>
              <p className="earned-amount"> {totalMana} </p>
            </span>

            <Divider />

            <div style={styles.boxMANA}>
              <span className="balances-button-span">
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  data-default-page="deposit"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  DEPOSIT
                </Button>
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
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
                <p className="account-name">{state.userBalances[0][1]}</p>
              </span>
            </span>

            <div style={styles.boxDAI}>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  className="balances-top-button two"
                  onClick={() => show_transak()}
                  style={{ marginTop: '-75px' }}
                >
                  PURCHASE
                </Button>
              </span>
            </div>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Earned </p>
              <p className="earned-amount"> {totalDai} </p>
            </span>

            <Divider />

            <div style={styles.boxDAI}>
              <span className="balances-button-span">
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
                  data-default-page="deposit"
                  data-wapp-id="I8qoM5yxmkAm6tT72vwD"
                >
                  DEPOSIT
                </Button>
                <Button
                  color="blue"
                  className="matic-widget-button balances-play-button"
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

  if (props.balancesOverlay === 1) {
    return contentModal();
  } else if (props.balancesOverlay === 2) {
    return contentAccountPage();
  }
};

export default ContentBalances;
