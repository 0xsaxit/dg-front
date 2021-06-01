import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store/index';
import { ConnextModal } from '@connext/vector-modal';
import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk';
import { Button, Divider, Grid, Icon, Image, Table } from 'semantic-ui-react';
import Global from 'components/Constants';
import Images from 'common/Images';
import ModalAcceptMana from 'components/modal/ModalAcceptMana';
import ModalAcceptDai from 'components/modal/ModalAcceptDai';
import ModalAcceptUSDT from 'components/modal/ModalAcceptUSDT';
import ModalAcceptATRI from 'components/modal/ModalAcceptATRI';
import ModalAcceptWETH from 'components/modal/ModalAcceptWETH';
import Referrals from './Referrals';
import styles from './ContentAccount.module.scss';
import Aux from 'components/_Aux';

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

  const injectedProvider = window.ethereum;
  const buttonPlay = document.getElementById('play-now-button-balances');
  const ramp2 = new RampInstantSDK({
    hostAppName: 'Buy DAI Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335593/COIN_-_DAI_kbvlhx.png',
    swapAsset: 'MATIC_DAI',
  });
  const ramp3 = new RampInstantSDK({
    hostAppName: 'Buy USDT Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335593/COIN_-_USDT_kb1sem.png',
    swapAsset: 'USDT',
  });
  const ramp5 = new RampInstantSDK({
    hostAppName: 'Buy ETH Directly',
    hostLogoUrl:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1618335594/COIN_-_ETH_ji9yyj.png',
    swapAsset: 'ETH',
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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
  function contentAccount() {
    return (
      <div className="balances-container">
        <div className="balances-column one">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.PLAY_CIRCLE} className="farming-logo-small" />
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

          <Divider className="divider-dg-top" />

          <span className="balances-button-span">
            <Button
              id="play-now-button-balances"
              className="balances-play-button"
              href="https://play.decentraland.org/?position=-96%2C110"
              target="_blank"
            >
              Play Now
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
                Top Up
              </Button>
            )}
          </span>
        </div>

        <div className="balances-column two">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.MANA_CIRCLE} className="farming-logo-small" />
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
              href="https://www.binance.com/en/trade/MANA_ETH"
              target="_blank"
              style={{ marginTop: '-60px', padding: '7px 0 0 0' }}
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
                className="balances-play-button"
                onClick={() => setStateAndEvent(2, true, 'MANA Withdrawal')}
                style={{ padding: '0 0 0 0' }}
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
            <ModalAcceptMana />
          )}
        </div>

        <div className="balances-column three">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.DAI_CIRCLE} className="farming-logo-small" />
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
              onClick={() => ramp2.show()}
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
                Deposit
              </Button>

              <ConnextModal
                showModal={showModal_3}
                onClose={() => setStateAndEvent(3, false, 'DAI Deposit')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
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
                Withdraw
              </Button>

              <ConnextModal
                showModal={showModal_4}
                onClose={() => setStateAndEvent(4, false, 'DAI Withdrawal')}
                onReady={(params) =>
                  console.log('MODAL IS READY =======>', params)
                }
                withdrawalAddress={state.userAddress}
                routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
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

        <div className="balances-column one">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.USDT_CIRCLE} className="farming-logo-small" />
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
                {parseInt(
                  state.userBalances[2][1] * 1000000000000
                ).toLocaleString()}
              </p>
            </span>
          </span>

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className="balances-top-button"
              onClick={() => ramp3.show()}
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

          {state.userInfo.tokenArray[2] ? (
            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                onClick={() => setStateAndEvent(5, true, 'USDT Deposit')}
                style={{ padding: '0 0 0 0' }}
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
                className="balances-play-button"
                onClick={() => setStateAndEvent(6, true, 'USDT Withdrawal')}
                style={{ padding: '0 0 0 0' }}
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
        </div>

        <div className="balances-column two">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.ATRI_CIRCLE} className="farming-logo-small" />
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

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              href="https://www.ataritokens.com/myportal/home"
              target="_blank"
              className="balances-top-button"
              style={{ marginTop: '-60px', padding: '7px 0 0 0' }}
            >
              BUY
            </Button>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount">{state.userInfo.totalATRI}</p>
          </span>

          <Divider className="divider-dg-top" />

          {state.userInfo.tokenArray[3] ? (
            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Deposit
              </Button>

              <Button
                className="balances-play-button"
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Withdraw
              </Button>
            </span>
          ) : (
            <ModalAcceptATRI />
          )}
        </div>

        <div className="balances-column three">
          <span style={{ display: 'flex' }}>
            <span className="avatar-picture">
              <img src={Images.ETH_CIRCLE} className="farming-logo-small" />
            </span>
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginTop: '7px',
              }}
            >
              <p className="welcome-text-top">ETH</p>
              <p className="earned-amount">{state.userBalances[2][3]}</p>
            </span>
          </span>

          <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              className="balances-top-button"
              onClick={() => ramp5.show()}
              style={{ marginTop: '-60px' }}
            >
              BUY
            </Button>
          </span>

          <Divider className="divider-dg-top" />

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p className="earned-text">Total Winnings</p>
            <p className="earned-amount">{state.userInfo.totalWETH}</p>
          </span>

          <Divider className="divider-dg-top" />

          {state.userInfo.tokenArray[4] ? (
            <span className="balances-button-span">
              <Button
                className="balances-play-button"
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Deposit
              </Button>

              <Button
                className="balances-play-button"
                href="https://wallet.matic.network/bridge/"
                target="_blank"
              >
                Withdraw
              </Button>
            </span>
          ) : (
            <ModalAcceptWETH />
          )}
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

    const refresh = !state.updateInfo;

    dispatch({
      type: 'update_info',
      data: refresh,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentWearables() {
    if (state.wearables.length !== 0) {
      return (
        <Grid style={{ marginBottom: '90px' }}>
          {state.wearables.map((wearable, i) => (
            <Grid.Column
              computer={5}
              tablet={8}
              mobile={16}
              className="leaderboard-column"
              key={i}
            >
              <a href={wearable.permalink} className="my-nft-container">
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
              </a>
            </Grid.Column>
          ))}
        </Grid>
      );
    } else {
      return (
        <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
          <p className={styles.referrals_header_subtitle}>
            You do not own any wearable NFTs
          </p>
        </div>
      );
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentPoaps() {
    if (state.poaps.length !== 0) {
      return (
        <Grid style={{ marginBottom: '90px', marginTop: '9px' }}>
          {state.poaps.map((poap, i) => (
            <Grid.Column computer={2} tablet={4} mobile={8} key={i}>
              <Image src={poap.image_url} className="poap-pic" />
            </Grid.Column>
          ))}
        </Grid>
      );
    } else {
      return (
        <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
          <p className={styles.referrals_header_subtitle}>
            You do not own any POAPS
          </p>
        </div>
      );
    }
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

                  let style = '';
                  {
                    i % 2 === 0 ? (style = '#15181c') : (style = 'black');
                  }

                  return (
                    <Table.Body key={i}>
                      {renderRowHistory(row, timestamp, amount, sign, style)}
                    </Table.Body>
                  );
                })}
          </Table>
        </div>
      </div>
    );
  }

  function renderRowHistory(row, timestamp, amount, sign, style) {
    return (
      <Table.Row style={{ background: style }}>
        <Table.Cell>
          {row.type.includes('DAI') ? (
            <img
              src={Images.DAI_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.type.includes('MANA') ? (
            <img
              src={Images.MANA_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.type.includes('USDT') ? (
            <img
              src={Images.USDT_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.type.includes('ATRI') ? (
            <img
              src={Images.ATRI_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.type.includes('WETH') ? (
            <img
              src={Images.ETH_CIRCLE}
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
              src={Images.DG_COIN_LOGO}
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
                : (amount / Global.CONSTANTS.FACTOR).toFixed(2) + ' DAI'}
            </span>
          ) : (
            <span>
              {amount > 1000000000000000000000000
                ? 'N/A'
                : (amount / Global.CONSTANTS.FACTOR).toFixed(2) + ' MANA'}
            </span>
          )}
        </Table.Cell>
        <Table.Cell>{row.status}</Table.Cell>
        <Table.Cell className="account-col-4">{timestamp}</Table.Cell>
        <Table.Cell>
          <span style={{ float: 'right', paddingRight: '12px' }}>
            <Button
              href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
              target="_blank"
              className="etherscan-button"
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

                  let style = '';
                  {
                    i % 2 === 0 ? (style = '#15181c') : (style = 'black');
                  }

                  return (
                    <Table.Body key={i}>
                      {renderRowPlay(
                        row,
                        timestamp,
                        amount,
                        result,
                        action,
                        style
                      )}
                    </Table.Body>
                  );
                })}
          </Table>
        </div>
      </div>
    );
  }

  function renderRowPlay(row, timestamp, amount, result, action, style) {
    return (
      <Table.Row style={{ background: style }}>
        <Table.Cell>
          {row.coinName === 'DAI' ? (
            <img
              src={Images.DAI_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.coinName === 'MANA' ? (
            <img
              src={Images.MANA_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.coinName === 'USDT' ? (
            <img
              src={Images.USDT_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.coinName === 'ATRI' ? (
            <img
              src={Images.ATRI_CIRCLE}
              style={{
                width: '21px',
                marginRight: '6px',
                verticalAlign: 'middle',
                marginTop: '-2px',
                borderRadius: '100%',
              }}
            />
          ) : row.coinName === 'WETH' ? (
            <img
              src={Images.ETH_CIRCLE}
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
              src={Images.PLAY_CIRCLE}
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
        <Table.Cell className="account-col-4">{timestamp}</Table.Cell>
        <Table.Cell>
          <span style={{ float: 'right' }}>
            {row.coinName !== 'PLAY' ? (
              <Aux>
                <Button
                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`}
                  target="_blank"
                  className="etherscan-button"
                  style={{ marginRight: '12px' }}
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
                  style={{ marginRight: '12px', padding: '2px 0px 0px 0px' }}
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

            {row.coinName !== 'PLAY' ? (
              <Aux>
                <Button
                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`}
                  target="_blank"
                  className="etherscan-button-ptxid"
                  style={{ marginRight: '12px' }}
                >
                  payout tx
                  <Icon
                    name="external alternate"
                    style={{
                      marginLeft: '6px',
                      marginRight: '-2px',
                    }}
                  />
                </Button>
                <Button
                  href={Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.ptxid}`}
                  target="_blank"
                  className="etherscan-button-mobile"
                  style={{ marginRight: '12px' }}
                >
                  p tx
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
                  className="etherscan-button-ptxid"
                  style={{ padding: '2px 0px 0px 0px', marginRight: '12px' }}
                >
                  payout tx
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
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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
  } else if (props.content === 'referrals') {
    return <Referrals state={state} />;
  }
};

export default ContentAccount;
