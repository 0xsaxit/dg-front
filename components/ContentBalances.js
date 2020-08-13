import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import { Button, Divider, Grid, FormDropdown } from 'semantic-ui-react';
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
      <div className="matic-overlay">
        <div className="matic-top-bar">
          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex' }}>
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1597255979/Screen_Shot_2020-08-12_at_11.12.47_AM_dbmtla.png"
                className="matic-top-image"
              />
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
              >
                <span className="matic-icon-background">
                  <span class="material-icons" id="matic-widget-icon-left-1">
                    add
                  </span>
                </span>
                Deposit from Metamask
                <span class="material-icons" id="matic-widget-icon-right-1">
                  keyboard_arrow_right
                </span>
              </Button>

              <script
                src="https://wallet.matic.today/embeds/widget-button.js"
                data-script-name="matic-embeds"
              ></script>
            </div>
            <div>
              <Button className="matic-widget-button-2" onClick={show_transak}>
                <span className="matic-icon-background-2">
                  <span class="material-icons" id="matic-widget-icon-left-2">
                    add
                  </span>
                </span>
                Purchase with Debit Card
                <span class="material-icons" id="matic-widget-icon-right-2">
                  keyboard_arrow_right
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return balancesOverlay();
};

export default ContentBalances;
