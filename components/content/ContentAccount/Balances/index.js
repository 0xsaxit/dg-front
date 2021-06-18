import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { GlobalContext } from 'store/index';
import Images from 'common/Images';
import { ConnextModal } from '@connext/vector-modal';
import Global from 'components/Constants';
import ModalAccept from 'components/modal/ModalAccept';
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

const coins = [
  {
    coinKey: 'weth',
    coin: 'ETH',
    coinName: 'Ethereum',
    tokenNumber: 4,
    balance: a => parseInt(a[2][3]).toLocaleString(),
  },
  {
    coinKey: 'mana',
    coin: 'MANA',
    coinName: 'Decentraland',
    tokenNumber: 1,
    balance: a => parseInt(a[1][1]).toLocaleString(),
  },
  {
    coinKey: 'usdt',
    coin: 'USDT',
    coinName: 'Tether',
    tokenNumber: 2,
    balance: a => parseInt(a[2][1] * 1000000000000).toLocaleString(),
  },
  {
    coinKey: 'dai',
    coin: 'DAI',
    coinName: 'Dai',
    tokenNumber: 0,
    balance: a => parseInt(a[0][1]).toLocaleString(),
  },
  {
    coinKey: 'atri',
    coin: 'ATRI',
    coinName: 'Atri',
    tokenNumber: 3,
    balance: a => parseInt(a[2][2]).toLocaleString(),
  },
];

function Balances() {
  const [state, dispatch] = useContext(GlobalContext);
  const [showModal, setShowModal] = useState(false);
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
            <p>Free Play</p>
            <p>Free</p>
          </span>
        </span>

        <div className={styles.float_right}>
          <span className={styles.balance_column_header}>
            <p>{state.userInfo.balancePLAY} FREE</p>
            <p>${state.userInfo.totalPLAY}</p>
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

      {coins.map(coin => {
        return (
          <div className={styles.balance_column}>
            <span className={styles.float_left}>
              <span className={styles.img_left}>
                <img src={Images[`${coin.coin}_CIRCLE`]} />
              </span>
              <span className={styles.balance_column_header}>
                <p>{coin.coinName}</p>
                <p>{coin.coin}</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p>
                  {coin.balance(state.userBalances)}&nbsp;{coin.coin}
                </p>
                <p>
                  ${state.userInfo[`total${coin.coinKey.toUpperCase()}`]}
                </p>
              </span>

              <div>
                {state.userInfo.tokenArray[coin.tokenNumber] ? (
                  <div>
                    <Button
                      onClick={() =>
                        setStateAndEvent(false, `${coin.coin} Withdrawl`)
                      }
                    >
                      Withdraw
                    </Button>
                    {['mana', 'dai', 'usdt'].includes(coin.coinKey) && (
                      <ConnextModal
                        showModal={showModal}
                        onClose={() =>
                          setStateAndEvent(false, `${coin.coin} Withdrawal`)
                        }
                        onReady={params =>
                          console.log('MODAL IS READY =======>', params)
                        }
                        withdrawalAddress={state.userAddress}
                        routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                        withdrawAssetId={connext[`assetID_1_${coin.coin}`]}
                        withdrawChainId={1}
                        withdrawChainProvider={connext.chainProviderInfura}
                        depositAssetId={connext[`assetID_2_${coin.coin}`]}
                        depositChainId={137}
                        depositChainProvider={connext.chainProviderMatic}
                        injectedProvider={injectedProvider}
                        loginProvider={injectedProvider}
                        onWithdrawalTxCreated={getWithdrawalTransaction}
                        onFinished={getWithdrawalAmount}
                      />
                    )}
                    <Button
                      onClick={() =>
                        setStateAndEvent(true, `${coin.coin} Deposit`)
                      }
                    >
                      Deposit
                    </Button>
                    {['mana', 'dai', 'usdt'].includes(coin.coinKey) && (
                      <ConnextModal
                        showModal={showModal}
                        onClose={() =>
                          setStateAndEvent(false, `${coin.coin} Deposit`)
                        }
                        onReady={params =>
                          console.log('MODAL IS READY =======>', params)
                        }
                        withdrawalAddress={state.userAddress}
                        routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                        depositAssetId={connext[`assetID_1_${coin.coin}`]}
                        depositChainId={1}
                        depositChainProvider={connext.chainProviderInfura}
                        withdrawAssetId={connext[`assetID_2_${coin.coin}`]}
                        withdrawChainId={137}
                        withdrawChainProvider={connext.chainProviderMatic}
                        injectedProvider={injectedProvider}
                        loginProvider={injectedProvider}
                        onWithdrawalTxCreated={getWithdrawalTransaction}
                        onFinished={getWithdrawalAmount}
                      />
                    )}
                  </div>
                ) : (
                  <ModalAccept coinLabel={coin.coinKey} />
                )}
                <Button
                  className={styles.newLink}
                  onClick={() => handleClick(coin.coinKey)}
                >
                  Buy
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-arrow-up-right"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0v-6z"
                    />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Balances;
