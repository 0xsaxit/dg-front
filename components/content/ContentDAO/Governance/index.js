import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Button, Input } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner_updated';
import Aux from '../../../_Aux';
import styles from './Governance.module.scss';
import Web3 from 'web3';
import Transactions from '../../../../common/Transactions';
import Global from '../../../Constants';


const Governance = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakeType, setStakeType] = useState('Stake');
  const [amountInput, setAmountInput] = useState(0);
  const [percentGovernanceStaked, setPercentGovernanceStaked] = useState(0);
  const [percentGovernanceContract, setPercentGovernanceContract] = useState(0);
  const [APYGovernance, setAPYGovernance] = useState(0);
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [instances, setInstances] = useState(false);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function length(obj) {
    return Object.keys(obj).length;
  }

  function handleAmountInputChange(e) {
    setAmountInput(e.target.value);
  }

  // fetch staking contract data
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const stakeContractGovernance =
          await Transactions.stakingContractGovernance(web3);
        setStakeContractGovernance(stakeContractGovernance);

        const DGTokenContract = await Transactions.DGTokenContract(web3);
        setDGTokenContract(DGTokenContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  // set APY stat
  useEffect(() => {
    if (state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) {
      const percentGovernanceContract = (
        (state.stakingBalances.BALANCE_USER_GOVERNANCE /
          state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setPercentGovernanceContract(percentGovernanceContract);

      const APYGovernance = (
        (31285 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setAPYGovernance(APYGovernance);
    }
  }, [state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE]);

  // set % of pool stat
  useEffect(() => {
    if (instances) {
      (async () => {
        const stakedTotal = await Transactions.getTotalSupply(
          stakeContractGovernance
        );

        if (stakedTotal) {
          const percentGovernanceStaked =
            (state.stakingBalances.BALANCE_USER_GOVERNANCE / stakedTotal) * 100;

          setPercentGovernanceStaked(percentGovernanceStaked);
        } else {
          setPercentageGov(0);
        }
      })();
    }
  }, [instances, state.stakingBalances.BALANCE_USER_GOVERNANCE]);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  return (
    <Aux>
      <div>
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
                {props.formatPrice(state.DGBalances.BALANCE_STAKING_GOVERNANCE, 3)}
              </p>
              <img
                style={{ marginTop: '-4px' }}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif"
              />
            </div>
            <p className={styles.price}>
              ${props.formatPrice((props.price * state.DGBalances.BALANCE_STAKING_GOVERNANCE).toFixed(2), 2)}
            </p>

            <p className={styles.lower_text}>
              Stake $DG to govern the treasury, vote on proposals, and earn
              yields.
            </p>

            <span>
              {Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) ? (
                <Button
                  className={styles.lower_button}
                  onClick={() => {
                    props.reward(stakeContractGovernance);

                    //Show Toast Message2
                    const msg = 'Claiming Governance DG!';
                    dispatch({
                      type: 'show_toastMessage',
                      data: msg,
                    });

                  }}
                >
                  Claim {state.DGBalances.BALANCE_STAKING_GOVERNANCE} $DG
                </Button>
              ) : (
                <Button
                  disabled
                  className={styles.lower_button}
                >
                  Claim {state.DGBalances.BALANCE_STAKING_GOVERNANCE} $DG
                </Button>
              )}
            </span>
          </div>

          <div className={styles.lower} style={{ width: '500px', minWidth: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className={styles.type_div}>
              <div
                className={stakeType === 'Stake' ? styles.active : null}
                onClick={() => {
                  setStakeType('Stake');
                }}
              >
                Stake
              </div>
              <div
                className={stakeType === 'Unstake' ? styles.active : null}
                onClick={() => {
                  setStakeType('Unstake');
                }}
              >
                Unstake
              </div>
            </div>

            <p className={styles.lower_header}> New Governance Staking</p>
            <p className={styles.apy_text}>Your DG {stakeType === 'Stake' ? 'Staked' : 'Unstaked'}</p>
            <p className={styles.apy_percent}>
              { }
              {stakeType === 'Stake' ?
                props.formatPrice(state.stakingBalances.BALANCE_USER_GOVERNANCE, 2)
                : props.formatPrice(state.DGBalances.BALANCE_ROOT_DG, 2)
              }
              <br />
              <abbr>${props.formatPrice((stakeType === 'Stake' ? state.stakingBalances.BALANCE_USER_GOVERNANCE : state.DGBalances.BALANCE_ROOT_DG) * state.DGPrices.dg, 2)}</abbr>
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
                  <p className={styles.apy_text}>Gov Staking APY</p>
                  {APYGovernance ? (
                    <p className="earned-amount stat">{APYGovernance}%</p>
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
                    onChange={handleAmountInputChange}
                    style={{
                      minWidth: `${5 + (amountInput.toString().length + 1) * 12}px`,
                      maxWidth: `${5 + (amountInput.toString().length + 1) * 12}px`
                    }}
                  />
                </div>

                <Button
                  className={styles.max_button}
                  onClick={() => {
                    setAmountInput(state.DGBalances.BALANCE_ROOT_DG);
                  }}
                >
                  MAX
                </Button>

                <div className={styles.description}>
                  <h4 className={amountInput <= state.DGBalances.BALANCE_ROOT_DG ? styles.success : styles.error}>
                    {props.formatPrice(stakeType === 'Stake' ? state.DGBalances.BALANCE_ROOT_DG : state.stakingBalances.BALANCE_USER_GOVERNANCE, 3)}
                    &nbsp;DG Available to&nbsp;
                    {stakeType}
                  </h4>
                  <p>On ETH Mainnet</p>
                </div>
              </div>

              <div className={styles.button_div}>
                {stakeType === 'Stake' ? (
                  <Button
                    className={styles.button_blue}
                    onClick={() => {
                      props.staking(
                        DGTokenContract,
                        Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS,
                        stakeContractGovernance,
                        amountInput
                      );
                      setAmountInput('');
                    }}
                    disabled={amountInput <= 0 || amountInput > state.DGBalances.BALANCE_ROOT_DG ? true : false}
                  >
                    {stakeType} {amountInput > 0 ? amountInput : ''} DG
                  </Button>
                ) : (
                  <Button
                    className={styles.button_blue}
                    onClick={() => {
                      props.withdrawal(stakeContractGovernance, amountInput);
                      setAmountInput('');
                    }}
                    disabled={amountInput <= 0 || amountInput > state.stakingBalances.BALANCE_USER_GOVERNANCE ? true : false}
                  >
                    {stakeType} {amountInput > 0 ? amountInput : ''} DG
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
}

export default Governance;