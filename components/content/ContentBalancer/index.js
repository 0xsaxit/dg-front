// Progress!!!!

import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';
import styles from './ContentBalancer.module.scss';

const UnClaimedBalancer = ({pool1, setPool1, balancer, formatPrice }) => {
  return (
    <>
      <span className={styles.farming_pool_span_detail}>
        <p className={styles.welcome_text}>unclaimed 1</p>
        <Icon
          name="sort"
          id="pool-select-icon"
          onClick={() => setPool1(!pool1)}
        />
      </span>
      <p className={styles.account_name}>
        {balancer ? (
          formatPrice(
            balancer,
            3
          )
        ) : (
          <Loader
            className={styles.loader}
            active
            inline
            size="small"
          />
        )}
      </p>
    </>
  )
}

const PoolUSDValue = ({ poolUSD }) => {
  return (
    <>
      <span className={styles.dg_flex_space_between}>
        <p className={styles.earned_text}>Value USD</p>
        {poolUSD ? (
          <p className={styles.earned_amount}>${poolUSD}</p>
        ) : (
          <Loader
            className={styles.loader}
            active
            inline
            size="small"
          />
        )}
      </span>
    </>
  )
}

const ClaimBalancer = ({ balancer, reward, contractPool, title}) => {
  return (
    <>
      <span className={styles.dg_button_span}>
        {Number(balancer) ? (
          <Button
            className={styles.dg_claim_button}
            id="balances-padding-correct"
            onClick={() => reward(contractPool)}
          >
            {title}
          </Button>
        ) : (
          <Button disabled className={styles.dg_claim_button}>
            {title}
          </Button>
        )}
      </span>
    </>
  )
}

