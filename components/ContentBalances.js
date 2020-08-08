import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import { Button, Divider, Grid } from 'semantic-ui-react';
import transakSDK from '@transak/transak-sdk';
import ModalWithdraw from './modal/ModalWithdraw';
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
  hostURL: 'http://localhost:3002/account',
  widgetHeight: '633px',
  widgetWidth: '450px',
});

const ContentBalances = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

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

  // initialize transak modal
  function show_transak() {
    transak.init();
  }

  function balancesOverlay() {
    return (
      <div className="page-container">
        <div className="account-other-inner-container">
          <Grid className="balances-container">
            <Grid.Row>
              <Grid.Column
                computer={5}
                tablet={8}
                mobile={16}
                className="balances-column one"
              >
                <span className="balances-text">
                  <img
                    src={Global.IMAGES.LOGO}
                    style={{
                      width: '28px',
                      marginRight: '9px',
                      verticalAlign: 'top',
                      marginTop: '-2px',
                    }}
                  />
                  5,000 PLAY
                </span>
                <Divider style={{ marginTop: '23px', marginBottom: '30px' }} />
                <span className="balances-button-span">
                  <Button
                    color="blue"
                    className="balances-play-button"
                    href="https://play.decentral.games"
                    target="_blank"
                  >
                    PLAY NOW
                  </Button>
                  <Button
                    disabled
                    color="blue"
                    className="balances-play-button-2"
                    href="https://play.decentral.games"
                    target="_blank"
                  >
                    TOP UP
                  </Button>
                </span>
              </Grid.Column>

              <Grid.Column
                computer={5}
                tablet={8}
                mobile={16}
                className="balances-column two"
              >
                <span className="balances-text">
                  <img
                    src={Global.IMAGES.MANA_CIRCLE}
                    style={{
                      width: '28px',
                      marginRight: '9px',
                      verticalAlign: 'top',
                      marginTop: '-2px',
                    }}
                  />
                  {state.balances[0][1]} MANA
                </span>
                <Divider style={{ marginTop: '23px', marginBottom: '30px' }} />
                <span className="balances-button-span">
                  {/* <ModalDeposit menuLink={0} /> */}

                  <button
                    class="matic-widget-button"
                    data-default-page="home"
                    data-wapp-id="xeYvesZxGiEKOMt4gq3s"
                  >
                    DEPOSIT
                  </button>
                  <script
                    src="https://wallet.matic.today/embeds/widget-button.js"
                    data-script-name="matic-embeds"
                  ></script>

                  <ModalWithdraw isExit={0} />
                </span>
                <div>
                  <Button
                    color="blue"
                    className="balances-purchase-button"
                    onClick={show_transak}
                  >
                    PURCHASE
                  </Button>
                </div>
              </Grid.Column>

              <Grid.Column
                computer={5}
                tablet={8}
                mobile={16}
                className="balances-column three"
              >
                <span className="balances-text">
                  <img
                    src={Global.IMAGES.DAI_CIRCLE}
                    style={{
                      width: '28px',
                      marginRight: '9px',
                      verticalAlign: 'top',
                      marginTop: '-2px',
                    }}
                  />
                  0 DAI
                </span>
                <Divider style={{ marginTop: '23px', marginBottom: '30px' }} />
                <span className="balances-button-span">
                  <Button
                    disabled
                    color="blue"
                    className="balances-play-button"
                    href="https://play.decentral.games"
                    target="_blank"
                  >
                    DEPOSIT
                  </Button>
                  <Button
                    disabled
                    color="blue"
                    className="balances-play-button-2"
                    href="https://play.decentral.games"
                    target="_blank"
                  >
                    WITHDRAW
                  </Button>
                </span>
                <div>
                  <Button
                    disabled
                    color="blue"
                    className="balances-purchase-button"
                    href="https://play.decentral.games"
                    target="_blank"
                  >
                    PURCHASE
                  </Button>
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }

  return balancesOverlay();
};

export default ContentBalances;
