import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon } from 'semantic-ui-react';
import MetaTx from 'common/MetaTx';
import Transactions from 'common/Transactions';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Global from 'components/Constants';

import styles from './ContentMining.module.scss';

const ContentMining = props => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContractNew, setPointerContractNew] = useState({});
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
      <div className={styles.dg_content_mining_container}>
        <div className={styles.dg_liquidity_container}>
          <div className={styles.dg_column_unclaimed}>
            <p className={styles.earned_amount}>
              Unclaimed
            </p>

            <Divider className={styles.divider_dg_top} />

            <span className={styles.dg_flex}>
              <img
                src={Images.DG_COIN_LOGO}
                className={styles.farming_logo_small}
                alt="Decentral Games Coin Logo"
              />
              <span className={styles.farming_pool_span}>
                <p className={styles.welcome_text_top}>$DG Balance</p>
                {state.DGBalances.BALANCE_MINING_DG_V2 ? (
                  <p className={styles.earned_amount}>
                    {props.formatPrice(state.DGBalances.BALANCE_MINING_DG_V2, 3)}
                  </p>
                ) : (
                  <Loader
                    className={styles.dg_balance_loader}
                    active
                    inline
                    size="small"
                  />
                )}
              </span>
            </span>

            <Divider className={styles.divdier_dg_top} />

            <span className={styles.dg_flex_direction_space_between}>
              <p className={styles.welcome_text}>
                {' '}
                TOTAL USD{' '}
              </p>
              <p className={styles.earned_amount}> ${gameplayUSD} </p>
            </span>

            <Divider className={styles.divider_dg_top} />

            <p className={styles.dg_column_body}>
              Mine $DG by playing games with crypto. Earn bonuses by playing with
              friends, wearing $DG NFTs, and referring friends. For V1 rewards,
              click{' '}
              <a className={styles.dg_column_body_href} href="/dg/miningv1" target="_blank">
                here
              </a>
              .
            </p>

            <Divider className={styles.divider_dg_top} />

            <span className={styles.dg_button_span}>
              {Number(state.DGBalances.BALANCE_MINING_DG_V2) ? (
                <Button
                  className={styles.dg_claim_button}
                  id="balances-padding-correct"
                  onClick={() => metaTransaction()}
                >
                  Claim
                </Button>
              ) : (
                <Button className={styles.dg_claim_button} disabled>
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className={styles.mining_container_outter}>
            <div className={styles.mining_container_inner}>
              <div className={styles.dg_column_treasury_two}>
                <p className={styles.earned_amount}>
                  Gameplay Rewards
                </p>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <img
                    src={Images.MANA_CIRCLE}
                    className={styles.farming_logo_small}
                    alt="MANA Coin Logo"
                  />
                  <span className={styles.farming_pool_span}>
                    <p className={styles.welcome_text_top}>Coin</p>
                    <p className={styles.earned_amount}>MANA</p>
                  </span>
                </div>

                <span className={styles.dg_flex_justify_content_end}>
                  <a
                    className={styles.dg_flex_margin}
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                  >
                    <Icon
                      className={styles.more_text}
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <span className={styles.gameplay_left_column}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Roulette Rate / 1 DG</p>
                      <p className={styles.earned_amount}>14,600</p>
                    </span>
                  </span>

                  <span className={styles.dg_flex_justify_content_center}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Blackjack Rate / 1 DG</p>
                      <p className={styles.earned_amount}>49,300</p>
                    </span>
                  </span>
                </div>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_button_span}>
                  <Button
                    href="{`https://play.decentraland.org/?position=-96%2C110&realm=fenrir-amber${utm}`}"
                    className={styles.dg_play_now_button}
                    target="_blank"
                    id="balances-padding-correct-two"
                  >
                    Play Now
                  </Button>
                </span>
              </div>

              <div className={styles.dg_column_treasury_three}>
                <p className={styles.earned_amount}>
                  Gameplay Rewards
                </p>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <span className={styles.dg_flex}>
                    <img src={Images.DAI_CIRCLE} className={styles.farming_logo_small} />
                    <img
                      src={Images.USDT_CIRCLE}
                      className={styles.farming_logo_small_two}
                      alt="Decentral Games Coin Logo"
                    />
                  </span>
                  <span className={styles.farming_pool_span}>
                    <p className={styles.welcome_text_top}>Coins</p>
                    <p className={styles.earned_amount}>DAI, USDT</p>
                  </span>
                </div>

                <span className={styles.dg_flex_justify_content_end}>
                  <a
                    className={styles.dg_flex_margin}
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                  >
                    <Icon
                      className={styles.more_text}
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <span className={styles.gameplay_left_column}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Roulette Rate / 1 DG</p>
                      <p className={styles.earned_amount}>12,600</p>
                    </span>
                  </span>

                  <span className={styles.dg_flex_justify_content_center}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Blackjack Rate / 1 DG</p>
                      <p className={styles.earned_amount}>42,500</p>
                    </span>
                  </span>
                </div>

                <Divider className={styles.divdier_dg_top} />

                <span className={styles.dg_button_span}>
                  <Button
                    href={`https://play.decentraland.org/?position=-96%2C110&realm=fenrir-amber${utm}`}
                    className={styles.dg_play_now_button}
                    id="balances-padding-correct-two"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>
            </div>

            <div className={styles.mining_container_inner}>
              <div className={styles.dg_column_treasury_two}>
                <p className={styles.earned_amount}>
                  Gameplay Rewards
                </p>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_flex}>
                  <img
                    src={Images.ATRI_CIRCLE}
                    className={styles.farming_logo_small}
                    alt="MANA Coin Logo"
                  />
                  <span className={styles.farming_pool_span}>
                    <p className={styles.welcome_text_top}>Coin</p>
                    <p className={styles.earned_amount}>ATRI</p>
                  </span>
                </span>

                <span className={styles.dg_flex_justify_content_end}>
                  <a
                    className={styles.dg_flex_margin}
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                  >
                    <Icon
                      className={styles.more_text}
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <span className={styles.gameplay_left_column}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Roulette Rate / 1 DG</p>
                      <p className={styles.earned_amount}>N/A</p>
                    </span>
                  </span>

                  <span className={styles.dg_flex_justify_content_center}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Blackjack Rate / 1 DG</p>
                      <p className={styles.earned_amount}>N/A</p>
                    </span>
                  </span>
                </div>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_button_span}>
                  <Button
                    href={`https://play.decentraland.org/?position=-96%2C110&realm=fenrir-amber${utm}`}
                    className={styles.dg_play_now_button}
                    id="balances-padding-correct-two"
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>

              <div className={styles.dg_column_treasury_three}>
                <p className={styles.earned_amount}>
                  Gameplay Rewards
                </p>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_flex}>
                  <img
                    className={styles.farming_logo_small}
                    src={Images.ETH_CIRCLE}
                    alt="MANA Coin Logo"
                  />
                  <span className={styles.farming_pool_span}>
                    <p className={styles.welcome_text_top}>Coin</p>
                    <p className={styles.earned_amount}>ETH</p>
                  </span>
                </span>

                <span className={styles.dg_flex_justify_content_end}>
                  <a
                    className={styles.dg_flex_margin}
                    href="https://docs.decentral.games/allocation#community"
                    target="_blank"
                  >
                    <Icon
                      className={styles.more_text}
                      name="external square alternate"
                    />
                  </a>
                </span>

                <Divider className={styles.divider_dg_top} />

                <div className={styles.dg_flex}>
                  <span className={styles.gameplay_left_column}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Roulette Rate / 1 DG</p>
                      <p className={styles.earned_amount}>5</p>
                    </span>
                  </span>

                  <span className={styles.dg_flex_justify_content_center}>
                    <span className={styles.dg_flex_center}>
                      <p className={styles.earned_text}>Blackjack Rate / 1 DG</p>
                      <p className={styles.earned_amount}>15</p>
                    </span>
                  </span>
                </div>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_button_span}>
                  <Button
                    id="balances-padding-correct-two"
                    href={`https://play.decentraland.org/?position=-96%2C110&realm=fenrir-amber${utm}`}
                    className={styles.dg_play_now_button}
                    target="_blank"
                  >
                    Play Now
                  </Button>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default ContentMining;