const ContentBalancer = props => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pool1, setPool1] = useState(true);
  const [amountInputMANA, setAmountInputMANA] = useState('');
  const [amountInputDAI, setAmountInputDAI] = useState('');
  const [percentagePool1, setPercentagePool1] = useState(0);
  const [percentagePool2, setPercentagePool2] = useState(0);
  const [APYMANA, setAPYMANA] = useState(0);
  const [APYDAI, setAPYDAI] = useState(0);
  const [poolPercentage1, setPoolPercentage1] = useState(0);
  const [poolPercentage2, setPoolPercentage2] = useState(0);
  const [pool1USD, setPool1USD] = useState(0);
  const [pool2USD, setPool2USD] = useState(0);
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const BPTContract1 = await Transactions.BPTContract1(web3);
        setBPTContract1(BPTContract1);

        const BPTContract2 = await Transactions.BPTContract2(web3);
        setBPTContract2(BPTContract2);
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (
      props.price &&
      state.DGBalances.BALANCE_STAKING_BALANCER_1 &&
      state.DGBalances.BALANCE_STAKING_BALANCER_2
    ) {
      const pool1USD =
        props.price * state.DGBalances.BALANCE_STAKING_BALANCER_1;
      const pool1Formatted = props.formatPrice(pool1USD, 2);

      setPool1USD(pool1Formatted);

      const pool2USD =
        props.price * state.DGBalances.BALANCE_STAKING_BALANCER_2;
      const pool2Formatted = props.formatPrice(pool2USD, 2);

      setPool2USD(pool2Formatted);
    }
  }, [
    props.price,
    state.DGBalances.BALANCE_STAKING_BALANCER_1,
    state.DGBalances.BALANCE_STAKING_BALANCER_2,
  ]);

  useEffect(() => {
    if (props.price && state.stakingBalances.BALANCE_CONTRACT_BPT_1) {
      const numeratorMANA =
        51 * 1200 * props.price * state.DGBalances.SUPPLY_BPT_1;
      const totalLockedMANA =
        state.DGBalances.BALANCE_BP_DG_1 * props.price +
        Number(state.DGBalances.TOTAL_MANA);
      const denominatorMANA =
        totalLockedMANA * state.stakingBalances.BALANCE_CONTRACT_BPT_1;

      setAPYMANA(((numeratorMANA / denominatorMANA) * 100).toFixed(2));

      setPoolPercentage1(
        (
          (state.stakingBalances.BALANCE_STAKED_BPT_1 /
            state.stakingBalances.BALANCE_CONTRACT_BPT_1) *
          100
        ).toFixed(2)
      );
    }
  }, [props.price, state.stakingBalances.BALANCE_CONTRACT_BPT_1]);

  useEffect(() => {
    if (props.price && state.stakingBalances.BALANCE_CONTRACT_BPT_2) {
      const numeratorDAI =
        51 * 1200 * props.price * state.DGBalances.SUPPLY_BPT_2;
      const totalLockedDAI =
        state.DGBalances.BALANCE_BP_DG_2 * props.price +
        Number(state.DGBalances.BALANCE_BP_DAI);
      const denominatorDAI =
        totalLockedDAI * state.stakingBalances.BALANCE_CONTRACT_BPT_2;

      setAPYDAI(((numeratorDAI / denominatorDAI) * 100).toFixed(2));

      setPoolPercentage2(
        (
          (state.stakingBalances.BALANCE_STAKED_BPT_2 /
            state.stakingBalances.BALANCE_CONTRACT_BPT_2) *
          100
        ).toFixed(2)
      );
    }
  }, [props.price, state.stakingBalances.BALANCE_CONTRACT_BPT_2]);

  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          props.stakingContractPool1
        );

        if (stakedTotal) {
          const percentagePool =
            state.stakingBalances.BALANCE_STAKED_BPT_1 / stakedTotal;
          const percentageFixed = percentagePool * 100;

          setPercentagePool1(percentageFixed);
        } else {
          setPercentagePool1(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances.BALANCE_STAKED_BPT_1]);

  useEffect(() => {
    if (props.instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          props.stakingContractPool2
        );

        if (stakedTotal) {
          const percentagePool =
            state.stakingBalances.BALANCE_STAKED_BPT_2 / stakedTotal;
          const percentageFixed = percentagePool * 100;

          setPercentagePool2(percentageFixed);
        } else {
          setPercentagePool2(0);
        }
      })();
    }
  }, [props.instances, state.stakingBalances.BALANCE_STAKED_BPT_2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const handleChangeMANA = (e) => {
    console.log('New amount (MANA): ' + e.target.value);

    setAmountInputMANA(e.target.value);
  }

  const handleChangeDAI = (e) => {
    console.log('New amount (DAI): ' + e.target.value);

    setAmountInputDAI(e.target.value);
  }

  return (
    <Aux>
      <div className={styles.dg_liquidity_container_top}>
        <div className={styles.dg_column_top}>
          <span className={styles.dg_column_top_dg_title}>
            <h3>$DG Balancer Liquidity Incentives</h3>
            <p>
              Balancer LP rewards have now ended following this{' '}
              <a
                className={styles.dg_column_top_dg_title_link}
                href="https://snapshot.page/#/decentralgames.eth/proposal/QmRnnRAA3uHJjSvgMhLvigtapKRLNF1D5Wes5gVkRyJ1HX"
                target="_blank"
              >
                gov proposal
              </a>
              . The Uniswap LP rewards are still active and have been increased.{' '}
            </p>
          </span>
        </div>
      </div>

      <div className={styles.dg_liquidity_container}>
        <div className={styles.dg_column_unclaimed}>
          <span className={styles.dg_flex}>
            <img
              src={Images.DG_COIN_LOGO}
              className={styles.farming_logo}
              alt="Decentral Games Coin Logo"
            />
            <span className={styles.farming_pool_span}>
              <UnClaimedBalancer
                pool1={pool1}
                setPool1={setPool1}
                formatPrice={props.formatPrice}
                balancer={pool1 ? state.DGBalances.BALANCE_STAKING_BALANCER_1 : state.DGBalances.BALANCE_STAKING_BALANCER_2}
              />
            </span>
          </span>
          <Divider />
          <PoolUSDValue poolUSD={pool1 ? pool1USD : pool2USD} />
          <Divider />

          {pool1 ? 
            <ClaimBalancer
              balancer={state.DGBalances.BALANCE_STAKING_BALANCER_1}
              reward={props.reward}
              contractPool={props.stakingContractPool1}
              title="CLAIM BALANCER 1 $DG"
            /> 
            : <ClaimBalancer
                blanacer={state.DGBalances.BALANCER_STAKING_BALANCER_2}
                reward={props.reward}
                contractPool={props.stakingContractPool2}
                title="CLAIM BALANCER 2 $DG"
            />}
        </div>

        <div className={styles.dg_tablet_container}>
          <div
            className={styles.dg_column_one}
            id="DG-column-hover"
          >
            <span className={styles.dg_flex}>
              <img
                src={Images.MANA_CIRCLE}
                className={styles.farming_logo}
                alt="Decentraland Logo"
              />
              <img
                src={Images.DG_COIN_LOGO}
                className={styles.farming_logo}
                alt="Decentral Games Coin Logo"
              />
              <span className={styles.farming_pool_span}>
                <p className={styles.welcome_text}>balancer 1</p>
                <p className={styles.account_name}>MANA-DG</p>
              </span>
            </span>

            <span className={styles.dg_flex_justify_content_end}>
              <a
                href={`https://pools.balancer.exchange/#/pool/${Global.ADDRESSES.BP_TOKEN_ADDRESS_1}`}
                target="_blank"
                className={styles.dg_margin}
              >
                <Icon className={styles.more_text} name="external square alternate" />
              </a>
            </span>

            <Divider />

            <div className={styles.dg_flex}>
              <span className={styles.gameplay_left_column}>
                <span className={styles.dg_flex_center}>
                  <p className={styles.earned_text}>APY</p>
                  {APYMANA ? (
                    <p className={styles.earned_amount}>N/A</p>
                  ) : (
                    <Loader
                      className={styles.loader2}
                      active
                      inline
                      size="small"
                    />
                  )}
                </span>
              </span>

              <span className={styles.dg_flex_justify_content_center}>
                <span className={styles.dg_flex_center}>
                  <p className={styles.earned_text}>% of balancer 1</p>
                  <p className={styles.earned_amount}>
                    {poolPercentage1 ? (
                      <p className={styles.earned_amount}>N/A</p>
                    ) : (
                      <Loader
                        className={styles.loader2}
                        active
                        inline
                        size="small"
                      />
                    )}
                  </p>
                </span>
              </span>
            </div>

            <Divider />

            <Input
              className={styles.liquidity_input}
              fluid
              placeholder="Amount"
              value={amountInputMANA}
              onChange={handleChangeMANA}
            />

            <span className={styles.dg_amount_mana}>
              <p
                className={styles.bpt_text}
                onClick={() =>
                  setAmountInputMANA(state.stakingBalances.BALANCE_WALLET_BPT_1)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_WALLET_BPT_1,
                  3
                )}{' '}
                BPT
              </p>
              <p
                className={styles.bpt_text}
                onClick={() =>
                  setAmountInputMANA(state.stakingBalances.BALANCE_STAKED_BPT_1)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_STAKED_BPT_1,
                  3
                )}{' '}
                BPT staked
              </p>
            </span>

            <span className={styles.dg_button_span}>
              {Number(amountInputMANA) ? (
                <Button
                  className={styles.dg_stake_button}
                  id="balances-padding-correct"
                  onClick={() => {
                    props.staking(
                      BPTContract1,
                      Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1,
                      props.stakingContractPool1,
                      amountInputMANA
                    );
                    setAmountInputMANA('');
                  }}
                >
                  STAKE BPT
                </Button>
              ) : (
                <Button disabled className={styles.dg_stake_button}>
                  STAKE BPT
                </Button>
              )}

              {percentagePool1 && Number(amountInputMANA) ? (
                <Button
                  className={styles.dg_stake_button}
                  id="balances-padding-correct"
                  onClick={() => {
                    props.withdrawal(
                      props.stakingContractPool1,
                      amountInputMANA
                    );
                    setAmountInputMANA('');
                  }}
                >
                  UNSTAKE BPT
                </Button>
              ) : (
                <Button disabled className={styles.dg_stake_button}>
                  UNSTAKE BPT
                </Button>
              )}
            </span>
          </div>

          <div
            className={styles.dg_column_one}
            className="DG-column two"
            style={{ position: 'relative', height: '100%' }}
          >
            <span className={styles.dg_flex}>
              <img
                src={Images.DAI_CIRCLE}
                className="farming-logo"
                alt="Dai Logo"
              />
              <img
                src={Images.DG_COIN_LOGO}
                className="farming-logo"
                alt="Decentral Games Coin Logo"
              />
              <span className="farming-pool-span">
                <p className="welcome-text">balancer 2</p>
                <p className="account-name">DAI-DG</p>
              </span>
            </span>

            <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <a
                href={`https://pools.balancer.exchange/#/pool/${Global.ADDRESSES.BP_TOKEN_ADDRESS_2}`}
                target="_blank"
                style={{ marginTop: '-75px', marginRight: '0px' }}
              >
                <Icon className="more-text" name="external square alternate" />
              </a>
            </span>

            <Divider />

            <div className={styles.dg_flex}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <p className="earned-text">APY</p>
                  {APYDAI ? (
                    <p className="earned-amount">N/A</p>
                  ) : (
                    <Loader
                      className={styles.loader2}
                      active
                      inline
                      size="small"
                    />
                  )}
                </span>
              </span>

              <span className={styles.dg_flex_justify_content_center}>
                <span className={styles.dg_flex_center}>
                  <p className="earned-text">% of balancer 2</p>
                  {poolPercentage2 ? (
                    <p className="earned-amount">N/A</p>
                  ) : (
                    <Loader
                      className={styles.loader2}
                      active
                      inline
                      size="small"
                    />
                  )}
                </span>
              </span>
            </div>

            <Divider />

            <Input
              className="liquidity-input"
              fluid
              placeholder="Amount"
              value={amountInputDAI}
              onChange={handleChangeDAI}
            />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p
                className={styles.bpt_text}
                onClick={() =>
                  setAmountInputDAI(state.stakingBalances.BALANCE_WALLET_BPT_2)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_WALLET_BPT_2,
                  3
                )}{' '}
                BPT
              </p>
              <p
                className={styles.bpt_text}
                onClick={() =>
                  setAmountInputDAI(state.stakingBalances.BALANCE_STAKED_BPT_2)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_STAKED_BPT_2,
                  3
                )}{' '}
                BPT staked
              </p>
            </span>

            <span className="DG-button-span">
              {Number(amountInputDAI) ? (
                <Button
                  className="DG-stake-button"
                  id="balances-padding-correct"
                  onClick={() => {
                    props.staking(
                      BPTContract2,
                      Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_2,
                      props.stakingContractPool2,
                      amountInputDAI
                    );
                    setAmountInputDAI('');
                  }}
                >
                  STAKE BPT
                </Button>
              ) : (
                <Button disabled className="DG-stake-button">
                  STAKE BPT
                </Button>
              )}

              {percentagePool2 && Number(amountInputDAI) ? (
                <Button
                  className="DG-stake-button"
                  id="balances-padding-correct"
                  onClick={() => {
                    props.withdrawal(
                      props.stakingContractPool2,
                      amountInputDAI
                    );
                    setAmountInputDAI('');
                  }}
                >
                  UNSTAKE BPT
                </Button>
              ) : (
                <Button disabled className="DG-stake-button">
                  UNSTAKE BPT
                </Button>
              )}
            </span>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default ContentBalancer;
