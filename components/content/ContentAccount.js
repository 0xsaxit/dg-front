import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { ConnextModal } from '@connext/vector-modal';
import transakSDK from '@transak/transak-sdk';
import { Button, Divider, Grid, Icon, Image, Table } from 'semantic-ui-react';
import Global from '../Constants';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import ModalAcceptMana from '../modal/ModalAcceptMana';
import ModalAcceptDai from '../modal/ModalAcceptDai';
import ModalAcceptUSDT from '../modal/ModalAcceptUSDT';
import Aux from '../_Aux';

const transak_1 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultCryptoCurrency: 'MANA',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy MANA',
});

const transak_2 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultCryptoCurrency: 'DAI',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy DAI',
});

const transak_3 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultCryptoCurrency: 'USDT',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy USDT',
});

const transak_4 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  defaultCryptoCurrency: 'ATRI',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy ATRI',
});

const connext = {
  routerPublicID: 'vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np',
  chainProviderInfura:
    'https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6',
  chainProviderMatic: 'https://rpc-mainnet.matic.network',
  assetID_1_MANA: '0x0F5D2fB29fb7d3CFeE444a200298f468908cC942',
  assetID_2_MANA: '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4',
  assetID_1_DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  assetID_2_DAI: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  assetID_1_USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  assetID_2_USDT: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
};

