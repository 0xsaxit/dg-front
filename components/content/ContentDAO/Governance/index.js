import cn from 'classnames';
import { useEffect, useContext, useState, React } from 'react';
import { GlobalContext } from '../../../../store';
import { Loader, Popup, Icon, Button, Table, Divider, Input } from 'semantic-ui-react';
import Aux from '../../../_Aux';
import styles from './Governance.module.scss';
import axios from 'axios';
import Web3 from 'web3';
import Transactions from '../../../../common/Transactions';
import Images from '../../../../common/Images';
import Global from '../../../Constants';


const Governance = (props) => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amountInput, setAmountInput] = useState('');
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

  function handleChange(e) {
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

          <div className={styles.lower} style={{ width: '391px', minWidth: '391px' }}>
            <p className={styles.lower_header}> Governance Staking</p>
              <p className={styles.apy_text}>Total $DG Staked</p>
              {state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE ? (
                <p className={styles.apy_percent}>
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE,
                    0
                  )}
                </p>
              ) : (
                <Loader
                  active
                  inline
                  size="small"
                  style={{
                    fontSize: '12px',
                    marginTop: '5px',
                    marginBottom: '-2px',
                  }}
                />
              )}

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
                    {APYGovernance ? (
                      <p className="earned-amount stat">{APYGovernance}%</p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
                          marginBottom: '-2px',
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
                    {percentGovernanceContract ? (
                      <p className="earned-amount stat">
                        {percentGovernanceContract}%
                      </p>
                    ) : (
                      <Loader
                        active
                        inline
                        size="small"
                        style={{
                          fontSize: '12px',
                          marginTop: '5px',
                          marginLeft: '-1px',
                          marginBottom: '-2px',
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
                  onClick={() => setAmountInput(state.DGBalances.BALANCE_ROOT_DG)}
                >
                  {props.formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)} DG
                </p>
                <p
                  className={styles.stake_text} 
                  style={{ textDecoration: 'underline' }}
                  onClick={() =>
                    setAmountInput(state.stakingBalances.BALANCE_USER_GOVERNANCE)
                  }
                >
                  {props.formatPrice(
                    state.stakingBalances.BALANCE_USER_GOVERNANCE,
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
                        DGTokenContract,
                        Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS,
                        stakeContractGovernance,
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

                {percentGovernanceStaked && Number(amountInput) ? (
                  <Button
                    className={styles.button_stake}
                    onClick={() => {
                      props.withdrawal(stakeContractGovernance, amountInput);
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
}

export default Governance;