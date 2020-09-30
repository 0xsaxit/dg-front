import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Radio } from 'semantic-ui-react';
// import ButtonAuthorize from './ButtonAuthorize'
// import ButtonEnable from './ButtonEnable'
// import ContentNFTs from './ContentNFTs'
import Aux from '../_Aux';
import Spinner from '../Spinner';
import Global from '../Constants';

const Farming = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGstate, setDGState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [getTokens, setGetTokens] = useState(false);

  let userAddress = '';

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      if (getTokens) claimDG();
    }
  }, [state.userStatus, getTokens]);

  // dispatch DG tokens to user
  function claimDG() {
    console.log('Dispatching DG tokens to user: ' + userAddress);
    Global.FETCH.GET_TOKENS(userAddress);

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
                You can mine $DG by playing games with $MANA or $DAI. Playing
                with two, three, or four players at a table earns you +20%,
                +30%, and +40% bonuses respectively, and each Decentral Games
                wearable you wear earns you a +10% bonus when playing. Refer any
                friends and get an additional 20% of all $DG they mine. For more
                details, see our
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
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
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
              <img src={Global.IMAGES.MANA_CIRCLE} className="farming-logo" />
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
              <img src={Global.IMAGES.DAI_CIRCLE} className="farming-logo" />
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
                You can farm $DG by providing liquidity in 98% MANA • 2% DG and
                98% DAI • 2% DG Balancer pools and staking the balancer pool
                tokens on this dashboard. Read more about $DG liquidity farming
                rewards in our
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
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed DG</p>
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
              <img src={Global.IMAGES.MANA_CIRCLE} className="farming-logo" />
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Balancer Pool </p>
                <p className="account-name">MANA-DG</p>
              </span>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <Button disabled className="DG-deposit-button">
              GO TO BALANCER
            </Button>

            <span className="DG-button-span">
              <Button disabled className="DG-stake-button">
                STAKE LP
              </Button>
              <Button disabled className="DG-stake-button">
                UNSTAKE LP
              </Button>
            </span>
          </div>

          <div className="DG-column two">
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.DAI_CIRCLE} className="farming-logo" />
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Balancer Pool </p>
                <p className="account-name">DAI-DG</p>
              </span>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Total Deposited </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % share of pool </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> Pool Rate </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <Button disabled className="DG-deposit-button">
              GO TO BALANCER
            </Button>

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
                Staked $DG tokens are used to vote in decentral.games
                governance. For the first year there will be governance rewards
                distributed to stakers in the $DG governance contract. Proposals
                can be submitted and voted on{' '}
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
            className="DG-column gov"
            style={{ position: 'relative', height: '100%' }}
          >
            <span style={{ display: 'flex' }}>
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Unclaimed DG</p>
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
              <img src={Global.IMAGES.LOGO} className="farming-logo" />
              <span className="farming-pool-span">
                <p className="welcome-text"> Staked DG</p>
                <p className="account-name">0</p>
              </span>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> $DG staked in governance </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> % of governance pool</p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p className="earned-text"> treasury balance </p>
              <p className="earned-amount"> ... </p>
            </span>

            <Divider />

            <span className="DG-button-span">
              <Button disabled className="DG-claim-button">
                Stake
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
              <p className="account-other-p">
                <b className="account-hover active">GAMEPLAY MINING</b>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY FARMING
                </abbr>
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>
              </p>
            );
          else if (DGstate == 1)
            return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  GAMEPLAY MINING
                </abbr>{' '}
                <b className="account-hover active">LIQUIDITY FARMING</b>
                <abbr className="account-hover" onClick={() => setPage(2)}>
                  GOVERNANCE
                </abbr>{' '}
              </p>
            );
          else
            return (
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  GAMEPLAY MINING
                </abbr>{' '}
                <abbr className="account-hover" onClick={() => setPage(1)}>
                  LIQUIDITY FARMING
                </abbr>
                <b className="account-hover active">GOVERNANCE</b>
              </p>
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