const ContentAccount = (props) => {
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
  const [wearables, setWearables] = useState([]);
  const [poaps, setPoaps] = useState([]);
  const [injectedProvider, setInjectedProvider] = useState('');

  const buttonPlay = document.getElementById('play-now-button-balances');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setInjectedProvider(window.ethereum);
  }, []);

  // get user nfts statistics
  useEffect(() => {
    (async function () {
      let response = await Fetch.NFTS_1(state.userAddress);
      let json = await response.json();

      let response_2 = await Fetch.NFTS_2(state.userAddress);
      let json_2 = await response_2.json();

      let wearables = [];
      let i;
      for (i = 0; i < json.assets.length; i++) {
        wearables.push(json.assets[i]);
      }
      let j;
      for (j = 0; j < json_2.assets.length; j++) {
        wearables.push(json_2.assets[j]);
      }

      setWearables(wearables);
    })();
  }, []);

  // get user poaps
  useEffect(() => {
    (async function () {
      let response_1 = await Fetch.POAPS(state.userAddress);
      let json_1 = await response_1.json();

      let poaps = [];
      let k;
      for (k = 0; k < json_1.length; k++) {
        if (json_1[k].event.name.includes('Decentral Games')) {
          poaps.push(json_1[k].event);
        }
      }

      setPoaps(poaps);
    })();
  }, []);

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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle Transak purchase events and write to database
  useEffect(() => {
    // get all the events
    transak_1.on(transak_1.ALL_EVENTS, (data) => {
      console.log('Transak events 1: ' + data);
    });
    transak_2.on(transak_2.ALL_EVENTS, (data) => {
      console.log('Transak events 2: ' + data);
    });
    transak_3.on(transak_3.ALL_EVENTS, (data) => {
      console.log('Transak events 3: ' + data);
    });
    transak_4.on(transak_4.ALL_EVENTS, (data) => {
      console.log('Transak events 4: ' + data);
    });

    // triggers when the user closes the widget
    transak_1.on(transak_1.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_1.close();
    });
    transak_2.on(transak_2.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_2.close();
    });
    transak_3.on(transak_3.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_3.close();
    });
    transak_4.on(transak_4.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_4.close();
    });

    // triggers when the payment is complete
    transak_1.on(transak_1.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('Transak order complete 1: ' + orderData);
      transak_1.close();
    });
    transak_2.on(transak_2.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('Transak order complete 2: ' + orderData);
      transak_2.close();
    });
    transak_3.on(transak_3.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('Transak order complete 3: ' + orderData);
      transak_3.close();
    });
    transak_4.on(transak_4.EVENTS.TRANSAK_ORDER_SUCCESSFUL, (orderData) => {
      console.log('Transak order complete 2: ' + orderData);
      transak_4.close();
    });
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAccount() {
    return (
      <div className="balances-container">
        <div className="balances-column one">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img
                src={Images.PLAY_CIRCLE}
                className="farming-logo-small"
              />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">Play</p>
              <p className="earned-amount">{state.userInfo.balancePLAY}</p>
            </span>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount"> {state.userInfo.totalPLAY} </p>
          </span>

          <Divider className="divider-dg-top"/>

          <span className="balances-button-span">
            <Button
              id="play-now-button-balances"
              className="balances-play-button"
              href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
              target="_blank"
            >
              PLAY NOW
            </Button>
            {state.userInfo.count === 2 ? (
              <Button disabled className="balances-play-button">
                TOP UP
              </Button>
            ) : (
              <Button
                onClick={() => topUp()}
                className="balances-play-button"
                id="balances-padding-correct"
              >
                TOP UP
              </Button>
            )}
          </span>
        </div>

        <div className="balances-column two">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img
                src={Images.MANA_CIRCLE}
                className="farming-logo-small"
              />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">Mana</p>
              <p className="earned-amount">
                {parseInt(state.userBalances[1][1]).toLocaleString()}
              </p>
            </span>
          </span>

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className="balances-top-button"
              onClick={() => show_transak_1()}
              style={{ marginTop: '-60px' }}
            >
              BUY
            </Button>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount">{state.userInfo.totalMANA}</p>
          </span>

          <Divider className="divider-dg-top" />

          {state.userInfo.tokenArray[1] ? (
            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                onClick={() => setStateAndEvent(1, true, 'MANA Deposit')}
                style={{ padding: '0 0 0 0' }}
              >
                DEPOSIT
              </Button>

              <ConnextModal
                showModal={showModal}
                onClose={() => setStateAndEvent(1, false, 'MANA Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
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
                className="balances-play-button"
                onClick={() => setStateAndEvent(2, true, 'MANA Withdrawal')}
                style={{ padding: '0 0 0 0' }}
              >
                WITHDRAW
              </Button>

              <ConnextModal
                showModal={showModal_2}
                onClose={() => setStateAndEvent(2, false, 'MANA Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
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
            <ModalAcceptMana />
          )}
        </div>

        <div className="balances-column three">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img
                src={Images.DAI_CIRCLE}
                className="farming-logo-small"
              />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">Dai</p>
              <p className="earned-amount">
                {parseInt(state.userBalances[0][1]).toLocaleString()}
              </p>
            </span>
          </span>

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className="balances-top-button two"
              onClick={() => show_transak_2()}
              style={{ marginTop: '-60px' }}
            >
              BUY
            </Button>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount">{state.userInfo.totalDAI}</p>
          </span>

          <Divider className="divider-dg-top" />

          {state.userInfo.tokenArray[0] ? (
            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                onClick={() => setStateAndEvent(3, true, 'DAI Deposit')}
                style={{ padding: '0 0 0 0' }}
              >
                DEPOSIT
              </Button>

              <ConnextModal
                showModal={showModal_3}
                onClose={() => setStateAndEvent(3, false, 'DAI Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
                depositAssetId={connext.assetID_1_DAI}
                depositChainId={1}
                depositChainProvider={connext.chainProviderInfura}
                withdrawAssetId={connext.assetID_2_DAI}
                withdrawChainId={137}
                withdrawChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />

              <Button
                className="balances-play-button"
                onClick={() => setStateAndEvent(4, true, 'DAI Withdrawal')}
                style={{ padding: '0 0 0 0' }}
              >
                WITHDRAW
              </Button>

              <ConnextModal
                showModal={showModal_4}
                onClose={() => setStateAndEvent(4, false, 'DAI Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
                withdrawAssetId={connext.assetID_1_DAI}
                withdrawChainId={1}
                withdrawChainProvider={connext.chainProviderInfura}
                depositAssetId={connext.assetID_2_DAI}
                depositChainId={137}
                depositChainProvider={connext.chainProviderMatic}
                injectedProvider={injectedProvider}
                loginProvider={injectedProvider}
                onWithdrawalTxCreated={getWithdrawalTransaction}
                onFinished={getWithdrawalAmount}
              />
            </span>
          ) : (
            <ModalAcceptDai />
          )}
        </div>

        {/*<div className="balances-column one">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1617897947/825_vksbx4.png"
                className="farming-logo-small"
              />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">USDT</p>
              <p className="earned-amount">                
                {parseInt(state.userBalances[2][1] * 1000000000000).toLocaleString()}
              </p>
            </span>
          </span>

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className="balances-top-button"
              onClick={() => show_transak_3()}
              style={{ marginTop: '-60px' }}
            >
              BUY
            </Button>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount"> {state.userInfo.totalUSDT} </p>
          </span>

          <Divider className="divider-dg-top" />

            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                onClick={() => setStateAndEvent(5, true, 'USDT Deposit')}
                style={{ padding: '0 0 0 0' }}
              >
                DEPOSIT
              </Button>

              <ConnextModal
                showModal={showModal_5}
                onClose={() => setStateAndEvent(5, false, 'USDT Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
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
                className="balances-play-button"
                onClick={() => setStateAndEvent(6, true, 'USDT Withdrawal')}
                style={{ padding: '0 0 0 0' }}
              >
                WITHDRAW
              </Button>

              <ConnextModal
                showModal={showModal_6}
                onClose={() => setStateAndEvent(6, false, 'USDT Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier={connext.routerPublicID}
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

        </div>

        <div className="balances-column two">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1618091848/Group_uotjwj.png"
                className="farming-logo-small"
              />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">Atri</p>
              <p className="earned-amount">
                {parseInt(state.userBalances[2][2]).toLocaleString()}
              </p>
            </span>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount">{state.userInfo.totalATRI}</p>
          </span>

          <Divider className="divider-dg-top" />

          <span className="balances-button-span">
            <Button
              className="balances-play-button"
              href="https://wallet.matic.network/bridge/"
              target="_blank"
            >
              DEPOSIT
            </Button>

            <Button
              className="balances-play-button"
              href="https://wallet.matic.network/bridge/"
              target="_blank"
            >
              WITHDRAW
            </Button>
          </span>

        </div>

        <div className="balances-column-three" />*/}
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

    setEvent(type);
  }

  // handle Connext deposit/withdrawal events
  async function getWithdrawalTransaction(params) {
    console.log('Transaction hash: ' + params);

    setTxHash(params);
  }

  function getWithdrawalAmount(params) {
    console.log('Amount: ' + params);

    setAmount(params);
  }

  // top up user to 5000 play tokens
  async function topUp() {
    await Fetch.TOP_UP_USER(state.userAddress);

    // let responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
    // let json = await responseInfo.json();

    // let arrayInfo = state.userInfo;
    // arrayInfo[3] = json.callCount;

    // let objectInfo = state.userInfo;
    // objectInfo.count = json.callCount;

    // dispatch({
    //   type: 'user_info',
    //   data: objectInfo,
    // });

    // update global state user information
    const refresh = !state.updateInfo;

    dispatch({
      type: 'update_info',
      data: refresh,
    });
  }

  // initialize transak modal
  function show_transak_1() {
    transak_1.init();
  }

  function show_transak_2() {
    transak_2.init();
  }

  function show_transak_3() {
    transak_3.init();
  }

  function show_transak_4() {
    transak_4.init();
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentWearables() {
    return (
      <Grid style={{ marginBottom: '90px' }}>
        {wearables.map((wearable, i) => (
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="leaderboard-column"
            key={i}
          >
            <a href={wearable.permalink} className="my-nft-container">
              <div>
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src={wearable.image_url}
                    className="nft-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">{wearable.name}</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className="nfts-info">{wearable.asset_contract.name}</p>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />

                  <p
                    className="nft-other-p"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '15px',
                      textAlign: 'center',
                    }}
                  >
                    {wearable.description}
                  </p>

                  <span
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      color="blue"
                      className="nft-button"
                      target="_blank"
                      href={wearable.permalink}
                    >
                      SELL NFT
                    </Button>
                    <Button
                      className="nft-read-button"
                      target="_blank"
                      href={wearable.permalink}
                    >
                      READ MORE
                    </Button>
                  </span>
                </div>
              </div>
            </a>
          </Grid.Column>
        ))}
      </Grid>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentPoaps() {
    return (
      <Grid style={{ marginBottom: '90px', marginTop: '9px' }}>
        {poaps.map((poap, i) => (
          <Grid.Column computer={2} tablet={4} mobile={8} key={i}>
            <Image src={poap.image_url} className="poap-pic" />
          </Grid.Column>
        ))}
      </Grid>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentHistory() {
    return (
      <div style={{ paddingTop: '12px' }}>
        <div className="tx-box-overflow">
          <Table unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Action</Table.HeaderCell>
                <Table.HeaderCell className="account-col-2">
                  Amount
                </Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
                <Table.HeaderCell className="account-col-4">
                  Date
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            {props.dataPage === 'false'
              ? 'No data to display'
              : props.dataPage.map((row, i) => {
                  const date = new Date(row.createdAt);
                  const timestamp = date.toLocaleString();
                  const amount = row.amount;

                  let sign = '';
                  if (row.type.includes('Deposit')) {
                    sign = '+';
                  } else if (row.type.includes('Withdrawal')) {
                    sign = '-';
                  }

                  return (
                    <Table.Body key={i}>
                      <Table.Row>
                        <Table.Cell>
                          {row.type.includes('DAI') ? (
                            <img
                              src={Images.ICON_DAI}
                              style={{
                                width: '21px',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                marginTop: '-2px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : (
                            <img
                              src={Images.ICON_MANA}
                              style={{
                                width: '21px',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                marginTop: '-2px',
                                borderRadius: '100%',
                              }}
                            />
                          )}
                          {row.type}
                        </Table.Cell>
                        <Table.Cell className="account-col-2">
                          {row.type.includes('DAI') ? (
                            <span>
                              {sign}
                              {amount > 1000000000000000000000000
                                ? 'N/A'
                                : (amount / 1000000000000000000).toFixed(2) +
                                  ' DAI'}
                            </span>
                          ) : (
                            <span>
                              {amount > 1000000000000000000000000
                                ? 'N/A'
                                : (amount / 1000000000000000000).toFixed(2) +
                                  ' MANA'}
                            </span>
                          )}
                        </Table.Cell>
                        <Table.Cell>{row.status}</Table.Cell>
                        <Table.Cell className="account-col-4">
                          {timestamp}
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            style={{ float: 'right', paddingRight: '12px' }}
                          >
                            <Button
                              href={
                                Global.CONSTANTS.MATIC_EXPLORER +
                                `/tx/${row.txid}`
                              }
                              target="_blank"
                              className="etherscan-button"
                            >
                              blockchain tx
                              <Icon
                                name="external alternate"
                                style={{
                                  marginLeft: '6px',
                                  marginRight: '-2px',
                                }}
                              />
                            </Button>
                            <Button
                              href={
                                Global.CONSTANTS.MATIC_EXPLORER +
                                `/tx/${row.txid}`
                              }
                              target="_blank"
                              className="etherscan-button-mobile"
                            >
                              tx
                              <Icon
                                name="external alternate"
                                style={{
                                  marginLeft: '6px',
                                  marginRight: '-2px',
                                }}
                              />
                            </Button>
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
          </Table>
        </div>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGameplay() {
    return (
      <div style={{ paddingTop: '12px' }}>
        <div className="tx-box-overflow">
          <Table unstackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Game</Table.HeaderCell>
                <Table.HeaderCell className="account-col-2">
                  Bet
                </Table.HeaderCell>
                <Table.HeaderCell>Payout</Table.HeaderCell>
                <Table.HeaderCell className="account-col-4">
                  Date
                </Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>

            {props.dataPage === 'false'
              ? 'No data to display'
              : props.dataPage.map((row, i) => {
                  const date = new Date(row.createdAt);
                  const timestamp = date.toLocaleString();
                  const amount =
                    Number(row.betAmount) / Global.CONSTANTS.FACTOR;
                  const result =
                    Number(row.amountWin) / Global.CONSTANTS.FACTOR;

                  let action = '';
                  if (row.gameType === 1) {
                    action = 'Slots';
                  } else if (row.gameType === 8 || row.gameType === 2) {
                    action = 'Roulette';
                  } else if (row.gameType === 3) {
                    action = 'Backgammon';
                  } else if (row.gameType === 7 || row.gameType === 4) {
                    action = 'Blackjack';
                  }

                  return (
                    <Table.Body key={i}>
                      <Table.Row>
                        <Table.Cell>
                          {row.coinName === 'MANA' ? (
                            <img
                              src={Images.ICON_MANA}
                              style={{
                                width: '21px',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                marginTop: '-2px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : row.coinName === 'DAI' ? (
                            <img
                              src={Images.ICON_DAI}
                              style={{
                                width: '21px',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                marginTop: '-2px',
                                borderRadius: '100%',
                              }}
                            />
                          ) : (
                            <img
                              src={Images.ICON_PLAY}
                              style={{
                                width: '21px',
                                marginRight: '6px',
                                verticalAlign: 'middle',
                                marginTop: '-2px',
                                borderRadius: '100%',
                              }}
                            />
                          )}
                          {action}
                        </Table.Cell>
                        <Table.Cell className="account-col-2">
                          -{amount} {row.coinName}
                        </Table.Cell>
                        <Table.Cell>
                          +{result} {row.coinName}
                        </Table.Cell>
                        <Table.Cell className="account-col-4">
                          {timestamp}
                        </Table.Cell>
                        <Table.Cell>
                          <span
                            style={{ float: 'right', paddingRight: '12px' }}
                          >
                            {row.coinName === 'MANA' ? (
                              <Aux>
                                <Button
                                  href={
                                    Global.CONSTANTS.MATIC_EXPLORER +
                                    `/tx/${row.txid}`
                                  }
                                  target="_blank"
                                  className="etherscan-button"
                                >
                                  blockchain tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                                <Button
                                  href={
                                    Global.CONSTANTS.MATIC_EXPLORER +
                                    `/tx/${row.txid}`
                                  }
                                  target="_blank"
                                  className="etherscan-button-mobile"
                                >
                                  tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                              </Aux>
                            ) : row.coinName === 'DAI' ? (
                              <Aux>
                                <Button
                                  href={
                                    Global.CONSTANTS.MATIC_EXPLORER +
                                    `/tx/${row.txid}`
                                  }
                                  target="_blank"
                                  className="etherscan-button"
                                >
                                  blockchain tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                                <Button
                                  href={
                                    Global.CONSTANTS.MATIC_EXPLORER +
                                    `/tx/${row.txid}`
                                  }
                                  target="_blank"
                                  className="etherscan-button-mobile"
                                >
                                  tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                              </Aux>
                            ) : (
                              <Aux>
                                <Button
                                  disabled
                                  className="etherscan-button"
                                  style={{ padding: '2px 0px 0px 0px' }}
                                >
                                  blockchain tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                                <Button
                                  disabled
                                  href={
                                    Global.CONSTANTS.MATIC_EXPLORER +
                                    `/tx/${row.txid}`
                                  }
                                  target="_blank"
                                  className="etherscan-button-mobile"
                                >
                                  tx
                                  <Icon
                                    name="external alternate"
                                    style={{
                                      marginLeft: '6px',
                                      marginRight: '-2px',
                                    }}
                                  />
                                </Button>
                              </Aux>
                            )}
                          </span>
                        </Table.Cell>
                      </Table.Row>
                    </Table.Body>
                  );
                })}
          </Table>
        </div>
      </div>
    );
  }

  if (props.content === 'balances') {
    return contentAccount();
  } else if (props.content === 'wearables') {
    return contentWearables();
  } else if (props.content === 'poaps') {
    return contentPoaps();
  } else if (props.content === 'history') {
    return contentHistory();
  } else if (props.content === 'play') {
    return contentGameplay();
  }
};

export default ContentAccount;
