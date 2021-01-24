import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider, Icon } from 'semantic-ui-react';
import { GlobalContext } from '../../store';
import Fetch from '../../common/Fetch';
import transakSDK from '@transak/transak-sdk';
import Global from '../Constants';

let transak_3 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultCryptoCurrency: 'DG',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Mainchain $DG directly',
});

const ModalInfo = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [DGTotal, setDGTotal] = useState(0);
  const [DGTotal_2, setDGTotal_2] = useState(0);
  const [supply, setSupply] = useState(0);
  const [DGPrice, setDGPrice] = useState(0);

  useEffect(() => {
    const totalDG =
      parseFloat(state.userBalances[2][0]) +
      parseFloat(state.userBalances[2][1]) +
      parseFloat(state.DGBalances.BALANCE_MINING_DG) +
      parseFloat(state.DGBalances.BALANCE_STAKING_BALANCER_1) +
      parseFloat(state.DGBalances.BALANCE_STAKING_BALANCER_2) +
      parseFloat(state.DGBalances.BALANCE_KEEPER_DG) +
      parseFloat(state.DGBalances.BALANCE_ROOT_DG) +
      parseFloat(state.DGBalances.BALANCE_CHILD_DG) +
      parseFloat(state.stakingBalances.BALANCE_USER_GOVERNANCE) +
      parseFloat(state.DGBalances.BALANCE_STAKING_UNISWAP) +
      parseFloat(state.DGBalances.BALANCE_STAKING_GOVERNANCE);

    const totalDGAdjusted_temp = totalDG.toFixed(0);
    const totalDGAdjusted = Number(totalDGAdjusted_temp);

    setDGTotal(totalDGAdjusted);

    const totalDGAdjusted_2 = totalDG.toFixed(3);
    setDGTotal_2(totalDGAdjusted_2);
  }, [state.DGBalances, state.userBalances, state.stakingBalances]);

  // transak for DG
  useEffect(() => {
    // get all the events
    transak_3.on(transak_3.ALL_EVENTS, (data) => {
      console.log(data);
    });

    // triggers when the user closes the widget
    transak_3.on(transak_3.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_3.close();
    });

    // triggers when the payment is complete
    transak_3.on(transak_3.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log(orderData);
      transak_3.close();
    });
  }, []);

  // initialize transak modal
  function show_transak_3() {
    transak_3.init();
    setOpen(false);
  }

  // calculate DG price
  useEffect(() => {
    const temp =
      state.DGBalances.BALANCE_BP_DAI / (49 * state.DGBalances.BALANCE_BP_DG_1);
    const price = temp;
    setDGPrice(price);
  }, [state.DGBalances]);

  // fetch circulating supply
  useEffect(() => {
    (async function () {
      const response = await Fetch.DG_SUPPLY_GECKO();
      const json = await response.json();
      setSupply(json.market_data.circulating_supply);
    })();
  }, []);

  // calculate market cap
  const temp = supply * DGPrice;
  const marketCap = temp.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const temp_2 = DGTotal_2 * DGPrice;
  const unclaimedUSD = temp_2.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const gov_staked = Number(state.stakingBalances.BALANCE_USER_GOVERNANCE);
  const gov_unclaimed = Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE); // governance

  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  return (
    <Modal
      className="menu-info-modal"
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          {state.DGBalances.BALANCE_KEEPER_DG == 10 ? (
            null    
          ) : state.DGBalances.BALANCE_MINING_DG ? (
            <Button color="blue" className="modal-info-button">
              <p className="right-menu-text dg">
                {DGTotal.toLocaleString()} DG{' '}
              </p>
            </Button>
          ) : (
            null
          )}
        </span>
      }
    >
      <div style={{ margin: '21px 30px 0px 30px' }}>
        <span className="mailchimp-close" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className="mailchimp-header-text"> Your $DG Breakdown </p>

      <Divider style={{ marginTop: '-15px' }} />

      <div>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1604946498/RotateY_05_250x250_Alpha_vkitya.gif"
            className="farming-logo"
            alt="Decentral Games Coin Logo"
          />
        </span>

        <span style={{ display: 'flex', justifyContent: 'center' }}>
          {state.DGBalances.BALANCE_KEEPER_DG == 10 ? (
            <p
              className="account-name"
              style={{
                marginLeft: '0px',
                paddingLeft: '0px',
                textAlign: 'center',
              }}
            >
              0.000
            </p>
          ) : (
            <p
              className="account-name"
              style={{
                marginLeft: '0px',
                paddingLeft: '0px',
                textAlign: 'center',
              }}
            >
              {formatPrice(DGTotal_2, 3)}
            </p>
          )}
        </span>
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <p
            className="menu-info-text"
            style={{
              marginLeft: '0px',
              paddingLeft: '0px',
              textAlign: 'center',
            }}
          >
            ${unclaimedUSD}
          </p>
        </span>
        <span style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 30px 0px 30px' }}>
          <Button
            className="get-dg-button"
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xee06a81a695750e71a662b51066f2c74cf4478a0"
            target="_blank"
          >
            BUY WITH CRYPTO
          </Button>
          <Button
            className="get-dg-button"
            style={{ padding: '0 0 0 0' }}
            onClick={() => show_transak_3()}
          >
            BUY WITH FIAT
          </Button>
        </span>
      </div>

      <div className="menu-info-container" style={{ marginTop: '24px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">$DG staked in gov</p>
          <p className="menu-info-text">{gov_staked.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">
            <a
              className="menu-info-label-link"
              href="https://etherscan.io/token/0xee06a81a695750e71a662b51066f2c74cf4478a0"
              target="_blank"
            >
              mainchain $DG
            </a>{' '}
            balance
          </p>
          <p className="menu-info-text">
            {formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)}
          </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">
            <a
              className="menu-info-label-link"
              href="https://explorer-mainnet.maticvigil.com/address/0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4/"
              target="_blank"
            >
              matic $DG
            </a>{' '}
            balance
          </p>
          <p className="menu-info-text">{state.DGBalances.BALANCE_CHILD_DG}</p>
        </span>
      </div>

      <div>
        {gov_unclaimed > 0 || 
          state.DGBalances.BALANCE_MINING_DG > 0 || 
          state.DGBalances.BALANCE_STAKING_BALANCER_1 > 0 || 
          state.DGBalances.BALANCE_STAKING_BALANCER_2 > 0 ||
          state.DGBalances.BALANCE_STAKING_UNISWAP > 0 ||
          state.DGBalances.BALANCE_KEEPER_DG > 0 ? (
          <div
            className="menu-info-container"
            style={{ marginTop: '12px', marginBottom: '12px', paddingTop: '12px' }}
          >
            {gov_unclaimed > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $dg - gov</p>
                <p className="menu-info-text">{gov_unclaimed.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
              </span>
            ) : (
              null
            )}

            {state.DGBalances.BALANCE_MINING_DG > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $dg - gameplay</p>
                <p className="menu-info-text">
                  {formatPrice(state.DGBalances.BALANCE_MINING_DG, 3)}
                </p>
              </span>
            ) : (
              null
            )}

            {state.DGBalances.BALANCE_STAKING_BALANCER_1 > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $dg - balancer 1</p>
                <p className="menu-info-text">
                  {formatPrice(state.DGBalances.BALANCE_STAKING_BALANCER_1, 3)}
                </p>
              </span>
            ) : (
              null
            )}

            {state.DGBalances.BALANCE_STAKING_BALANCER_2 > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $dg - balancer 2</p>
                <p className="menu-info-text">
                  {formatPrice(state.DGBalances.BALANCE_STAKING_BALANCER_2, 3)}
                </p>
              </span>
            ) : (
              null
            )}

            {state.DGBalances.BALANCE_STAKING_UNISWAP > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $dg - uniswap</p>
                <p className="menu-info-text">
                  {formatPrice(state.DGBalances.BALANCE_STAKING_UNISWAP, 3)}
                </p>
              </span>
            ) : (
              null
            )}

            {state.DGBalances.BALANCE_KEEPER_DG > 0 ? (
              <span className="menu-info-inner-span">
                <p className="menu-info-label">unclaimed $DG - airdrop</p>
                <p className="menu-info-text">
                  {formatPrice(state.DGBalances.BALANCE_KEEPER_DG, 3)}
                </p>
              </span>
            ) : state.DGBalances.BALANCE_KEEPER_DG == 10 ? (
              null
            ) : (
              null
            )}  
          </div>
        ) : (
          <div style={{ marginTop: '12px' }} />
        )}
      </div>

      <div className="menu-info-container" style={{ marginBottom: '30px' }}>
        <span className="menu-info-inner-span" style={{ paddingTop: '12px' }}>
          <p className="menu-info-label">price</p>
          <p className="menu-info-text">${DGPrice.toFixed(2)}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">circulating supply</p>
          <p className="menu-info-text">
            {supply.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">market capitalization</p>
          <p className="menu-info-text">${marketCap}</p>
        </span>
        <span className="menu-info-inner-span">
          <p className="menu-info-label">supply cap</p>
          <p className="menu-info-text">1,000,000</p>
        </span>
      </div>
    </Modal>
  );
};

export default ModalInfo;
