import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../../store';
import Web3 from 'web3';
import { Button, Divider, Loader } from 'semantic-ui-react';
import Aux from '../../_Aux';
import Images from '../../../common/Images';
import Transactions from '../../../common/Transactions';
import styles from './ContentAirdrop.module.scss';

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

  return (
    <Aux>
      <span style={{ display: 'flex', justifyContent: 'center' }}>
        <div className={styles.airdrop_container}>
          <p className={styles.airdrop_title}>Unclaimed Airdropped $DG</p>

          <span className={styles.earned_span}>
            {state.DGBalances.BALANCE_KEEPER_DG ? (
              <p className={styles.earned_amount}>
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
            <img
              src={Images.DG_COIN_LOGO}
              className={styles.dg_logo}
              alt="Decentral Games Coin Logo"
            />
          </span>

          {Number(state.DGBalances.BALANCE_KEEPER_DG) ? (
            <span>
              <Button
                className={styles.airdrop_button} 
                onClick={() => scrapeMyTokens()}
              >
                Claim {props.formatPrice(state.DGBalances.BALANCE_KEEPER_DG, 3)} $DG
              </Button>
            </span>
          ) : (
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <Button className={styles.airdrop_button} disabled>
                Claim {props.formatPrice(state.DGBalances.BALANCE_KEEPER_DG, 3)} $DG
              </Button>
            </span>
          )}
        </div>
      </span>
    </Aux>
  );
};

export default ContentAirdrop;
