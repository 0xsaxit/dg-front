import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { GlobalContext } from 'store/index';
import Images from 'common/Images';
import Global from 'components/Constants';
import ModalAcceptMANA from 'components/modal/ModalAccept/MANA';
import ModalAcceptDAI from 'components/modal/ModalAccept/DAI';
import ModalAcceptETH from 'components/modal/ModalAccept/ETH';
import ModalAcceptICE from 'components/modal/ModalAccept/ICE';
import ModalDepositPolygon from 'components/modal/ModalDepositPolygon';
import styles from './Balances.module.scss';
import Fetch from '../../../../common/Fetch';

const connext = {
  routerPublicID: Global.KEYS.CONNEXT_PUBLIC_ID,
  chainProviderInfura:
    'https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6',
  chainProviderMatic: 'https://rpc-mainnet.matic.quiknode.pro',
  assetID_1_MANA: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA,
  assetID_2_MANA: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA,
  assetID_1_DAI: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DAI,
  assetID_2_DAI: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI,
  assetID_1_USDT: Global.ADDRESSES.ROOT_TOKEN_ADDRESS_USDT,
  assetID_2_USDT: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT,
};

const Balances = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [event, setEvent] = useState('');
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState(0);
  const buttonPlay = document.getElementById('play-now-button-balances');
  const [depositModal, setShowingDepositModal] = useState(false);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  useEffect(() => {
    if (state.dgLoading === 1) {
      console.log("Pending transfer ... ");
    } else if (state.dgLoading === 1) {
      console.log("Transfer completed ... ");
    } else {
      console.log("Transfer Default Setting ... ");
    }
  }, [state.dgLoading]);

  useEffect(() => {
    const fetchResumeModel = async () => {
      const lockID = state.openModal.lockID;
      const resumeID = state.openModal.resumeID;

      if (lockID == 1) {
        setResumeModal1(resumeID);
      } else if (lockID == 2) {
        setResumeModal2(resumeID);
      } else if (lockID == 3) {
        setResumeModal3(resumeID);
      } else if (lockID == 4) {
        setResumeModal4(resumeID);
      } else if (lockID == 5) {
        setResumeModal5(resumeID);
      } else if (lockID == 6) {
        setResumeModal6(resumeID);
      } else {
        console.log("UnExpected lockID ...");
      }
    }

    if (state.dgShow) {
      fetchResumeModel();
      setStateAndEvent(state.openModal.lockID, true, '');
      dispatch({
        type: 'set_dgShow',
        data: false,
      });
    }
  }, [state.dgShow]);

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

      // post transaction to database
      console.log('Posting Connext transaction to db: ' + event);
      console.log("TxHash: ", txHash);
      console.log("Amount: ", amount);

      Fetch.POST_HISTORY(
        state.userAddress,
        amount,
        event,
        'Confirmed',
        txHash,
        state.userStatus
      );

      console.log('Completed Fetch!');

      setEvent('');
      setTxHash('');
      setAmount(0);
    }
  }, [event, txHash, amount]);

  const rampDAI = new RampInstantSDK({
    hostAppName: 'Buy DAI Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1618335593/COIN_-_DAI_kbvlhx.png',
    swapAsset: 'MATIC_DAI',
  });
  const rampETH = new RampInstantSDK({
    hostAppName: 'Buy ETH Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1618335594/COIN_-_ETH_ji9yyj.png',
    swapAsset: 'MATIC_ETH',
  });

  function Balances() {
    return (
      <section>

        <div className={styles.balances_container}>
          <h2 className={styles.balances_container_title}>Your Assets</h2>
          <div className={styles.balance_column}>
            <span className={styles.float_left}>
              <span className={styles.img_left}>
                <img src={Images[`PLAY_CIRCLE`]} />
              </span>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>Free Play</p>
                <p className={styles.bold_text}>Free</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>{state.userInfo.balancePLAY} FREE</p>
                <p className={styles.bold_text}>$0.00</p>
              </span>

              <>
                {state.userInfo.count === 2 ? (
                  <Button className={styles.topUp} disabled>
                    Play Now
                  </Button>
                ) : (
                  <Button className={styles.topUp} onClick={() => {
                    window.open("https://play.decentraland.org/?position=-118%2C135&realm=dg", "_blank");
                  }}>
                    Play Now
                  </Button>
                )}
              </>
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
                <p className={styles.bold_text}>MANA</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>{parseInt(state.userBalances[1][1]).toLocaleString()} MANA</p>
                <p className={styles.bold_text}>${formatPrice(state.userBalances[1][1] * state.DGPrices.mana, 2)}</p>
              </span>

              <div>
                {state.userInfo.tokenArray[1] ? (
                  <span>
                    <Button
                      className={styles.temp_deposit}
                      onClick={() => {
                        setShowingDepositModal(true)
                      }}
                    >
                      Deposit & withdraw
                    </Button>
                  </span>
                ) : (
                  <ModalAcceptMANA />
                )}
                <Button
                  className={styles.newLink}
                  href="https://www.binance.com/en/trade/MANA_ETH"
                  target="_blank"
                >
                  Buy
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>

          {/* ////// DAI ////// */}
          <div className={styles.balance_column}>
            <span className={styles.float_left}>
              <span className={styles.img_left}>
                <img src={Images[`DAI_CIRCLE`]} />
              </span>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>Dai</p>
                <p className={styles.bold_text}>DAI</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>
                  {parseInt(state.userBalances[0][1]).toLocaleString()} DAI
                </p>
                <p className={styles.bold_text}>${formatPrice(state.userBalances[0][1] * state.DGPrices.dai, 2)}</p>
              </span>

              <div>
                {state.userInfo.tokenArray[0] ? (
                  <span>
                    <Button
                      className={styles.temp_deposit}
                      onClick={() => {
                        setShowingDepositModal(true)
                      }}
                    >
                      Deposit & withdraw
                    </Button>
                  </span>
                ) : (
                  <ModalAcceptDAI />
                )}
                <Button
                  className={styles.newLink}
                  onClick={() => rampDAI.show()}
                >
                  Buy
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white" />
                  </svg>
                </Button>
              </div>
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
                <p className={styles.bold_text}>ETH</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>{Number(state.userBalances[2][3]).toFixed(3)} ETH</p>
                <p className={styles.bold_text}>${formatPrice(state.userBalances[2][3] * state.DGPrices.eth, 2)}</p>
              </span>

              <div>
                {state.userInfo.tokenArray[4] ? (
                  <span>
                    <Button
                      className={styles.temp_deposit}
                      onClick={() => {
                        setShowingDepositModal(true)
                      }}
                    >
                      Deposit & withdraw
                    </Button>
                  </span>
                ) : (
                  <ModalAcceptETH />
                )}
                <Button
                  className={styles.newLink}
                  onClick={() => rampETH.show()}
                >
                  Buy
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>


          {/* ////// ICE ////// */}
          <div className={styles.balance_column}>
            <span className={styles.float_left}>
              <span className={styles.img_left}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1635286999/Group_80_exgcle.png" />
              </span>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>Ice</p>
                <p className={styles.bold_text}>ICE</p>
              </span>
            </span>

            <div className={styles.float_right}>
              <span className={styles.balance_column_header}>
                <p className={styles.bold_text}>{parseInt(state.iceAmounts.ICE_AVAILABLE_AMOUNT).toLocaleString()} ICE</p>
                <p className={styles.bold_text}>${formatPrice(state.iceAmounts.ICE_AVAILABLE_AMOUNT * state.DGPrices.ice, 2)}</p>
              </span>

              <div>
                {state.userInfo.tokenArray[5] ? (
                  <span>
                    <Button
                      className={styles.temp_deposit}
                      onClick={() => {
                        setShowingDepositModal(true)
                      }}
                    >
                      Deposit & withdraw
                    </Button>
                  </span>
                ) : (
                  <ModalAcceptICE />
                )}

                <Button
                  className={styles.newLink}
                  href="https://quickswap.exchange/#/swap?outputCurrency=0xc6c855ad634dcdad23e64da71ba85b8c51e5ad7c"
                  target="_blank"
                >
                  Buy
                  <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.125 8.4292L12.1177 1.09033C12.1177 0.504395 11.7295 0.101562 11.1289 0.101562H3.78271C3.21875 0.101562 2.81592 0.519043 2.81592 1.02441C2.81592 1.52246 3.24072 1.92529 3.76807 1.92529H6.45605L9.19531 1.83008L7.8916 2.97998L1.17529 9.70361C0.977539 9.90869 0.867676 10.1504 0.867676 10.3921C0.867676 10.8828 1.32178 11.3516 1.82715 11.3516C2.06885 11.3516 2.31055 11.2417 2.5083 11.0439L9.23193 4.32764L10.3965 3.0166L10.2866 5.65332V8.45117C10.2866 8.97119 10.6821 9.40332 11.1948 9.40332C11.7002 9.40332 12.125 8.97852 12.125 8.4292Z" fill="white" />
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <ModalDepositPolygon
          show={depositModal}
          close={() => {
            setShowingDepositModal(false);
          }}
        />
      </section>
    );
  }

  // set modal state and event type
  function setStateAndEvent(number, state, type) {
    if (type) {
      setEvent(type);
    }
  }

  return Balances();
};

export default Balances;