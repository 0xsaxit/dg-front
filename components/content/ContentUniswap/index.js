import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store';
import Web3 from 'web3';
import { Button, Divider, Loader, Icon, Input, Modal } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import Images from 'common/Images';
import Fetch from 'common/Fetch';
import Transactions from 'common/Transactions';
import Global from 'components/Constants';

import styles from './ContentUniswap.module.scss';

const ContentUniswap = props => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInput, setAmountInput] = useState('');
  const [percentageUniswap, setPercentageUniswap] = useState(0);
  const [percentagePool, setPercentagePool] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [APYUniswap, setAPYUniswap] = useState(0);
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});
  const [uniswapContract, setUniswapContract] = useState({});
  const [instances, setInstances] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakingContractUniswap =
          await Transactions.stakingContractUniswap(web3);
        setStakingContractUniswap(stakingContractUniswap);

        const uniswapContract = await Transactions.uniswapContract(web3);
        setUniswapContract(uniswapContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_STAKING_UNISWAP) {
      const priceUSD = Number(
        props.price * state.DGBalances.BALANCE_STAKING_UNISWAP
      );
      const priceUSDFormatted = props.formatPrice(priceUSD, 2);

      setPriceUSD(priceUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_STAKING_UNISWAP]);

  useEffect(() => {
    if (
      props.price &&
      state.DGBalances.BALANCE_UNISWAP_ETH &&
      state.DGBalances.BALANCE_UNISWAP_DG
    ) {
      (async () => {
        let response = await Fetch.ETH_PRICE();
        let json = await response.json();

        const priceETH = json.market_data.current_price.usd;
        const locked_ETH = state.DGBalances.BALANCE_UNISWAP_ETH * priceETH;
        const locked_DG = state.DGBalances.BALANCE_UNISWAP_DG * props.price;
        const uni_denom = locked_DG + locked_ETH;
        const uni_num = 51 * 225 * props.price;
        const uni_APY_temp = (uni_num / uni_denom) * 100;
        const APYUniswap = Number(uni_APY_temp).toFixed(2);

        setAPYUniswap(APYUniswap);
      })();
    }
  }, [
    props.price,
    state.DGBalances.BALANCE_UNISWAP_ETH,
    state.DGBalances.BALANCE_UNISWAP_DG,
  ]);

  useEffect(() => {
    if (
      state.stakingBalances.BALANCE_STAKED_UNISWAP &&
      state.stakingBalances.BALANCE_CONTRACT_UNISWAP
    ) {
      const percentageUniswap = Number(
        (state.stakingBalances.BALANCE_STAKED_UNISWAP /
          state.stakingBalances.BALANCE_CONTRACT_UNISWAP) *
          100
      ).toFixed(2);

      setPercentageUniswap(percentageUniswap);
    }
  }, [
    state.stakingBalances.BALANCE_STAKED_UNISWAP,
    state.stakingBalances.BALANCE_CONTRACT_UNISWAP,
  ]);

  useEffect(() => {
    if (instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          stakingContractUniswap
        );

        if (stakedTotal) {
          const percentagePool =
            state.stakingBalances.BALANCE_STAKED_UNISWAP / stakedTotal;

          setPercentagePool(percentagePool);
        } else {
          setPercentagePool(0);
        }
      })();
    }
  }, [instances, state.stakingBalances.BALANCE_STAKED_UNISWAP]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const handleChange = (e) => {
    setAmountInput(e.target.value);
  }

  const contentUniswap = () => {
    return (
      <Aux>
        <div className={styles.content_uniswap_container}>
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
                  {state.DGBalances.BALANCE_STAKING_UNISWAP ? (
                    <p className={styles.earned_amount}>
                      {props.formatPrice(
                        state.DGBalances.BALANCE_STAKING_UNISWAP,
                        3
                      )}
                    </p>
                  ) : (
                    <Loader
                      className={styles.dg_balanace_loader}
                      active
                      inline
                      size="small"
                    />
                  )}
                </span>
              </span>

              <Divider className={styles.divdier_dg_top} />

              <span className={styles.dg_flex_justify_content_space_between}>
                <p className={styles.welcome_text}>
                  {' '}
                  TOTAL USD{' '}
                </p>
                <p className={styles.earned_amount}> ${priceUSD} </p>
              </span>

              <Divider className={styles.divider_dg_top} />

              <p className={styles.dg_column_body}>
                Receive $DG for liquidity provision in the 50/50 ETH-DG Uniswap
                pool by staking the LP tokens on this dashboard.
                <a
                  className={styles.dg_column_body_href}
                  href="https://decentral-games-1.gitbook.io/dg/governance-1"
                  target="_blank"
                >
                  {' '}
                  Read more
                </a>
                .
              </p>

              <Divider className={styles.divider_dg_top} />

              <span className={styles.dg_button_span}>
                {Number(state.DGBalances.BALANCE_STAKING_UNISWAP) ? (
                  <Button
                    className={styles.dg_claim_button}
                    id="balances-padding-correct"
                    onClick={() => props.reward(stakingContractUniswap)}
                  >
                    Claim
                  </Button>
                ) : (
                  <Button disabled className={styles.dg_claim_button}>
                    Claim
                  </Button>
                )}
              </span>
            </div>

            <div className={styles.dg_tablet_container_gov}>
              <div className={styles.dg_column_treasury_two}>
                <p className={styles.earned_amount}>
                  Liquidity Provision
                </p>

                <Divider className={styles.divider_dg_top} />

                <span className={styles.dg_flex}>
                  <img className={styles.farming_logo_small} src={Images.ETH_CIRCLE} />
                  <img
                    className={styles.farming_logo_small_two}
                    src={Images.DG_COIN_LOGO}
                    alt="Decentral Games Coin Logo"
                  />
                  <span className={styles.farming_pool_span}>
                    <p className={styles.welcome_text_top}>Uniswap</p>
                    <p className={styles.earned_amount}>ETH-DG</p>
                  </span>
                </span>

                <span className={styles.dg_flex_justify_content_end}>
                  <a
                    className={styles.dg_column_body_margin}
                    href={`https://info.uniswap.org/pair/${Global.ADDRESSES.UNISWAP_ADDRESS_STAKING}`}
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
                  <div className={styles.gameplay_left_column}>
                    <span className={styles.gameplay_left_column_text}>
                      <p className={styles.earned_text}>APY</p>
                      {APYUniswap ? (
                        <p className={styles.earned_amount}>{APYUniswap}%</p>
                      ) : (
                        <Loader
                          className={styles.dg_balance_loader}
                          active
                          inline
                          size="small"
                        />
                      )}
                    </span>
                  </div>

                  <div className={styles.gameplay_right_column}>
                    <span className={styles.gameplay_left_column_text}>
                      <p className={styles.earned_text}>% of pool</p>
                      <p className={styles.earned_amount}>
                        {percentageUniswap ? (
                          <p className={styles.earned_amount}>{percentageUniswap}%</p>
                        ) : (
                          <Loader
                            className={styles.dg_balanace_loader}
                            active
                            inline
                            size="small"
                          />
                        )}
                      </p>
                    </span>
                  </div>
                </div>

                <Divider className={styles.divider_dg_top} />

                <Input
                  className={styles.liquidity_input}
                  fluid
                  placeholder="Amount"
                  value={amountInput}
                  onChange={handleChange}
                />

                <span className={styles.dg_flex_justify_content_space_between}>
                  <p
                    className={styles.bpt_text}
                    onClick={() =>
                      setAmountInput(state.stakingBalances.BALANCE_WALLET_UNISWAP)
                    }
                  >
                    {props.formatPrice(
                      state.stakingBalances.BALANCE_WALLET_UNISWAP,
                      3
                    )}{' '}
                    UNI-V2
                  </p>
                  <p
                    className={styles.bpt_text}
                    onClick={() =>
                      setAmountInput(state.stakingBalances.BALANCE_STAKED_UNISWAP)
                    }
                  >
                    {props.formatPrice(
                      state.stakingBalances.BALANCE_STAKED_UNISWAP,
                      3
                    )}{' '}
                    UNI-V2 staked
                  </p>
                </span>

                <span className={styles.dg_button_span}>
                  {Number(amountInput) ? (
                    <Button
                      className={styles.dg_stake_button}
                      id="balances-padding-correct"
                      onClick={() => {
                        props.staking(
                          uniswapContract,
                          Global.ADDRESSES.DG_STAKING_UNISWAP_ADDRESS,
                          stakingContractUniswap,
                          amountInput
                        );
                        setAmountInput('');
                      }}
                    >
                      Stake Uni V2
                    </Button>
                  ) : (
                    <Button disabled className={styles.dg_stake_button}>
                      Stake Uni v2
                    </Button>
                  )}

                  {percentagePool && Number(amountInput) ? (
                    <Button
                      className={styles.dg_stake_button}
                      id="balances-padding-correct"
                      onClick={() => {
                        props.withdrawal(stakingContractUniswap, amountInput);
                        setAmountInput('');
                      }}
                    >
                      Unstake Uni v2
                    </Button>
                  ) : (
                    <Button disabled className={styles.dg_stake_button}>
                      Unstake Uni v2
                    </Button>
                  )}
                </span>
              </div>

              <div className={styles.dg_column_blank} />
            </div>
          </div>
        </div>
      </Aux>
    );
  }

  return contentUniswap();
};

export default ContentUniswap;
