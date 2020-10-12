import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';

const ContentFarming = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentMining() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG Gameplay Mining</h3>
              <p>
                You can mine $DG by playing games with $MANA or $DAI. Earn
                multipliers by playing with friends or wearing Decentral Games
                NFTs. Refer any friends and get an additional 20% of all $DG
                they mine. For more details, see our
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
                  onClick={() => props.metaTransaction()}
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
  function contentLiquidity() {
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
                  onClick={() => props.metaTransaction()}
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

          <div
            className="DG-column one"
            style={{ position: 'relative', height: '100%' }}
          >
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

          <div
            className="DG-column two"
            style={{ position: 'relative', height: '100%' }}
          >
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
  function contentGovernance() {
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
                  onClick={() => props.metaTransaction()}
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

  if (props.content === 'mining') {
    return contentMining();
  } else if (props.content === 'liquidity') {
    return contentLiquidity();
  } else if (props.content === 'governance') {
    return contentGovernance();
  }
};

export default ContentFarming;