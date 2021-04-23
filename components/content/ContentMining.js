import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon } from 'semantic-ui-react';
import MetaTx from '../../common/MetaTx';
import Transactions from '../../common/Transactions';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Global from '../Constants';

const ContentMining = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContract, setPointerContract] = useState({});
  const [gameplayUSD, setGameplayUSD] = useState(0);
  const [web3, setWeb3] = useState({});
  const [utm, setUtm] = useState('');

  let buttonMANA = '';
  let buttonDAI = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  useEffect(() => {
    buttonMANA = document.getElementById('play-now-button-MANA');
    buttonDAI = document.getElementById('play-now-button-DAI');
  }, []);

  useEffect(() => {
    if (buttonMANA || buttonDAI) {
      analytics.trackLink(buttonMANA, 'Clicked PLAY NOW (mining MANA)');
      analytics.trackLink(buttonDAI, 'Clicked PLAY NOW (mining DAI)');
    }
  }, [buttonMANA, buttonDAI]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      async function fetchData() {
        const pointerContract = await Transactions.pointerContract(getWeb3);
        setPointerContract(pointerContract);
      }

      fetchData();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Gameplay Rewards');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_MINING_DG) {
      const gameplayUSD = props.price * state.DGBalances.BALANCE_MINING_DG;
      const gameplayUSDFormatted = props.formatPrice(gameplayUSD, 2);

      setGameplayUSD(gameplayUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_MINING_DG]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction. Dispatch DG tokens to player
  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + state.userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContract.methods.getMyTokens().encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        2,
        functionSignature,
        pointerContract,
        state.userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state BPT balances
        const refresh = !state.refreshBalances;

        dispatch({
          type: 'refresh_balances',
          data: refresh,
        });
      }
    } catch (error) {
      console.log('Biconomy meta-transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMining() {
    return (
      <Aux>
        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed" style={{ maxHeight: '100%' }}>
            <p className="earned-amount" style={{ paddingTop: '2px' }}>Unclaimed</p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">$DG Balance</p>
                {state.DGBalances.BALANCE_MINING_DG ? (
                  <p className="earned-amount">
                    {props.formatPrice(state.DGBalances.BALANCE_MINING_DG, 3)}
                  </p>
                ) : (
                  <Loader
                    active
                    inline
                    size="small"
                    style={{
                      fontSize: '12px',
                      marginTop: '5px',
                      marginLeft: '-1px',
                      marginBottom: '-2px',
                    }}
                  />
                )}
              </span>
            </span>

            <Divider className="divider-dg-top"/>

            <span style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '3px' }}>
              <p className="welcome-text" style={{ paddingLeft: '0px' }}> TOTAL USD </p>
              <p className="earned-amount"> ${gameplayUSD} </p>
            </span>

            <Divider className="divider-dg-top"/>

            <p style={{ fontSize: '18px' }}>
              Mine $DG by playing games with MANA or DAI. Earn bonuses by
              playing with friends, wearing $DG NFTs, and referring
              friends. {' '}
              <a
                href="https://decentral-games-1.gitbook.io/dg/allocation"
                target="_blank"
                style={{ color: '#2085f4' }}
              >
                Read more
              </a>
              .
            </p>

            <Divider className="divider-dg-top"/>

            <span className="DG-button-span">
              {Number(state.DGBalances.BALANCE_MINING_DG) ? (
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => metaTransaction()}
                >
                  Claim
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className="mining-container-outter">
            <div className="mining-container-inner">
              <div
                className="DG-column-treasury two"
                style={{
                  position: 'relative',
                  height: '100%',
                }}
              >
              <p className="earned-amount" style={{ paddingTop: '2px' }}>Gameplay Rewards</p>

              <Divider className="divider-dg-top" />

              <span style={{ display: 'flex' }}>
                <img
                  src={Images.MANA_CIRCLE}
                  className="farming-logo-small"
                  alt="MANA Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text-top">Coin</p>
                    <p className="earned-amount">
                      MANA
                    </p>
                  </span>
                </span>

                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                    style={{ marginTop: '-60px', marginRight: '-4px' }}
                  >
                    <Icon
                      className="more-text"
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className="divider-dg-top" />

                <div style={{ display: 'flex' }}>
                  <span className="gameplay-left-column">
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Roulette Rate / 1 DG</p>
                      <p className="earned-amount stat">28,000</p>
                    </span>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '50%',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Blackjack Rate / 1 DG</p>
                      <p className="earned-amount stat">95,000</p>
                    </span>
                  </span>
                </div>

                <Divider className="divider-dg-top" />

                <span className="DG-button-span">
                  <Button
                    id="play-now-button-MANA"
                    href={`https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber${utm}`}
                    className="DG-play-now-button"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>

              <div
                className="DG-column-treasury three"
                style={{
                  position: 'relative',
                  height: '100%',
                }}
              >
              <p className="earned-amount" style={{ paddingTop: '2px' }}>Gameplay Rewards</p>

              <Divider className="divider-dg-top" />

              <span style={{ display: 'flex' }}>
                <span style={{ display: 'flex' }}>
                  <img src={Images.DAI_CIRCLE} className="farming-logo-small" />
                  <img
                    src={Images.USDT_CIRCLE}
                    className="farming-logo-small two"
                    alt="Decentral Games Coin Logo"
                  />
                </span>
                <span className="farming-pool-span">
                  <p className="welcome-text-top">Coins</p>
                    <p className="earned-amount">
                      DAI, USDT
                    </p>
                  </span>
                </span>

                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                    style={{ marginTop: '-60px', marginRight: '-4px' }}
                  >
                    <Icon
                      className="more-text"
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className="divider-dg-top" />

                <div style={{ display: 'flex' }}>
                  <span className="gameplay-left-column">
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Roulette Rate / 1 DG</p>
                      <p className="earned-amount stat">36,000</p>
                    </span>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '50%',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Blackjack Rate / 1 DG</p>
                      <p className="earned-amount stat">121,000</p>
                    </span>
                  </span>
                </div>

                <Divider className="divider-dg-top" />

                <span className="DG-button-span">
                  <Button
                    id="play-now-button-MANA"
                    href={`https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber${utm}`}
                    className="DG-play-now-button"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>
            </div>


             <div className="mining-container-inner">
              <div
                className="DG-column-treasury two"
                style={{
                  position: 'relative',
                  height: '100%',
                }}
              >
              <p className="earned-amount" style={{ paddingTop: '2px' }}>Gameplay Rewards</p>

              <Divider className="divider-dg-top" />

              <span style={{ display: 'flex' }}>
                <img
                  src={Images.ATRI_CIRCLE}
                  className="farming-logo-small"
                  alt="MANA Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text-top">Coin</p>
                    <p className="earned-amount">
                      ATRI
                    </p>
                  </span>
                </span>

                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                    style={{ marginTop: '-60px', marginRight: '-4px' }}
                  >
                    <Icon
                      className="more-text"
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className="divider-dg-top" />

                <div style={{ display: 'flex' }}>
                  <span className="gameplay-left-column">
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Roulette Rate / 1 DG</p>
                      <p className="earned-amount stat">N/A</p>
                    </span>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '50%',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Blackjack Rate / 1 DG</p>
                      <p className="earned-amount stat">N/A</p>
                    </span>
                  </span>
                </div>

                <Divider className="divider-dg-top" />

                <span className="DG-button-span">
                  <Button
                    id="play-now-button-MANA"
                    href={`https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber${utm}`}
                    className="DG-play-now-button"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>

              <div
                className="DG-column-treasury three"
                style={{
                  position: 'relative',
                  height: '100%',
                }}
              >
              <p className="earned-amount" style={{ paddingTop: '2px' }}>Gameplay Rewards</p>

              <Divider className="divider-dg-top" />

              <span style={{ display: 'flex' }}>
                <img
                  src={Images.ETH_CIRCLE}
                  className="farming-logo-small"
                  alt="MANA Coin Logo"
                />
                <span className="farming-pool-span">
                  <p className="welcome-text-top">Coin</p>
                    <p className="earned-amount">
                      ETH
                    </p>
                  </span>
                </span>

                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <a
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                    style={{ marginTop: '-60px', marginRight: '-4px' }}
                  >
                    <Icon
                      className="more-text"
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className="divider-dg-top" />

                <div style={{ display: 'flex' }}>
                  <span className="gameplay-left-column">
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Roulette Rate / 1 DG</p>
                      <p className="earned-amount stat">N/A</p>
                    </span>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '50%',
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      <p className="earned-text">Blackjack Rate / 1 DG</p>
                      <p className="earned-amount stat">N/A</p>
                    </span>
                  </span>
                </div>

                <Divider className="divider-dg-top" />

                <span className="DG-button-span">
                  <Button
                    id="play-now-button-MANA"
                    href={`https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber${utm}`}
                    className="DG-play-now-button"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>
            </div>

          </div>
        </div>
      </Aux>
    );
  }

  return contentMining();
};

export default ContentMining;