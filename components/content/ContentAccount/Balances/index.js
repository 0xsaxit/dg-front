import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { GlobalContext } from 'store/index';
import { DGModal } from 'dg-modal-widget';
import Images from 'common/Images';
import Global from 'components/Constants';
import ModalAcceptMANA from 'components/modal/ModalAccept/MANA';
import ModalAcceptDAI from 'components/modal/ModalAccept/DAI';
import ModalAcceptETH from 'components/modal/ModalAccept/ETH';
import ModalAcceptICE from 'components/modal/ModalAccept/ICE';
import styles from './Balances.module.scss';
import Fetch from '../../../../common/Fetch';
import { BreadcrumbJsonLd } from 'next-seo';


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
  const [showModal, setShowModal] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showModal_3, setShowModal_3] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  const [showModal_5, setShowModal_5] = useState(false);  //USDT deposit
  const [showModal_6, setShowModal_6] = useState(false);  //USDT withdraw
  const [event, setEvent] = useState('');
  const [txHash, setTxHash] = useState('');
  const [amount, setAmount] = useState(0);
  const buttonPlay = document.getElementById('play-now-button-balances');

  const [resumeModal1, setResumeModal1] = useState(0); // MANA deposit
  const [resumeModal2, setResumeModal2] = useState(0); // MANA withdraw

  const [resumeModal3, setResumeModal3] = useState(0); // DAI deposit
  const [resumeModal4, setResumeModal4] = useState(0); // DAI withdraw

  const [resumeModal5, setResumeModal5] = useState(0); // USDT deposit
  const [resumeModal6, setResumeModal6] = useState(0); // USDT withdraw
  const [lock, setLock] = useState(0);

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
      setLock(0);
      console.log("Transfer Default Setting ... ");
    }
  }, [state.dgLoading]);

  useEffect(() => {

    const fetchResumeModel = async () => {
      const lockID = state.openModal.lockID;
      const resumeID = state.openModal.resumeID;
      setLock(lockID);

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

  //console.log("userBalances23: ", state.userBalances);
  const injectedProvider = window.ethereum;

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
                  {/*<Button
                  className={styles.deposit_button}
                  onClick={() => setStateAndEvent(1, true, 'MANA Deposit')}
                  style={{display: lock === 2? 'none':'flex', width: lock === 2? '':'100%'}}
                  disabled = {lock >0 && lock!==1? true : false}
                >
                  {resumeModal1 ? 'Pending Transfer' : 'Deposit' }
                </Button>

                <DGModal
                  showModal={showModal}
                  onClose={() => setStateAndEvent(1, false, 'MANA Deposit')}
                  onReady={params => console.log("MANA MODAL1 IS READY =======>", params)}
                  withdrawalAddress={state.userAddress}
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}                 
                  routerPublicIdentifier={connext.routerPublicID}
                  depositAssetId={connext.assetID_1_MANA}
                  depositChainProvider={connext.chainProviderInfura}
                  withdrawAssetId={connext.assetID_2_MANA}
                  withdrawChainProvider={connext.chainProviderMatic}
                  depositChainId={1}
                  withdrawChainId={137}
                  isDeposit = {true}
                  onFinished={(txHash, amountUi) => {
                    setResumeModal1(0);
                    getWithdrawalAmount(txHash, amountUi);
                    updateStatus(0, 1);
                  }}
                  resumeModal={state.openModal.resumeID>0 ? 1 : resumeModal1}
                  onPaused = {params => {
                    if(params > 0 && params < 4) {
                      setResumeModal1(params);
                      updateStatus(params, 1);
                    }
                  }}
                />

                <Button
                  className={styles.deposit_button}
                  onClick={() => setStateAndEvent(2, true, 'MANA Withdrawal')}
                  style={{display: lock === 1? 'none':'flex', width: lock === 1? '':'100%'}}
                  disabled = {lock >0 && lock!==2? true : false}
                >
                  {resumeModal2 ? 'Pending Transfer' : 'Withdraw' }
                </Button>

                <DGModal
                  showModal={showModal_2}
                  onClose={() => setStateAndEvent(2, false, 'MANA Withdrawal')}
                  onReady={params => console.log("MANA MODAL2 IS READY =======>", params)}
                  withdrawalAddress={state.userAddress}
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}                 
                  routerPublicIdentifier={connext.routerPublicID}
                  depositAssetId={connext.assetID_2_MANA}
                  depositChainProvider={connext.chainProviderMatic}
                  withdrawAssetId={connext.assetID_1_MANA}
                  withdrawChainProvider={connext.chainProviderInfura}
                  depositChainId={137}
                  withdrawChainId={1}
                  isDeposit = {false}
                  onFinished={(txHash, amountUi) => {
                    setResumeModal2(0);
                    getWithdrawalAmount(txHash, amountUi);
                    updateStatus(0, 2);
                  }}
                  resumeModal={state.openModal.resumeID>0 ? 1 : resumeModal2}
                  onPaused = {params => {
                    if(params > 0 && params < 4) {
                      setResumeModal2(params);
                      updateStatus(params, 2);
                    }
                  }}
                />
              </span>*/}
                  <Button
                    className={styles.temp_deposit}
                    href="https://wallet.polygon.technology/bridge"
                    target="_blank"
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
                  {/*<Button 
                  onClick={() => setStateAndEvent(3, true, 'DAI Deposit')}
                  className={styles.deposit_button}
                  style={{display: lock === 4? 'none':'flex', width: lock === 4? '':'100%'}}
                  disabled = {lock >0 && lock!==3? true : false}
                >
                  {resumeModal3 ? 'Pending Transfer' : 'Deposit' }
                </Button>

                <DGModal
                  showModal={showModal_3}
                  onClose={() => setStateAndEvent(3, false, 'DAI Deposit')}
                  onReady={params => console.log("DAI MODAL1 IS READY =======>", params)}
                  withdrawalAddress={state.userAddress}
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}                 
                  routerPublicIdentifier={connext.routerPublicID}
                  depositAssetId={connext.assetID_1_DAI}
                  depositChainProvider={connext.chainProviderInfura}
                  withdrawAssetId={connext.assetID_2_DAI}
                  withdrawChainProvider={connext.chainProviderMatic}
                  depositChainId={1}
                  withdrawChainId={137}
                  isDeposit = {true}
                  onFinished={(txHash, amountUi) => {
                    setResumeModal3(0);
                    getWithdrawalAmount(txHash, amountUi);
                    updateStatus(0, 3);
                  }}
                  resumeModal={state.openModal.resumeID>0 ? 1 : resumeModal3}
                  onPaused = {params => {
                    if(params > 0 && params < 4) {
                      setResumeModal3(params);
                      updateStatus(params, 3);
                    }
                  }}
                />

                <Button 
                  onClick={() => setStateAndEvent(4, true, 'DAI Withdrawal')}
                  className={styles.deposit_button}
                  style={{display: lock === 3? 'none':'flex', width: lock === 3? '':'100%'}}
                  disabled = {lock >0 && lock!==4? true : false}
                >
                  {resumeModal4 ? 'Pending Transfer' : 'Withdraw' }
                </Button>

                <DGModal
                  showModal={showModal_4}
                  onClose={() => setStateAndEvent(4, false, 'DAI Withdrawal')}
                  onReady={params => console.log("DAI MODAL2 IS READY =======>", params)}
                  withdrawalAddress={state.userAddress}
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}                 
                  routerPublicIdentifier={connext.routerPublicID}
                  depositAssetId={connext.assetID_2_DAI}
                  depositChainProvider={connext.chainProviderMatic}
                  withdrawAssetId={connext.assetID_1_DAI}
                  withdrawChainProvider={connext.chainProviderInfura}
                  depositChainId={137}
                  withdrawChainId={1}
                  isDeposit = {false}
                  onFinished={(txHash, amountUi) => {
                    setResumeModal4(false);
                    getWithdrawalAmount(txHash, amountUi);
                    updateStatus(0);
                  }}
                  resumeModal={state.openModal.resumeID>0 ? 1 : resumeModal4}
                  onPaused = {params => {
                    if(params > 0 && params < 4) {
                      setResumeModal4(params);
                      updateStatus(params);
                    }
                  }}
                />
              </span>*/}
                  <Button
                    className={styles.temp_deposit}
                    href="https://wallet.polygon.technology/bridge"
                    target="_blank"
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
                    href="https://wallet.polygon.technology/bridge"
                    target="_blank"
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
                    href="https://wallet.polygon.technology/bridge"
                    target="_blank"
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
    );
  }

  // set modal state and event type
  function setStateAndEvent(number, state, type) {

    if (number === 1) {
      setShowModal(state);
    } else if (number === 2) {
      setShowModal_2(state);
    } else if (number === 3) {
      setShowModal_3(state);
    } else if (number === 4) {
      setShowModal_4(state);
    } else if (number === 5) {
      setShowModal_5(state);
    } else if (number === 6) {
      setShowModal_6(state);
    }

    if (type) {
      setEvent(type);
    }
  }

  // handle Connext deposit/withdrawal events
  function getWithdrawalAmount(txHash, amountUi) {
    setTxHash(txHash);
    setAmount(amountUi);
  }

  function updateStatus(resumeID, lockID) {

    dispatch({
      type: 'set_dgLoading',
      data: resumeID === 0 ? 2 : 1,
    });

    dispatch({
      type: 'set_openModal',
      data: {
        resumeID: resumeID === 0 ? 0 : resumeID,
        lockID: lockID,
      }
    });

    setLock(lockID);
    console.log("test", state.openModal);

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

  return Balances();
};

export default Balances;