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
import Aux from '../_Aux';

let transak_1 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  defaultCryptoCurrency: 'MANA',
  cryptoCurrencyList: 'MANA',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Matic MANA directly',
});

let transak_2 = new transakSDK({
  apiKey: Global.KEYS.TRANSAK_API, // API Key
  environment: 'PRODUCTION', // STAGING/PRODUCTION
  walletAddress: '', // customer wallet address
  themeColor: '#2085f4', // theme color
  fiatCurrency: '', // INR/GBP
  email: '', // customer email address
  redirectURL: '',
  defaultNetwork: 'matic',
  defaultCryptoCurrency: 'DAI',
  cryptoCurrencyList: 'DAI',
  hostURL: Global.CONSTANTS.BASE_URL,
  widgetHeight: '633px',
  widgetWidth: '100%',
  exchangeScreenTitle: 'Buy Matic DAI directly',
});

const ContentAccount = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [totalDAI, setTotalDAI] = useState(0);
  const [totalMANA, setTotalMANA] = useState(0);
  const [totalPLAY, setTotalPLAY] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModal_2, setShowModal_2] = useState(false);
  const [showModal_3, setShowModal_3] = useState(false);
  const [showModal_4, setShowModal_4] = useState(false);
  const [wearables, setWearables] = useState([]);
  const [poaps, setPoaps] = useState([]);

  const injectedProvider = window.ethereum;
  const buttonPlay = document.getElementById('play-now-button-balances');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user nfts statistics
  useEffect(() => {
    (async function () {
      let response = await Fetch.NFTS_1(state.userAddress);
      let json = await response.json();

      let response_2 = await Fetch.NFTS_2(state.userAddress);
      let json_2 = await response_2.json();

      let wearables = [];
      let i;
      let j;

      for (i = 0; i < json.assets.length; i++) {
        wearables.push(json.assets[i]);
      }

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

  // fetch total bet from API
  useEffect(() => {
    (async function () {
      const response = await Fetch.PLAYER_DATA(state.userAddress);
      const json = await response.json();

      setTotalDAI(
        (json.DAI.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
      );
      setTotalMANA(
        (json.MANA.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
      );
      setTotalPLAY(
        (json.PLAY.payout_player / Global.CONSTANTS.FACTOR).toLocaleString()
      );
    })();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle Transak events
  useEffect(() => {
    // get all the events
    transak_1.on(transak_1.ALL_EVENTS, (data) => {
      console.log('Transak events 1: ' + data);
    });
    transak_2.on(transak_2.ALL_EVENTS, (data) => {
      console.log('Transak events 2: ' + data);
    });

    // triggers when the user closes the widget
    transak_1.on(transak_1.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_1.close();
    });
    transak_2.on(transak_2.EVENTS.TRANSAK_WIDGET_CLOSE, (orderData) => {
      transak_2.close();
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
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAccount() {
    return (
      <Grid className="balances-container">
        <Grid.Row>
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column one"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.PLAY_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Play</p>
                <p className="account-name">{state.userInfo[2]}</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled
                className="balances-top-button"
                target="_blank"
                style={{ marginTop: '-75px' }}
              >
                FREE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount"> {totalPLAY} </p>
            </span>

            <Divider />

            <span className="balances-button-span">
              <Button
                id="play-now-button-balances"
                className="balances-play-button"
                href="https://play.decentraland.org/?position=-120%2C135&realm=hades-amber"
                target="_blank"
              >
                PLAY NOW
              </Button>
              {state.userInfo[3] === 2 ? (
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
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column two"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.MANA_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Mana</p>
                <p className="account-name">
                  {parseInt(state.userBalances[1][1]).toLocaleString()}
                </p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                className="balances-top-button"
                onClick={() => show_transak_1()}
                style={{ marginTop: '-75px' }}
              >
                PURCHASE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount">{totalMANA}</p>
            </span>

            <Divider />

            {state.userStatus === 7 || state.userStatus === 8 ? (
              <span className="balances-button-span">
                <Button
                  className="balances-play-button"
                  disabled={!injectedProvider}
                  onClick={() => setShowModal(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  DEPOSIT
                </Button>
                <ConnextModal
                  showModal={showModal}
                  onClose={() => setShowModal(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  depositAssetId={'0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'}
                  depositChainId={1}
                  depositChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  withdrawAssetId={'0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'}
                  withdrawChainId={137}
                  withdrawChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}
                />
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_2(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  WITHDRAW
                </Button>
                <ConnextModal
                  showModal={showModal_2}
                  onClose={() => setShowModal_2(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  withdrawAssetId={'0x0F5D2fB29fb7d3CFeE444a200298f468908cC942'}
                  withdrawChainId={1}
                  withdrawChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  depositAssetId={'0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'}
                  depositChainId={137}
                  depositChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}
                />
              </span>
            ) : (
              <ModalAcceptMana />
            )}
          </Grid.Column>

          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="balances-column three"
          >
            <span style={{ display: 'flex' }}>
              <span className="avatar-picture">
                <img
                  src={Images.DAI_CIRCLE}
                  style={{
                    width: '60px',
                    display: 'flex',
                    paddingTop: '12px',
                    paddingBottom: '9px',
                  }}
                />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginTop: '7px',
                }}
              >
                <p className="welcome-text">Dai</p>
                <p className="account-name">
                  {parseInt(state.userBalances[0][1]).toLocaleString()}
                </p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                className="balances-top-button two"
                onClick={() => show_transak_2()}
                style={{ marginTop: '-75px' }}
              >
                PURCHASE
              </Button>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text">Total Winnings</p>
              <p className="earned-amount">{totalDAI}</p>
            </span>

            <Divider />

            {state.userStatus === 6 || state.userStatus === 8 ? (
              <span className="balances-button-span">
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_3(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  DEPOSIT
                </Button>
                <ConnextModal
                  showModal={showModal_3}
                  onClose={() => setShowModal_3(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  depositAssetId={'0x6B175474E89094C44Da98b954EedeAC495271d0F'}
                  depositChainId={1}
                  depositChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  withdrawAssetId={'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'}
                  withdrawChainId={137}
                  withdrawChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}
                />
                <Button
                  className="balances-play-button"
                  onClick={() => setShowModal_4(true)}
                  style={{ padding: '0 0 0 0' }}
                >
                  WITHDRAW
                </Button>
                <ConnextModal
                  showModal={showModal_4}
                  onClose={() => setShowModal_4(false)}
                  onReady={(params) =>
                    console.log('MODAL IS READY =======>', params)
                  }
                  withdrawalAddress={state.userAddress}
                  routerPublicIdentifier="vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np"
                  withdrawAssetId={'0x6B175474E89094C44Da98b954EedeAC495271d0F'}
                  withdrawChainId={1}
                  withdrawChainProvider="https://mainnet.infura.io/v3/e4f516197160473789e87e73f59d65b6"
                  depositAssetId={'0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'}
                  depositChainId={137}
                  depositChainProvider="https://rpc-mainnet.matic.network"
                  injectedProvider={injectedProvider}
                  loginProvider={injectedProvider}
                />
              </span>
            ) : (
              <ModalAcceptDai />
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  // top up user to 5000 play tokens
  async function topUp() {
    await Fetch.TOP_UP_USER(state.userAddress);

    let responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
    let json = await responseInfo.json();

    let arrayInfo = state.userInfo;
    arrayInfo[3] = json.callCount;

    dispatch({
      type: 'user_info',
      data: arrayInfo,
    });
  }

  // initialize transak modal
  function show_transak_1() {
    transak_1.init();
  }

  function show_transak_2() {
    transak_2.init();
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
          <Grid.Column computer={4} tablet={8} mobile={8} key={i}>
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
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Action</Table.HeaderCell>
            <Table.HeaderCell className="account-col-2">
              Amount
            </Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
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
              if (row.type === 'Deposit') {
                sign = '+';
              } else if (row.type === 'Withdraw') {
                sign = '-';
              }

              return (
                <Table.Body key={i}>
                  <Table.Row>
                    <Table.Cell>
                      {row.coinName === 'MANA' ? (
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
                    <Table.Cell>
                      {sign}
                      {amount > 1000000000000000000000000
                        ? 'N/A'
                        : amount + ' MANA'}
                    </Table.Cell>
                    <Table.Cell>{row.status}</Table.Cell>
                    <Table.Cell>{timestamp}</Table.Cell>
                    <Table.Cell>
                      <span style={{ float: 'right', paddingRight: '12px' }}>
                        <Button
                          href={
                            Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`
                          }
                          target="_blank"
                          className="etherscan-button"
                        >
                          blockchain tx
                          <Icon
                            name="external alternate"
                            style={{ marginLeft: '6px', marginRight: '-2px' }}
                          />
                        </Button>
                        <Button
                          href={
                            Global.CONSTANTS.MATIC_EXPLORER + `/tx/${row.txid}`
                          }
                          target="_blank"
                          className="etherscan-button-mobile"
                        >
                          tx
                          <Icon
                            name="external alternate"
                            style={{ marginLeft: '6px', marginRight: '-2px' }}
                          />
                        </Button>
                      </span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              );
            })}
      </Table>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGameplay() {
    return (
      <Table unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Game</Table.HeaderCell>
            <Table.HeaderCell>Bet</Table.HeaderCell>
            <Table.HeaderCell>Payout</Table.HeaderCell>
            <Table.HeaderCell>Date</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        {props.dataPage === 'false'
          ? 'No data to display'
          : props.dataPage.map((row, i) => {
              const date = new Date(row.createdAt);
              const timestamp = date.toLocaleString();
              const amount = Number(row.betAmount) / Global.CONSTANTS.FACTOR;
              const result = Number(row.amountWin) / Global.CONSTANTS.FACTOR;

              let action = '';
              if (row.gameType === 1) {
                action = 'Slots';
              } else if (row.gameType === 2) {
                action = 'Roulette';
              } else if (row.gameType === 3) {
                action = 'Backgammon';
              } else if (row.gameType === 4) {
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
                    <Table.Cell>
                      -{amount} {row.coinName}
                    </Table.Cell>
                    <Table.Cell>
                      +{result} {row.coinName}
                    </Table.Cell>
                    <Table.Cell>{timestamp}</Table.Cell>
                    <Table.Cell>
                      <span style={{ float: 'right', paddingRight: '12px' }}>
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
