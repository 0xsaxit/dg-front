import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner_updated';
import Aux from '../../../_Aux';
import styles from './Liquidity.module.scss';
import Web3 from 'web3';
import Transactions from '../../../../common/Transactions';
import Fetch from '../../../../common/Fetch';

const Liquidity = props => {
  // get the treasury's balances numbers from the Context API store
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
        const uni_num = 6518 * props.price;
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
      <div>
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
                <Button
                  className={styles.lower_button}
                  onClick={() => {
                    props.reward(stakingContractUniswap);

                    //Show Toast Message3
                    const msg = 'Claiming Liquidity DG!';
                    dispatch({
                      type: 'show_toastMessage',
                      data: msg,
                    });
                  }}
                >
                  Claim
                </Button>
              ) : (
                <Button
                  disabled
                  className={styles.lower_button}
                  onClick={() => {
                    //Show Toast Message3
                    const msg = 'Claiming Liquidity DG!';
                    dispatch({
                      type: 'show_toastMessage',
                      data: msg,
                    });
                  }}
                >
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className={styles.lower} style={{ width: '500px', minWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <p className={styles.lower_header}>Liquidity Provision</p>
            <p className={styles.apy_text}>Your DG Staked</p>
            <p className={styles.apy_percent}>
              { }
              {props.formatPrice(state.stakingBalances.BALANCE_STAKED_UNISWAP, 3)}
              <br />
              <abbr>${props.formatPrice(state.stakingBalances.BALANCE_STAKED_UNISWAP * state.DGPrices.dg, 2)}</abbr>
            </p>

            <div style={{ display: 'flex', width: '80%' }}>
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
                    paddingBottom: '17px',
                  }}
                >
                  <p className={styles.apy_text}>Uniswap Staking APY</p>
                  {APYUniswap ? (
                    <p className="earned-amount stat">{APYUniswap}%</p>
                  ) : (
                    <Spinner
                      width={33}
                      height={33}
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
                  <p className={styles.apy_text}>Your DG Yielded</p>
                  <p className="earned-amount stat">0</p>
                </span>
              </span>
            </div>

            <div className={styles.content}>
              <div className={styles.contract_div}>
                <div className={styles.content}>
                  <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                  <input
                    type="number"
                    className={styles.dg_input}
                    value={amountInput.toString()}
                    onChange={handleChange}
                    style={{
                      minWidth: `${5 + (amountInput.toString().length + 1) * 12}px`,
                      maxWidth: `${5 + (amountInput.toString().length + 1) * 12}px`
                    }}
                  />
                </div>

                <Button
                  className={styles.max_button}
                  onClick={() => {
                    setAmountInput(props.formatPrice(state.stakingBalances.BALANCE_STAKED_UNISWAP, 3));
                  }}
                >
                  MAX
                </Button>
              </div>

              <div className={styles.button_div}>
                <Button
                  className={styles.button_blue}
                  onClick={() => {
                    props.withdrawal(stakingContractUniswap, amountInput);
                    setAmountInput('');
                  }}
                  disabled={amountInput <= 0 || parseFloat(amountInput.toString(), 10) > state.stakingBalances.BALANCE_STAKED_UNISWAP ? true : false}
                >
                  Unstake {amountInput > 0 ? amountInput : ''} DG
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Aux >
  );
};

export default Liquidity;
