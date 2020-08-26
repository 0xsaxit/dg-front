import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import Global from './Constants';

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
  const [playBalance, setPlayBalance] = useState('');
  const [avatarName, setAvatarName] = useState('');
  const [address, setAddress] = useState('');

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
    if (window.ethereum) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // get play balance, avatar name
      (async function () {
        let response = await getPlayerInfo(userAddress);
        let json = await response.json();
        setPlayBalance(json.playBalance.toLocaleString());
        setAddress(json.address);
        setAvatarName(json.avatarName);
      })();
    }
  }, []);

  async function getPlayerInfo(userAddress) {
    let fetchURL = 'https://api.decentral.games/admin/getUser?address=' + userAddress;
    console.log(fetchURL);
    return fetch(fetchURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
  }

  // // top up user to 5000 play tokens
  // function topUpUser() {
  //   return fetch(`https://api.decentral.games/order/topup`, {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       address: address,
  //     }),
  //   });
  // }

  // async function topUp() {
  //   let response = await topUpUser();
  //   let json = await response.json();
  //   console.log(json);
  // }

  // initialize transak modal
  function show_transak() {
    transak.init();
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
            <div>
              <Button
                className="matic-widget-button"
                data-default-page="deposit"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => openMessageBox()}
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
            <div>
              <Button
                className="matic-widget-button-2"
                onClick={() => show_transak()}
              >
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
            computer={16}
            tablet={16}
            mobile={16}
            className="balances-column zero"
          >
            <span style={{ display: 'flex' }}>
              <p className="online-dot account">•</p>
              <p className="balances-token-name">Account Connected</p>
              <Button
                className="balances-top-play-button"
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
              >
                PLAY NOW
              </Button>
            </span>
            <Divider className="balances-divider" />
            <span style={{ display: 'flex' }}>
              <img 
                src={`https://events.decentraland.org/api/profile/${address}/face.png`}
                style={{
                  width: '90px',
                  display: 'flex',
                  border: '1px solid rgb(227, 232, 238)',
                  borderRadius: '100%',
                  boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                }}
              />
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <p className="welcome-text"> welcome back </p>
                { avatarName === null || avatarName === '' ? 
                  <div>
                    <p className="account-name">
                      {address.substr(0, 2) + '...' + address.substr(-7)}
                    </p>
                  </div> 
                  : 
                  <div>
                    <p className="account-name">
                      {avatarName}
                    </p>
                  </div> 
                }
              </span>
            </span>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column one"
          >
            <p className="balances-token-name">Play</p>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.PLAY_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> {playBalance} </p>
            <span className="balances-button-span">
              <Button
                color="blue"
                className="balances-play-button"
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                target="_blank"
              >
                PLAY NOW
              </Button>
              <Button
                // onClick={topUp()}
                disabled
                color="blue"
                className="balances-play-button-2"
              >
                TOP UP
              </Button>
            </span>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column two"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Dai </p>
              <Button
                disabled
                className="balances-purchase-button"
                onClick={() => show_transak()}
              >
                Purchase
              </Button>
            </span>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.DAI_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> 0 </p>
            <span className="balances-button-span">
              <Button disabled color="blue" className="balances-play-button">
                DEPOSIT
              </Button>
              <Button disabled color="blue" className="balances-play-button-2">
                WITHDRAW
              </Button>
            </span>
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={16}
            mobile={16}
            className="balances-column three"
          >
            <span className="name-purchase-span">
              <p className="balances-token-name"> Mana </p>
              <Button
                className="balances-purchase-button"
                onClick={() => show_transak()}
              >
                PURCHASE
              </Button>
            </span>
            <Divider className="balances-divider" />
            <img
              src={Global.IMAGES.MANA_CIRCLE}
              style={{
                width: '60px',
                display: 'flex',
                marginLeft: 'calc(50% - 30px)',
                paddingTop: '12px',
              }}
            />
            <p className="balances-text"> {state.balances[0][1]} </p>
            <span className="balances-button-span">
              <Button
                color="blue"
                className="matic-widget-button balances-play-button"
                data-default-page="deposit"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => openMessageBox()}
              >
                DEPOSIT
              </Button>
              <Button
                color="blue"
                className="matic-widget-button balances-play-button-2"
                data-default-page="withdraw"
                data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                onClick={() => openMessageBox()}
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

  function openMessageBox() {
    dispatch({
      type: 'message_box',
      data: 1,
    });
  }

  if (props.balancesOverlay === 1) {
    return contentModal();
  } else if (props.balancesOverlay === 2) {
    return contentAccountPage();
  }
};

export default ContentBalances;
