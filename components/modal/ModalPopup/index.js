import { useEffect, useContext, useState } from 'react';
import Link from 'next/link';
import { Popup, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Global from 'components/Constants';
import { useRouter } from 'next/router';
import cn from 'classnames';
import Account from 'assets/svg/account.svg';
import AccountCopy from 'assets/svg/accountcopy.svg';
import CasinoBalance from 'assets/svg/casinobalance.svg';

import styles from './ModalPopup.module.scss';

const ModalPopup = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  const [copied, setCopied] = useState(false);
  const [casinoBalance, setCasinoBalance] = useState(0);
  const [binance, setBinance] = useState(false);
  const [meatamaskEnabled, setMetamaskEnabled] = useState(false);
  const [isToastShow, setIsToastShow] = useState(false);

  const [visibleStatus, setVisibleStatus] = useState(false);

  useEffect(() => {
    const showStatus = () => {
      setVisibleStatus(true);
    };
    const hideStatus = () => {
      setTimeout(() => {
        setVisibleStatus(false);

        //reset
        dispatch({
          type: 'set_dgLoading',
          data: 0,
        });

        dispatch({
          type: 'set_openModal',
          data: {
            resumeID: 0,
            lockID: 0,
          },
        });
      }, 5000);
    };

    showStatus();
    if (state.dgLoading === 2) {
      hideStatus();
    }
  }, [state.dgLoading]);

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
        on="click"
        position="bottom right"
        style={{
          color: 'white',
          'background-color': '#191919',
          border: 'none',
          borderRadius: '24px',
          marginTop: '15px',
          padding: '30px',
        }}
        className={styles.account_popup}
        trigger={
          <div>
            {visibleStatus > 0 && state.dgLoading > 0 && (
              <div
                style={{
                  background: state.dgLoading > 1 ? '#007d39' : '#1c70c3',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '6px',
                  borderRadius: '11px',
                  position: 'absolute',
                  marginTop: '-21px',
                  marginLeft: '80px',
                  fontSize: '13px',
                  cursor: 'pointer',
                  zIndex: 9999,
                }}
                className="account-transfer"
                onClick={event => {
                  event.stopPropagation();

                  const pathURL = window.location.pathname;
                  if (pathURL !== '/account') {
                    router.push('/account');
                  }
                  const currentModal = state.openModal;
                  console.log('dgLoading: =>', state.dgLoading);
                  console.log('currentModal: =>', currentModal);

                  dispatch({
                    type: 'set_dgShow',
                    data: true,
                  });
                }}
              >
                {state.dgLoading > 1 ? 'Transfer Complete' : 'Transfer Pending'}
              </div>
            )}
            <Button
              className="account-button"
              style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                marginTop: 0,
                marginRight: 0,
                zIndex: 1,
              }}
            >
              <span>
                <svg
                  style={{ marginRight: '6px', marginBottom: '-2px' }}
                  width="20"
                  height="19"
                  viewBox="0 0 20 19"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.88965 18.9707C14.9961 18.9707 19.1973 14.7695 19.1973 9.66309C19.1973 4.54785 14.9961 0.34668 9.88086 0.34668C4.76562 0.34668 0.573242 4.54785 0.573242 9.66309C0.573242 14.7695 4.77441 18.9707 9.88965 18.9707ZM9.88965 12.7832C7.68359 12.7832 5.96094 13.5479 4.95898 14.5322C3.72852 13.2842 2.97266 11.5615 2.97266 9.66309C2.97266 5.82227 6.04883 2.7373 9.88086 2.7373C13.7129 2.7373 16.8066 5.82227 16.8066 9.66309C16.8066 11.5615 16.0508 13.2842 14.8115 14.5322C13.8096 13.5479 12.0957 12.7832 9.88965 12.7832ZM9.88965 11.4297C11.6123 11.4385 12.9395 9.96191 12.9395 8.08984C12.9395 6.32324 11.5947 4.82031 9.88965 4.82031C8.18457 4.82031 6.82227 6.32324 6.83984 8.08984C6.83984 9.96191 8.16699 11.4209 9.88965 11.4297Z"
                    fill="white"
                  />
                </svg>
              </span>
              <span>My Account</span>
            </Button>
          </div>
        }
      >
        <span className={styles.popup_wrapper}>
          <span className="d-flex">
            <Link href="/account">
              <img
                className={
                  binance
                    ? styles.avatar_picture_binance
                    : styles.avatar_picture_home
                }
                src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
              />
            </Link>
            <span className="d-flex flex-column">
              <Link href="/account">
                {state.userInfo.name === null || state.userInfo.name === '' ? (
                  <h4 className={styles.modal_title}>Unnamed</h4>
                ) : (
                  <h4 className={styles.modal_title}>{state.userInfo.name}</h4>
                )}
              </Link>
              <span
                className={cn('d-flex', styles.account_copy)}
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
          <span className={styles.link_wrapper}>
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

            <span
              className="d-flex justify-content-between"
              style={{ marginTop: '12px' }}
            >
              <Link href="/account">
                <Button
                  className={
                    binance
                      ? styles.account_deposit_button_binance
                      : styles.account_deposit_button
                  }
                >
                  Deposit
                </Button>
              </Link>

              <Link href="/account">
                <Button className={styles.account_withdraw_button}>
                  Withdraw
                </Button>
              </Link>
            </span>

            <Link href="/account">
              <p
                className={styles.acount_dropdown_item}
                style={{ marginTop: '8px' }}
              >
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
              className={
                binance
                  ? `${styles.buy_dg_button_binance}`
                  : `${styles.buy_dg_button}`
              }
              href="https://info.uniswap.org/#/tokens/0xee06a81a695750e71a662b51066f2c74cf4478a0"
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
