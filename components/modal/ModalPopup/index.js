import { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { Popup, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import cn from 'classnames';
import Account from 'assets/svg/account.svg';
import AccountCopy from 'assets/svg/accountcopy.svg';
import CasinoBalance from 'assets/svg/casinobalance.svg';

import styles from './ModalPopup.module.scss';

const ModalPopup = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);
  const [casinoBalance, setCasinoBalance] = useState(0);
  const [binance, setBinance] = useState(false);
  const [meatamaskEnabled, setMetamaskEnabled] = useState(false);
  const [isToastShow, setIsToastShow] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(state.userAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if (window.location.href.indexOf('binance') != -1) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

  useEffect(() => {
    const mana = Number(state.DGPrices.mana * state.userBalances[1][1]);
    const eth = Number(state.DGPrices.eth * state.userBalances[2][3]);
    const atri = Number(state.DGPrices.atri * state.userBalances[2][2]);
    const dai = Number(state.userBalances[0][1]);
    const usdt = Number(state.userBalances[2][1] * 1000000000000);
    const balance = mana + eth + atri + dai + usdt;

    setCasinoBalance(balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [
    state.userBalances[1][1],
    state.userBalances[2][3],
    state.userBalances[2][2],
    state.userBalances[0][1],
    state.userBalances[2][1],
  ]);

  return (
    <div>
      <Popup
        pinned
        on="click"
        position="bottom right"
        className={styles.account_popup}
        trigger={
          <Button className={styles.account_button}>
            <Account />
            <span>My Account</span>
          </Button>
        }
      >
        <span>
          <span className="d-flex">
            <Link href="/account">
              <img
                className={
                  binance ? styles.avatar_picture_binance : styles.avatar_picture_home
                }
                src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
              />
            </Link>
            <span className="d-flex flex-column">
              <Link href="/account">
                {state.userInfo.name === null || state.userInfo.name === '' ? (
                  <h4 className={styles.modal_title}>
                    Unnamed
                  </h4>
                ) : (
                  <h4 className={styles.modal_title}>
                    {state.userInfo.name}
                  </h4>
                )}
              </Link>
              <span
                className={cn("d-flex", styles.account_copy)}
                onClick={() => onCopy()}
              >
                <p className={styles.account_address}>
                  {state.userAddress.substr(0, 8) +
                    '...' +
                    state.userAddress.substr(-8)}
                  <AccountCopy />
                </p>
              </span>
            </span>
          </span>
          <span className="d-flex flex-column">
            <Link href="/account">
              <Button className={styles.casino_balance_button}>
                <p className={styles.casino_balance_text}> Casino Balance </p>
                <span className="d-flex justify-content-end">
                  {binance ? (
                    <p className={styles.casino_balance_text_two}>
                      {' '}
                      ${state.userBalances[3][1].toFixed(2)}{' '}
                    </p>
                  ) : (
                    <p className={styles.casino_balance_text_two}>
                      {' '}
                      ${casinoBalance}{' '}
                    </p>
                  )}
                  <CasinoBalance />
                </span>
              </Button>
            </Link>

            <span className="d-flex justify-content-between" style={{ marginTop: '12px' }}>
              <Link href="/account">
                <Button
                  className={
                    binance ? 
                      styles.account_deposit_button_binance : 
                      styles.account_deposit_button
                  }
                >
                  Deposit
                </Button>
              </Link>

              <Link href="/account">
                <Button className={styles.account_withdraw_button}>Withdraw</Button>
              </Link>
            </span>

            <Link href="/account">
              <p className={styles.acount_dropdown_item} style={{ marginTop: '8px' }}>
                {' '}
                My Account{' '}
              </p>
            </Link>
            <Link href="/account/items">
              <p className={styles.acount_dropdown_item}> My Items </p>
            </Link>
            <Link href="/account/history">
              <p className={styles.acount_dropdown_item}> Gameplay History </p>
            </Link>
            <Link href="/account/referrals">
              <p className={styles.acount_dropdown_item}> Referrals </p>
            </Link>
            {/*<a onClick={() => disconnectMetaMask()}>
              <p className="account-dropdown-item"> Disconnect </p>
            </a>*/}
            <Button
              className={binance ? styles.buy_dg_button_binance : styles.buy_dg_button}
              href="https://info.uniswap.org/pair/0x44c21F5DCB285D92320AE345C92e8B6204Be8CdF"
              target="_blank"
            >
              Buy $DG
            </Button>
          </span>
        </span>
      </Popup>

      {copied ? (
        <div className={styles.copied_toast}>
          <p className={styles.copied_text}>Wallet address copied!</p>
        </div>
      ) : null}
    </div>
  );
};

export default ModalPopup;
