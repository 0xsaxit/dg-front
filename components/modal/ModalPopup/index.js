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
                  <Icon 
                    name="clone outline" 
                    style={{ 
                      color: 'rgba(225, 255, 255, 0.5)', 
                      fontSize: '16px',
                      padding: '0px 0px 0px 8px',
                    }}
                  />
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
                <Icon className="arrow right" style={{ paddingLeft: '8px', paddingTop: '5px' }}/>
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
