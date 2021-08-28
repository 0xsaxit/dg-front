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
import MetaTx from '../../../../common/MetaTx';


const Gameplay = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContractNew, setPointerContractNew] = useState({});
  const [price, setPrice] = useState(0);
  const [web3, setWeb3] = useState({});
  const [gameplayUSD, setGameplayUSD] = useState(0);

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
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      async function fetchData() {
        const pointerContractNew = await Transactions.pointerContractNew(
          getWeb3
        );
        setPointerContractNew(pointerContractNew);
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
    if (props.price && state.DGBalances.BALANCE_MINING_DG_V2) {
      const gameplayUSD = props.price * state.DGBalances.BALANCE_MINING_DG_V2;
      const gameplayUSDFormatted = props.formatPrice(gameplayUSD, 2);

      setGameplayUSD(gameplayUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_MINING_DG_V2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction. Dispatch DG tokens to player
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

  return (
    <Aux>
      <div
        className={cn(
          'd-flex',
          styles.stake_DG_container
        )}
      >

        <div className={styles.lower}>
          <p className={styles.lower_header}>Claim $DG Rewards</p>
          <div className={styles.lower_value}>
            <p className={styles.DG_value}>
              {props.formatPrice(state.DGBalances.BALANCE_MINING_DG_V2, 3)}
            </p>
            <img 
              style={{ marginTop: '-4px' }}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif" />
          </div>
          <p className={styles.price}>
            ${(price * state.DGBalances.BALANCE_MINING_DG_V2).toFixed(2)}
          </p>

          <p className={styles.lower_text}>
            All $DG-powered games earn back rewards. Play games and earn up to 50% of expected losses, win or lose.
          </p>

          <Button
            className={cn(styles.claim_DG, styles.lower_button)}
            disabled={!Number(state.DGBalances.BALANCE_MINING_DG_V2)}
            onClick={() => metaTransaction()}
          >
            Claim {props.formatPrice(state.DGBalances.BALANCE_MINING_DG_V2, 3)}{' '}
            $DG
          </Button>
        </div>

        <div className={styles.lower_gameplay}>
          <p className={styles.lower_header_two}>Gameplay Rewards</p>

          <div className={styles.gameplay_container}>
            <img 
              className={styles.gameplay_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1625014714/ETH_kzfhxr.png"
            />

            <div className={styles.gameplay_right}>
              <div className="d-flex flex-column mr-2">
                <p className={styles.gameplay_top}>Roulette Rate</p>
                <p className={styles.gameplay_title}>7 ETH</p>
              </div>

              <div className={styles.reward_stats}>
                <p className={styles.gameplay_right}>Blackjack Rate</p>
                <p className={styles.gameplay_right_bottom}>23 ETH</p>
              </div>
            </div>
          </div>

          <div className={styles.gameplay_container}>
            <img 
              className={styles.gameplay_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620413783/MANA_jw7ylg.png"
            />

            <div className={styles.gameplay_right}>
              <div className="d-flex flex-column mr-2">
                <p className={styles.gameplay_top}>Roulette Rate</p>
                <p className={styles.gameplay_title}>24.3K MANA</p>
              </div>

              <div className={styles.reward_stats}>
                <p className={styles.gameplay_right}>Blackjack Rate</p>
                <p className={styles.gameplay_right_bottom}>82K MANA</p>
              </div>
            </div>
          </div>

          <div className={styles.gameplay_container}>
            <img 
              className={styles.gameplay_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620413765/TETHER_xhvz1p.png"
            />

            <div className={styles.gameplay_right}>
              <div className="d-flex flex-column mr-2">
                <p className={styles.gameplay_top}>Roulette Rate</p>
                <p className={styles.gameplay_title}>22K USDT</p>
              </div>

              <div className={styles.reward_stats}>
                <p className={styles.gameplay_right}>Blackjack Rate</p>
                <p className={styles.gameplay_right_bottom}>74K USDT</p>
              </div>
            </div>
          </div>

          <div className={styles.gameplay_container}>
            <img 
              className={styles.gameplay_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620413783/DAI_xbso2s.png"
            />

            <div className={styles.gameplay_right}>
              <div className="d-flex flex-column mr-2">
                <p className={styles.gameplay_top}>Roulette Rate</p>
                <p className={styles.gameplay_title}>22K DAI</p>
              </div>

              <div className={styles.reward_stats}>
                <p className={styles.gameplay_right}>Blackjack Rate</p>
                <p className={styles.gameplay_right_bottom}>74K DAI</p>
              </div>
            </div>
          </div>

          <div className={styles.gameplay_container}>
            <img 
              className={styles.gameplay_img}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620413783/ATARI_ttfcry.png"
            />

            <div className={styles.gameplay_right}>
              <div className="d-flex flex-column mr-2">
                <p className={styles.gameplay_top}>Roulette Rate</p>
                <p className={styles.gameplay_title}>400K ATRI</p>
              </div>

              <div className={styles.reward_stats}>
                <p className={styles.gameplay_right}>Blackjack Rate</p>
                <p className={styles.gameplay_right_bottom}>1.35M ATRI</p>
              </div>
            </div>
          </div>

          <Button 
            className={styles.play_button}
            href="https://play.decentraland.org/?position=-118%2C135&realm=dg"
            target="_blank"
          >
            Play Now
          </Button>
        </div>
      </div>
    </Aux>
  );
}

export default Gameplay;