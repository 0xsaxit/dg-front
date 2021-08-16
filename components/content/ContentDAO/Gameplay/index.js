import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Loader, Popup, Icon, Button, Table } from 'semantic-ui-react';
import Global from 'components/Constants';
import Transactions from 'common/Transactions';
import Aux from '../../../_Aux';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import styles from './Gameplay.module.scss';
import axios from 'axios';
import Fetch from '../../../../common/Fetch';


const Gameplay = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContractNew, setPointerContractNew] = useState({});
  const [price, setPrice] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions

  // fetch circulating supply
  useEffect(() => {
    (async function () {
      const json = await Fetch.DG_SUPPLY_GECKO();
      setPrice(json.market_data.current_price.usd);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy);

      const pointerContractNew = await Transactions.pointerContractNew(getWeb3);

      setPointerContractNew(pointerContractNew);
    })();
  }, []);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + state.userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContractNew.methods
        .distributeTokensForPlayer(state.userAddress)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        7,
        functionSignature,
        pointerContractNew,
        state.userAddress,
        window.ethereum
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

  return (
    <Aux>
      <div
        className={cn(
          'd-flex',
          styles.stake_DG_container
        )}
      >
        <div className={cn(styles.lower)}>
          <p className={styles.lower_header}>Gameplay Rewards</p>
          <video
            src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626409937/Play_to_Earn_w4deik.webm"
            className={styles.lower_img}
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
          ></video>
          <p className={styles.lower_text}>
            All $DG-powered games earn back rewards. Play games and earn up to 50% of expected losses, win or lose.
          </p>
          <Button
            className={styles.lower_button}
            onClick={() => {
              router.push('/dg/liquidity');
            }}
          >
            Learn More
          </Button>
        </div>

        <div className={styles.lower}>
          <p className={styles.lower_header}>Claim $DG Rewards</p>
          <div className={styles.lower_value}>
            <p className={styles.DG_value}>
              {formatPrice(state.DGBalances.BALANCE_MINING_DG_V2, 3)}
            </p>
            <img 
              style={{ marginTop: '-4px' }}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif" />
          </div>
          <p className={styles.price}>
            ${(price * state.DGBalances.BALANCE_MINING_DG_V2).toFixed(2)}
          </p>
          <Button
            className={cn(styles.claim_DG, styles.lower_button)}
            disabled={!Number(state.DGBalances.BALANCE_MINING_DG_V2)}
            onClick={() => metaTransaction()}
          >
            Claim {formatPrice(state.DGBalances.BALANCE_MINING_DG_V2, 3)}{' '}
            $DG
          </Button>
          <a
            href="#"
            onClick={() => {
              router.push('/dg/mining');
            }}
            className={styles.see_all_rewards}
          >
            See All Rewards
          </a>
        </div>
      </div>
    </Aux>
  );
}

export default Gameplay;