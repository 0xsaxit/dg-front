import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import { Popup, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Global from 'components/Constants';
import Fetch from '../../../common/Fetch';


const ModalPopup = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);
  const [manaPrice, setManaPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [atriPrice, setAtriPrice] = useState(0);
  const [casinoBalance, setCasinoBalance] = useState(0);
  const [binance, setBinance] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (window.location.href.indexOf("binance") != -1) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

  useEffect(() => {
    (async function () {
      // get coin prices
      let response = await Fetch.MANA_PRICE();
      let json = await response.json();
      setManaPrice(json.market_data.current_price.usd);

      let response2 = await Fetch.ETH_PRICE();
      let json2 = await response2.json();
      setEthPrice(json2.market_data.current_price.usd);

      let response3 = await Fetch.ATRI_PRICE();
      let json3 = await response3.json();
      setAtriPrice(json3.market_data.current_price.usd);

    })()
  }, [manaPrice, ethPrice, atriPrice]);

  useEffect(() => {
    const mana = Number(manaPrice * state.userBalances[1][1]);
    const eth = Number(ethPrice * state.userBalances[2][3]);
    const atri = Number(atriPrice * state.userBalances[2][2]);
    const dai = Number(state.userBalances[0][1]);
    const usdt = Number(state.userBalances[2][1] * 1000000000000);
    const balance = mana + eth + atri + dai + usdt;

    setCasinoBalance(balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [state.userBalances[1][1], 
      state.userBalances[2][3], 
      state.userBalances[2][2],
      state.userBalances[0][1],
      state.userBalances[2][1]]);

  return (
    <div>
      <Popup
        pinned
        on='click'
        position='bottom right'
        className="account-popup"
        trigger={
          <Button
            className="account-button"
          >
            <Icon className="account-icon" name="user circle outline" />
            My Account
          </Button>
        }
      >
        <span>
          <span style={{ display: 'flex' }}>
            <img
              className={binance ? "avatar-picture-binance" : "avatar-picture-home"}
              src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
            />
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              {state.userInfo.name === null ||
              state.userInfo.name === '' ? (
                <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                  Unnamed
                </h4>
              ) : (
                <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                  {state.userInfo.name}
                </h4>
              )}
              <span
                className="account-copy" 
                style={{ display: 'flex' }} 
                onClick={() => onCopy()}
              >
                <p className="account-address">
                  {state.userAddress.substr(0, 8) +
                  '...' +
                  state.userAddress.substr(-8)}
                  <svg  style={{ marginLeft: '8px' }}width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.54907 15.7588L10.9241 15.7588C11.7151 15.7588 12.3303 15.1143 12.3303 14.3525L12.3303 12.9463L13.7366 12.9463C14.5276 12.9463 15.1428 12.3018 15.1428 11.54L15.1428 2.16504C15.1428 1.37402 14.5276 0.758789 13.7366 0.758789L4.36157 0.758788C3.59985 0.758788 2.95532 1.37402 2.95532 2.16504L2.95532 3.57129L1.54907 3.57129C0.787355 3.57129 0.142823 4.18652 0.142823 4.97754L0.142822 14.3525C0.142822 15.1143 0.787354 15.7588 1.54907 15.7588ZM4.53735 2.16504L13.5608 2.16504C13.678 2.16504 13.7366 2.22363 13.7366 2.34082L13.7366 11.3643C13.7366 11.4521 13.678 11.54 13.5608 11.54L12.3303 11.54L12.3303 4.97754C12.3303 4.18652 11.7151 3.57129 10.9241 3.57129L4.36157 3.57129L4.36157 2.34082C4.36157 2.22363 4.44946 2.16504 4.53735 2.16504ZM1.72485 4.97754L10.7483 4.97754C10.8655 4.97754 10.9241 5.03613 10.9241 5.15332L10.9241 14.1768C10.9241 14.2646 10.8655 14.3525 10.7483 14.3525L1.72485 14.3525C1.63696 14.3525 1.54907 14.2646 1.54907 14.1768L1.54907 5.15332C1.54907 5.03613 1.63696 4.97754 1.72485 4.97754Z" fill="white" fill-opacity="0.5"/>
                  </svg>
                </p>
              </span>
            </span>
          </span>
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <Button 
              className="casino-balance-button" 
              href="/account"
            >
              <p className="casino-balance-text"> Casino Balance </p>
              <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {binance ? (
                  <p className="casino-balance-text two"> ${state.userBalances[3][1].toFixed(2)} </p>  
                ) : (            
                  <p className="casino-balance-text two"> ${casinoBalance} </p>
                )}
                <svg style={{ margin: '4px 0px 0px 8px' }} width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.21289 7.06445C8.20605 6.70215 8.08301 6.41504 7.78906 6.12793L2.6416 1.09668C2.42285 0.884766 2.16992 0.775391 1.85547 0.775391C1.22656 0.775391 0.707031 1.28809 0.707031 1.91016C0.707031 2.22461 0.836914 2.51172 1.07617 2.75098L5.5332 7.05762L1.07617 11.3779C0.836914 11.6104 0.707031 11.8975 0.707031 12.2188C0.707031 12.8408 1.22656 13.3535 1.85547 13.3535C2.16309 13.3535 2.42285 13.251 2.6416 13.0322L7.78906 8.00098C8.08301 7.71387 8.21289 7.41992 8.21289 7.06445Z" fill="white"/>
                </svg>
              </span>
            </Button>
            <span style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
              <Button className={binance ? "account-deposit-button binance" : "account-deposit-button"} href="/account">
                Deposit
              </Button>
              <Button className="account-withdraw-button" href="/account">
                Withdraw
              </Button>
            </span>
            <a href="/account">
              <p className="account-dropdown-item" style={{ marginTop: '8px' }}> My Account </p>
            </a>
            <a href="/account/nfts">
              <p className="account-dropdown-item"> My NFTs </p>
            </a>
            <a href="/account/poaps">
              <p className="account-dropdown-item"> My POAPs </p>
            </a>
            <a href="/account/play">
              <p className="account-dropdown-item"> Gameplay History </p>
            </a>
            <a href="/account/history">
              <p className="account-dropdown-item"> Transactions </p>
            </a>
            <a href="/account/referrals">
              <p className="account-dropdown-item"> Referrals </p>
            </a>
            <Button 
              className={binance ? "buy-dg-button binance" : "buy-dg-button"}
              href="https://info.uniswap.org/pair/0x44c21F5DCB285D92320AE345C92e8B6204Be8CdF"
              target="_blank"
            >
              Buy $DG
            </Button>
          </span>
        </span>
      </Popup>

      {copied ? (
        <div className={copied ? 'copied-toast' : 'copied-toast hidden'}>
          <h3 className="copied-text">
            Wallet address copied!
          </h3>
        </div>
      ) : (
        null
      )}
    </div>
  );
};

export default ModalPopup;
