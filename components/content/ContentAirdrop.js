import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Loader } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';

const ContentAirdrop = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [tokenUSD, setTokenUSD] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_KEEPER_DG) {
      const tokenUSD = Number(props.price * state.DGBalances.BALANCE_KEEPER_DG);
      const tokenUSDFormatted = props.formatPrice(tokenUSD, 2);

      setTokenUSD(tokenUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_KEEPER_DG]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // claim DG tokens from keeper contract
  async function scrapeMyTokens() {
    console.log('Call scrapeMyTokens() function to claim DG tokens');

    try {
      const data = await keeperContract.methods
        .scrapeMyTokens()
        .send({ from: userAddress });

      console.log(
        'scrapeMyTokens() transaction completed: ' + data.transactionHash
      );

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Scrape tokens transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentAirdrop() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 className="DG-h3">$DG | Decentral Games Governance Token</h3>
              <p>
                $DG is rewarded to players, liquidity providers, and governors
                of the decentral.games ecosystem. Learn more by reading our
                <a
                  href="https://decentral.games/blog/presenting-dg-be-the-house-in-the-first-metaverse-casino"
                  target="_blank"
                  style={{ color: '#2085f4' }}
                >
                  {' '}
                  announcement{' '}
                </a>
                or by visiting our
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
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">Unclaimed $DG</p>
                {state.DGBalances.BALANCE_KEEPER_DG ? (
                  <p className="account-name">
                    {props.formatPrice(state.DGBalances.BALANCE_KEEPER_DG, 3)}
                  </p>
                ) : (
                  <Loader
                    active
                    inline
                    size="medium"
                    style={{
                      fontSize: '12px',
                      marginTop: '12px',
                      marginLeft: '15px',
                    }}
                  />
                )}
              </span>
            </span>

            <Divider />

            <span
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingTop: '12px',
                paddingBottom: '12px',
              }}
            >
              <p className="earned-text">Value USD</p>
              {tokenUSD ? (
                <p className="earned-amount">${tokenUSD}</p>
              ) : (
                <Loader
                  active
                  inline
                  size="small"
                  style={{
                    fontSize: '12px',
                    marginTop: '1px',
                    marginBottom: '2px',
                  }}
                />
              )}
            </span>

            <Divider />

            {Number(state.DGBalances.BALANCE_KEEPER_DG) ? (
              <span className="DG-button-span">
                <Button
                  className="DG-claim-button"
                  id="balances-padding-correct"
                  onClick={() => scrapeMyTokens()}
                >
                  CLAIM $DG
                </Button>
              </span>
            ) : (
              <span className="DG-button-span">
                <Button disabled className="DG-claim-button">
                  CLAIM $DG
                </Button>
              </span>
            )}
          </div>

          <span className="DG-tablet-container">
            <div className="DG-column" style={{ width: '100%' }}>
              <span style={{ display: 'flex' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">Existing NFT Holders</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    december 1, 2020
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    Each Tominoya and Flamingos NFT Holder gets 120 DG with 20
                    week linear vesting.
                  </p>
                </span>
              </span>

              <span style={{ display: 'flex', paddingTop: '30px' }}>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <h3 className="DG-h3">All Community Players</h3>
                  <p
                    className="welcome-text"
                    style={{ marginTop: '-12px', paddingLeft: '0px' }}
                  >
                    december 1, 2020
                  </p>
                  <p style={{ paddingTop: '15px' }}>
                    Each Ethereum address that has played our free play games
                    within the last 4 months gets 10 DG (Cutoff: Nov 1, 2020).
                  </p>
                </span>
              </span>
            </div>
          </span>
        </div>
      </Aux>
    );
  }

  return contentAirdrop();
};

export default ContentAirdrop;
