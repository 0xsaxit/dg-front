import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { GlobalContext } from 'store/index';
import Images from 'common/Images';
import { ConnextModal } from '@connext/vector-modal';
import Global from 'components/Constants';
import ModalAcceptUSDT from 'components/modal/ModalAccept/USDT';
import styles from './Balances.module.scss';

const connext = {
  routerPublicID: Global.CONSTANTS.CONNEXT_PUBLIC_ID,
  chainProviderInfura:
    'https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6',
  chainProviderMatic: 'https://rpc-mainnet.matic.network',
  assetID_1_MANA: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA,
  assetID_2_MANA: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA,
  assetID_1_DAI: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DAI,
  assetID_2_DAI: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI,
  assetID_1_USDT: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_USDT,
  assetID_2_USDT: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT,
};

function Balances() {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [showModal, setShowModal] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showModal_3, setShowModal_3] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  const [showModal_5, setShowModal_5] = useState(false);
  const [showModal_6, setShowModal_6] = useState(false);
  const [event, setEvent] = useState('');
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState(0);
  const buttonPlay = document.getElementById('play-now-button-balances');

  // send tracking data to Segment
  useEffect(() => {
    if (buttonPlay) {
      analytics.trackLink(buttonPlay, 'Clicked PLAY NOW (balances page)');
    }
  }, [buttonPlay]);

  // refresh user token balances and post transaction to database
  useEffect(() => {
    if (event !== '' && txHash !== '' && amount !== 0) {
      console.log('Event type: ' + event);

      // re-execute getTokenBalances() in UserBalances.js
      const timer = setTimeout(() => {
        dispatch({
          type: 'refresh_tokens',
          data: txHash,
        });

        clearTimeout(timer);
      }, 2000);

      setEvent('');
      setTxHash('');
      setAmount(0);

      // post transaction to database
      console.log('Posting Connext transaction to db: ' + event);

      Fetch.POST_HISTORY(
        state.userAddress,
        amount,
        event,
        'Confirmed',
        txHash,
        state.userStatus
      );
    }
  }, [event, txHash, amount]);

  const injectedProvider = window.ethereum;

  const rampDAI = new RampInstantSDK({
    hostAppName: 'Buy DAI Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335593/COIN_-_DAI_kbvlhx.png',
    swapAsset: 'MATIC_DAI',
  });
  const rampUSDT = new RampInstantSDK({
    hostAppName: 'Buy USDT Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335593/COIN_-_USDT_kb1sem.png',
    swapAsset: 'USDT',
  });
  const rampETH = new RampInstantSDK({
    hostAppName: 'Buy ETH Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335594/COIN_-_ETH_ji9yyj.png',
    swapAsset: 'ETH',
  });

  const handleClick = coin => {
    if (coin === 'usdt') {
      rampUSDT.show();
    } else if (coin === 'atri') {
      window.open('https://www.ataritokens.com/myportal/home', '_blank');
    } else if (coin === 'weth') {
      rampETH.show();
    } else if (coin === 'mana') {
      window.open('https://www.binance.com/en/trade/MANA_ETH', '_blank');
    } else {
      rampDAI.show();
    }
  };

  // set modal state and event type
  function setStateAndEvent(state, type) {
    setShowModal(state);

    setEvent(type);
  }

  // handle Connext deposit/withdrawal events
  async function getWithdrawalTransaction(params) {
    setTxHash(params);
  }

  function getWithdrawalAmount(params) {
    setAmount(params);
  }

  // top up user to 5000 play tokens
  async function topUp() {
    await Fetch.TOP_UP_USER(state.userAddress);

    const refresh = !state.updateInfo;

    dispatch({
      type: 'update_info',
      data: refresh,
    });
  }

  return (
    <div className={styles.balances_container}>
      <h2 className={styles.balances_container_title}>Your Assets</h2>
      <div className={styles.balance_column}>
        <span className={styles.float_left}>
          <div className={styles.free_icon}>FREE</div>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>Free Play</p>
            <p>Free</p>
          </span>
        </span>

        <div className={styles.float_right}>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>{state.userInfo.balancePLAY} FREE</p>
            <p>$0</p>
          </span>

          <>
            {state.userInfo.count === 2 ? (
              <Button className={styles.topUp} disabled>
                Top Up Free Tokens
              </Button>
            ) : (
              <Button className={styles.topUp} onClick={() => topUp()}>
                Top Up Free Tokens
              </Button>
            )}
          </>
        </div>
      </div>


      {/* ////// ETHEREUM ////// */}
      <div className={styles.balance_column}>
        <span className={styles.float_left}>
          <span className={styles.img_left}>
            <img src={Images[`ETH_CIRCLE`]} />
          </span>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>Ethereum</p>
            <p>ETH</p>
          </span>
        </span>

        <div className={styles.float_right}>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>{parseInt(state.userBalances[2][3]).toLocaleString()} ETH</p>
            <p></p>
          </span>

          <div>
            {state.userInfo.tokenArray[4] ? (
            <span>
              <Button
                className={styles.deposit_button}
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Deposit
              </Button>

              <Button
                className={styles.deposit_button}
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Withdraw
              </Button>
            </span>
          ) : (
            <ModalAccept />
          )}
            <Button
              className={styles.newLink}
              onClick={() => handleClick(coin.coinKey)}
            >
              Buy
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>


      {/* ////// MANA ////// */}
      <div className={styles.balance_column}>
        <span className={styles.float_left}>
          <span className={styles.img_left}>
            <img src={Images[`MANA_CIRCLE`]} />
          </span>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>Decentraland</p>
            <p>MANA</p>
          </span>
        </span>

        <div className={styles.float_right}>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>{parseInt(state.userBalances[1][1]).toLocaleString()} MANA</p>
            <p>${state.userInfo.totalMANA}</p>
          </span>

          <div>
            {state.userInfo.tokenArray[1] ? (
            <span>
              <Button
                className={styles.deposit_button}
                onClick={() => setStateAndEvent(1, true, 'MANA Deposit')}
              >
                Deposit
              </Button>

              <ConnextModal
                showModal={showModal}
                onClose={() => setStateAndEvent(1, false, 'MANA Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                depositAssetId={connext.assetID_1_MANA}
                depositChainId={1}
                depositChainProvider={connext.chainProviderInfura}
                withdrawAssetId={connext.assetID_2_MANA}
                withdrawChainId={137}
                withdrawChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />

              <Button
                className={styles.deposit_button}
                onClick={() => setStateAndEvent(2, true, 'MANA Withdrawal')}
              >
                Withdraw
              </Button>

              <ConnextModal
                showModal={showModal_2}
                onClose={() => setStateAndEvent(2, false, 'MANA Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                withdrawAssetId={connext.assetID_1_MANA}
                withdrawChainId={1}
                withdrawChainProvider={connext.chainProviderInfura}
                depositAssetId={connext.assetID_2_MANA}
                depositChainId={137}
                depositChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />
            </span>
          ) : (
            <ModalAccept />
          )}
            <Button
              className={styles.newLink}
              onClick={() => handleClick(coinKey)}
            >
              Buy
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* ////// MANA ////// */}
      <div className={styles.balance_column}>
        <span className={styles.float_left}>
          <span className={styles.img_left}>
            <img src={Images[`USDT_CIRCLE`]} />
          </span>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>Tether</p>
            <p>USDT</p>
          </span>
        </span>

        <div className={styles.float_right}>
          <span className={styles.balance_column_header}>
            <p className={styles.bold_text}>                
              {parseInt(
                state.userBalances[2][1] * 1000000000000
              ).toLocaleString()} USDT
            </p>
            <p>${state.userInfo.totalUSDT}</p>
          </span>

          <div>
          {state.userInfo.tokenArray[2] ? (
            <span>
              <Button
                onClick={() => setStateAndEvent(5, true, 'USDT Deposit')}
              >
                Deposit
              </Button>

              <ConnextModal
                showModal={showModal_5}
                onClose={() => setStateAndEvent(5, false, 'USDT Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                depositAssetId={connext.assetID_1_USDT}
                depositChainId={1}
                depositChainProvider={connext.chainProviderInfura}
                withdrawAssetId={connext.assetID_2_USDT}
                withdrawChainId={137}
                withdrawChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />

              <Button
                onClick={() => setStateAndEvent(6, true, 'USDT Withdrawal')}
              >
                Withdraw
              </Button>

              <ConnextModal
                showModal={showModal_6}
                onClose={() => setStateAndEvent(6, false, 'USDT Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                withdrawAssetId={connext.assetID_1_USDT}
                withdrawChainId={1}
                withdrawChainProvider={connext.chainProviderInfura}
                depositAssetId={connext.assetID_2_USDT}
                depositChainId={137}
                depositChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />
            </span>
          ) : (
            <ModalAcceptUSDT />
          )}
            <Button
              className={styles.newLink}
              onClick={() => handleClick(coin.coinKey)}
            >
              Buy
              <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Balances;
