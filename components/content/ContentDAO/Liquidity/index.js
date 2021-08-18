import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import {
  Loader,
  Popup,
  Icon,
  Button,
  Table,
  Divider,
  Input,
} from 'semantic-ui-react';
import Aux from '../../../_Aux';
import styles from './Liquidity.module.scss';
import axios from 'axios';
import Web3 from 'web3';
import Transactions from '../../../../common/Transactions';
import Images from '../../../../common/Images';
import Global from '../../../Constants';
import Fetch from '../../../../common/Fetch';

const Liquidity = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInputMANA, setAmountInputMANA] = useState('');
  const [amountInputDAI, setAmountInputDAI] = useState('');
  const [amountInput, setAmountInput] = useState('');
  const [percentageUniswap, setPercentageUniswap] = useState(0);
  const [percentagePool, setPercentagePool] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [APYUniswap, setAPYUniswap] = useState(0);
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});
  const [uniswapContract, setUniswapContract] = useState({});
  const [instances, setInstances] = useState(false);

  const [percentagePool1, setPercentagePool1] = useState(0);
  const [percentagePool2, setPercentagePool2] = useState(0);
  const [pool1, setPool1] = useState(true);
  const [pool1USD, setPool1USD] = useState(0);
  const [pool2USD, setPool2USD] = useState(0);
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});
  const [open, setOpen] = useState(false);

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

  // get price USD of DG staked
  useEffect(() => {
    if (props.price && state.DGBalances.BALANCE_STAKING_UNISWAP) {
      const priceUSD = Number(
        props.price * state.DGBalances.BALANCE_STAKING_UNISWAP
      );
      const priceUSDFormatted = props.formatPrice(priceUSD, 2);

      setPriceUSD(priceUSDFormatted);
    }
  }, [props.price, state.DGBalances.BALANCE_STAKING_UNISWAP]);

  // set uniswap APY stat
  useEffect(() => {
    if (
      props.price &&
      state.DGBalances.BALANCE_UNISWAP_ETH &&
      state.DGBalances.BALANCE_UNISWAP_DG
    ) {
      (async () => {
        let json = await Fetch.ETH_PRICE();

        const priceETH = json.market_data.current_price.usd;
        const locked_ETH = state.DGBalances.BALANCE_UNISWAP_ETH * priceETH;
        const locked_DG = state.DGBalances.BALANCE_UNISWAP_DG * props.price;
        const uni_denom = locked_DG + locked_ETH;
        const uni_num = 52 * 225 * props.price;
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

  // set users % of pool staked stat
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

  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Aux>
      <div className="d-flex">
        <div className={cn('d-flex', styles.stake_DG_container)}>
          <div className={styles.lower}>
            <p className={styles.lower_header}>Claim $DG Rewards</p>
            <div className={styles.lower_value}>
              <p className={styles.DG_value}>
                {props.formatPrice(state.DGBalances.BALANCE_STAKING_UNISWAP, 3)}
              </p>
              <img
                style={{ marginTop: '-4px' }}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif"
              />
            </div>
            <p className={styles.price}>
              $
              {(props.price * state.DGBalances.BALANCE_STAKING_UNISWAP).toFixed(
                2
              )}
            </p>

            <p className={styles.lower_text}>
              Provide liquidity to the ETH-$DG Uniswap pool for yield rewards.
            </p>

            <span>
              {Number(state.DGBalances.BALANCE_STAKING_UNISWAP) ? (
                <Button className={styles.lower_button}>
                  onClick={() => props.reward(stakingContractUniswap)}} > Claim
                </Button>
              ) : (
                <Button disabled className={styles.lower_button}>
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div
            className={styles.lower}
            style={{ width: '391px', minWidth: '391px' }}
          >
            <p className={styles.lower_header}> Liquidity Provision</p>

            <p className={styles.apy_text}>Uniswap</p>
            <p className={styles.apy_percent}>ETH-DG</p>

            <div style={{ display: 'flex' }}>
              <span className="gameplay-left-column">
                <span
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingBottom: '17px',
                  }}
                >
                  <p className={styles.apy_text}>APY</p>
                  {APYUniswap ? (
                    <p className="earned-amount stat">{APYUniswap}%</p>
                  ) : (
                    <Loader
                      active
                      inline
                      size="small"
                      style={{
                        fontSize: '12px',
                        marginTop: '5px',
                        marginLeft: '-1px',
                        marginBottom: '-3px',
                      }}
                    />
                  )}
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
                  <p className={styles.apy_text}>% of pool</p>
                  {percentageUniswap ? (
                    <p className="earned-amount">{percentageUniswap}%</p>
                  ) : (
                    <Loader
                      active
                      inline
                      size="small"
                      style={{
                        fontSize: '12px',
                        marginTop: '5px',
                        marginLeft: '-1px',
                        marginBottom: '-3px',
                      }}
                    />
                  )}
                </span>
              </span>
            </div>

            <Input
              className="liquidity-input"
              fluid
              placeholder="Amount"
              value={amountInput}
              onChange={handleChange}
            />

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p
                className={styles.stake_text}
                style={{ textDecoration: 'underline' }}
                onClick={() =>
                  setAmountInput(state.stakingBalances.BALANCE_WALLET_UNISWAP)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_WALLET_UNISWAP,
                  3
                )}{' '}
                DG
              </p>
              <p
                className={styles.stake_text}
                style={{ textDecoration: 'underline' }}
                onClick={() =>
                  setAmountInput(state.stakingBalances.BALANCE_STAKED_UNISWAP)
                }
              >
                {props.formatPrice(
                  state.stakingBalances.BALANCE_STAKED_UNISWAP,
                  3
                )}{' '}
                DG STAKED
              </p>
            </span>

            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              {Number(amountInput) ? (
                <Button
                  className={styles.button_stake}
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
                  Stake
                </Button>
              ) : (
                <Button disabled className={styles.button_stake}>
                  Stake
                </Button>
              )}

              {percentagePool && Number(amountInput) ? (
                <Button
                  className={styles.button_stake}
                  onClick={() => {
                    props.withdrawal(stakingContractUniswap, amountInput);
                    setAmountInput('');
                  }}
                >
                  Unstake
                </Button>
              ) : (
                <Button disabled className={styles.button_stake}>
                  Unstake
                </Button>
              )}
            </span>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default Liquidity;
