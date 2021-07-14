import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store';
import Web3 from 'web3';
import { Button, Divider, Loader } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Transactions from 'common/Transactions';
import styles from './ContentAirdrop.module.scss';

const ContentAirdrop = props => {
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

      const fetchData = async () => {
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
  const scrapeMyTokens = async () => {
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
      <div className={styles.dg_liquidity_container}>
        <div className={styles.dg_column_unclaimed}>
          <p className={styles.earned_amount}>Unclaimed</p>

          <Divider />

          <span className="d-flex">
            <img
              src={Images.DG_COIN_LOGO}
              className={styles.farming_logo_small}
              alt="Decentral Games Coin Logo"
            />
            <span className={styles.farming_pool_span}>
              <p className={styles.welcome_text_top}>$DG Balance</p>
              {state.DGBalances.BALANCE_KEEPER_DG ? (
                <p className={styles.earned_amount}>
                  {props.formatPrice(state.DGBalances.BALANCE_KEEPER_DG, 3)}
                </p>
              ) : (
                <Loader
                  className={styles.farming_pool_loader}
                  active
                  inline
                  size="medium"
                />
              )}
            </span>
          </span>

          <Divider />

          <span className={styles.dg_liquidity_token}>
            <p className={styles.earned_text}>Value USD</p>
            {tokenUSD ? (
              <p className={styles.earned_amount}>${tokenUSD}</p>
            ) : (
              <Loader
                className={styles.dg_liquidity_token_loader}
                active
                inline
                size="small"
              />
            )}
          </span>

          <Divider />

          <p className={styles.dg_liquidity_body}>
            $DG is rewarded to players, liquidity providers, and governors of
            the decentral.games ecosystem.
            <a
              className={styles.dg_liquidity_body_hyperlink}
              href="https://decentral-games-1.gitbook.io/dg/allocation"
              target="_blank"
            >
              {' '}
              Learn more
            </a>
            .
          </p>

          {Number(state.DGBalances.BALANCE_KEEPER_DG) ? (
            <span className={styles.dg_button_span}>
              <Button
                className={styles.dg_claim_button}
                id="balances-padding-correct"
                onClick={() => scrapeMyTokens()}
              >
                CLAIM $DG
              </Button>
            </span>
          ) : (
            <span className={styles.dg_button_span}>
              <Button disabled className={styles.dg_claim_button}>
                CLAIM $DG
              </Button>
            </span>
          )}
        </div>
      </div>
    </Aux>
  );
};

export default ContentAirdrop;
