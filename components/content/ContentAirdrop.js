import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import { Button, Divider, Loader } from 'semantic-ui-react';
import Aux from '../_Aux';
import Images from '../../common/Images';
import Transactions from '../../common/Transactions';
import Global from '../Constants';

const ContentAirdrop = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [tokenUSD, setTokenUSD] = useState(0);
  const [keeperContract, setKeeperContract] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 provider and create contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);
      }

      fetchData();
    }
  }, [state.userStatus]);

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
        .send({ from: state.userAddress });

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

        <div className="DG-liquidity-container">
          <div className="DG-column unclaimed">
            <p className="earned-amount">Unclaimed</p>

            <Divider className="divider-dg-top" />

            <span style={{ display: 'flex' }}>
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo-small"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text-top">$DG Balance</p>
                {state.DGBalances.BALANCE_KEEPER_DG ? (
                  <p className="earned-amount">
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

            <Divider className="divider-dg-top" />

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

            <Divider className="divider-dg-top" />

            <p style={{ fontSize: '18px' }}>
              $DG is rewarded to players, liquidity providers, and governors
              of the decentral.games ecosystem. 
              <a
                href="https://decentral-games-1.gitbook.io/dg/allocation"
                target="_blank"
                style={{ color: '#2085f4' }}
              >
                {' '}
                Learn more 
              </a>
              .
            </p>

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

        </div>
      </Aux>
    );
  }

  return contentAirdrop();
};

export default ContentAirdrop;
