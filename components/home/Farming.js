import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Divider } from 'semantic-ui-react';
import Aux from '../_Aux';
import Spinner from '../Spinner';
import ButtonAffiliates from '../button/ButtonAffiliates';
import ABI_DG_POINTER from '../ABI/ABIDGPointer';
import Global from '../Constants';
import Images from '../../common/Images';
import MetaTx from '../../common/MetaTx';

const Farming = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGstate, setDGState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [getTokens, setGetTokens] = useState(false);

  let userAddress = '';
  let pointerContract = {};
  let web3 = {};

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // initialize Web3 providers and create token contract instance
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      // pointerContract = Global.getDGPointerContract(getWeb3);

      (async function () {
        const addresses = await Global.API_ADDRESSES;

        pointerContract = new getWeb3.eth.Contract(
          ABI_DG_POINTER,
          addresses.DG_POINTER_ADDRESS
        );
      })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });

      if (getTokens) metaTransaction();
    }
  }, [state.userStatus, getTokens]);

  // dispatch DG tokens to user
  // function claimDG() {
  //   console.log('Dispatching DG tokens to user: ' + userAddress);
  //   Global.FETCH.GET_TOKENS(userAddress);

  //   setGetTokens(false);
  // }

  // Biconomy API meta-transaction. Dispatch DG tokens to player
  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContract.methods.getMyTokens().encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        0,
        functionSignature,
        '',
        pointerContract,
        userAddress,
        web3
      );

      if (txHash == false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        dispatchActiveStatus(txHash);
      }
    } catch (error) {
      console.log(error);
    }

    setGetTokens(false);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function gameplayFarming() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Gameplay Mining</h3>
              <p>
                You can mine $DG by playing games with $MANA or $DAI. Earn multipliers
                by playing with friends or wearing Decentral Games
                NFTs. Refer any friends and get an additional 20% of all $DG they mine. For more
                details, see our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/allocation"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>


        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGPoints}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGPoints) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => setGetTokens(true)}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <div className="DG-column one">
            <span style={{ display: 'flex' }}>
              <img src={Images.MANA_CIRCLE} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Coin </p>
                <p className="account-name">MANA</p>
              </span>
            </span>

            <Divider />

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text"> Total Bet </p>
                  <p className="earned-amount"> ... </p>
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
                  <p className="earned-text"> Mining Rate </p>
                  <p className="earned-amount"> ... </p>
                </span>
              </span>
            </div>

            <Divider />

            <span className="DG-button-span">
              <Button
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                className="DG-play-now-button"
              >
                PLAY NOW
              </Button>
            </span>
          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <img src={Images.DAI_CIRCLE} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Coin </p>
                <p className="account-name">DAI</p>
              </span>
            </span>

            <Divider />

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text"> Total Bet </p>
                  <p className="earned-amount"> ... </p>
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
                  <p className="earned-text"> Mining Rate </p>
                  <p className="earned-amount"> ... </p>
                </span>
              </span>
            </div>

            <Divider />

            <span className="DG-button-span">
              <Button
                href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                className="DG-play-now-button"
              >
                PLAY NOW
              </Button>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function liquidityFarming() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Liquidity Farming</h3>
              <p>
                You can farm $DG by providing liquidity in 98/2 MANA/DG and
                DAI/DG Balancer pools and staking the LP tokens on this
                dashboard. Read more about $DG liquidity farming rewards in our
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGPoints}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGPoints) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => setGetTokens(true)}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <div className="DG-column one"
               style={{ position: 'relative', height: '100%' }}>
            <span style={{ display: 'flex' }}>
              <img src={Images.MANA_CIRCLE} className="farming-logo" />
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> MANA-DG </p>
                <p className="account-name">0</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled
                className="balancer-top-button"
                target="_blank"
                style={{ marginTop: '-75px' }}
              >
                Go To Pool
              </Button>
            </span>

            <Divider />

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text"> % of pool </p>
                  <p className="earned-amount"> ... </p>
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
                  <p className="earned-text"> pool rate </p>
                  <p className="earned-amount"> ... </p>
                </span>
              </span>
            </div>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-stake-button">
                STAKE LP
              </Button>
              <Button disabled className="DG-stake-button">
                UNSTAKE LP
              </Button>
            </span>
          </div>

          <div className="DG-column two"
            style={{ position: 'relative', height: '100%' }}>
            <span style={{ display: 'flex' }}>
              <img src={Images.DAI_CIRCLE} className="farming-logo" />
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> DAI-DG </p>
                <p className="account-name">0</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                disabled
                className="balancer-top-button"
                target="_blank"
                style={{ marginTop: '-75px' }}
              >
                Go To Pool
              </Button>
            </span>

            <Divider />

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text"> % of pool </p>
                  <p className="earned-amount"> ... </p>
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
                  <p className="earned-text"> pool rate </p>
                  <p className="earned-amount"> ... </p>
                </span>
              </span>
            </div>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-stake-button">
                STAKE LP
              </Button>
              <Button disabled className="DG-stake-button">
                UNSTAKE LP
              </Button>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function Governance() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">Decentral Games Governance</h3>
              <p>
                Staked $DG tokens are used to vote in decentral.games governance
                and to receive $DG governance rewards. Proposals can be
                submitted and voted on{' '}
                <a href="" style={{ color: '#2085f4' }}>
                  {' '}
                  here
                </a>
                . Read more about decentral.games governance in our{' '}
                <a
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  style={{ color: '#2085f4' }}
                >
                  docs
                </a>
                .
              </p>
            </span>
          </div>
        </div>

        <div className="DG-liquidity-container gov">
          <div
            className="DG-column unclaimed"
            style={{ position: 'relative', height: '100%' }}
          >
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed</p>
                <p className="account-name">{state.DGPoints}</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              {Number(state.DGPoints) ? (
                <Button
                  className="DG-claim-button"
                  onClick={() => setGetTokens(true)}
                >
                  CLAIM $DG
                </Button>
              ) : (
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              )}
            </span>
          </div>

          <div className="DG-column stake">
            <span style={{ display: 'flex' }}>
              <img src={Images.DG_COIN_LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Staked DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text"> % of gov pool </p>
                  <p className="earned-amount"> ... </p>
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
                  <p className="earned-text"> Treasury </p>
                  <p className="earned-amount"> ... </p>
                </span>
              </span>
            </div>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-stake-button">
                STAKE $DG
              </Button>
              <Button disabled className="DG-stake-button">
                UNSTAKE $DG
              </Button>
            </span>
          </div>

          <div
            className="DG-column stake"
            style={{ position: 'relative', height: '100%' }}
          >
            <span style={{ display: 'flex' }}>
              <img src={Images.SNAPSHOT_ICON} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Proposals</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-stake-button">
                DISCUSSION
              </Button>
              <Button disabled className="DG-stake-button">
                VOTING
              </Button>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        {(() => {
          if (DGstate == 0)
            return (
              <div>
                <span className="dg-tabs-desktop">
                  <p className="account-other-p">
                    <b className="account-hover active">GAMEPLAY MINING</b>{' '}
                    <abbr className="account-hover" onClick={() => setPage(1)}>
                      LIQUIDITY FARMING
                    </abbr>
                    <abbr className="account-hover" onClick={() => setPage(2)}>
                      GOVERNANCE
                    </abbr>
                  </p>

                  <ButtonAffiliates />
                </span>

                <span className="dg-tabs-mobile">
                  <p className="account-other-p">
                    <b className="account-hover active">MINING</b>{' '}
                    <abbr className="account-hover" onClick={() => setPage(1)}>
                      FARMING
                    </abbr>
                    <abbr className="account-hover" onClick={() => setPage(2)}>
                      GOV
                    </abbr>
                  </p>

                  <ButtonAffiliates />
                </span>
              </div>
            );
          else if (DGstate == 1)
            return (
              <div>
                <span className="dg-tabs-desktop">
                  <p className="account-other-p">
                    <abbr className="account-hover" onClick={() => setPage(0)}>
                      GAMEPLAY MINING
                    </abbr>{' '}
                    <b className="account-hover active">LIQUIDITY FARMING</b>
                    <abbr className="account-hover" onClick={() => setPage(2)}>
                      GOVERNANCE
                    </abbr>{' '}
                  </p>
                </span>

                <span className="dg-tabs-mobile">
                  <p className="account-other-p">
                    <abbr className="account-hover" onClick={() => setPage(0)}>
                      MINING
                    </abbr>{' '}
                    <b className="account-hover active">FARMING</b>
                    <abbr className="account-hover" onClick={() => setPage(2)}>
                      GOV
                    </abbr>{' '}
                  </p>
                </span>
              </div>
            );
          else
            return (
              <div>
                <span className="dg-tabs-desktop">
                  <p className="account-other-p">
                    <abbr className="account-hover" onClick={() => setPage(0)}>
                      GAMEPLAY MINING
                    </abbr>{' '}
                    <abbr className="account-hover" onClick={() => setPage(1)}>
                      LIQUIDITY FARMING
                    </abbr>
                    <b className="account-hover active">GOVERNANCE</b>
                  </p>
                </span>

                <span className="dg-tabs-mobile">
                  <p className="account-other-p">
                    <abbr className="account-hover" onClick={() => setPage(0)}>
                      MINING
                    </abbr>{' '}
                    <abbr className="account-hover" onClick={() => setPage(1)}>
                      FARMING
                    </abbr>
                    <b className="account-hover active">GOV</b>
                  </p>
                </span>
              </div>
            );
        })()}
      </div>
    );
  }

  function setPage(number) {
    setDGState(number);
  }

  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={3} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container ">
            {submenu()}
            {/*<span style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '-60px', marginBottom: '60px' }}>
              <Radio toggle onClick={toggleTheme} />
            </span>*/}

            <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />

            {(() => {
              if (DGstate == 0) return gameplayFarming();
              else if (DGstate == 1) return liquidityFarming();
              else return Governance();
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Farming;
