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
  const [snapshotOne, setSnapshotOne] = useState([]);
  const [dateOne, setDateOne] = useState('');
  const [snapshotTwo, setSnapshotTwo] = useState([]);
  const [dateTwo, setDateTwo] = useState('');
  const [snapshotThree, setSnapshotThree] = useState([]);
  const [dateThree, setDateThree] = useState('');
  const [snapshotFour, setSnapshotFour] = useState([]);
  const [dateFour, setDateFour] = useState('');
  const [activeOne, setActiveOne] = useState('');
  const [activeTwo, setActiveTwo] = useState('');
  const [activeThree, setActiveThree] = useState('');
  const [activeFour, setActiveFour] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const [amountInput, setAmountInput] = useState('');
  const [percentGovernanceStaked, setPercentGovernanceStaked] = useState(0);
  const [percentGovernanceContract, setPercentGovernanceContract] = useState(0);
  const [APYGovernance, setAPYGovernance] = useState(0);
  const [priceUSD, setPriceUSD] = useState(0);
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [instances, setInstances] = useState(false);


  useEffect(() => {
    (async () => {
      const snapshotData = await axios.post(
        `https://hub.snapshot.org/graphql`,
        {
          query: `{
            proposals (
              first: 4,
              skip: 0,
              where: {
                space_in: ["decentralgames.eth"],
                state: ""
              },
              orderBy: "created",
              orderDirection: desc
            ) {
              id
              title
              body
              choices
              start
              end
              snapshot
              state
              author
              space {
                id
                name
              }
            }
          }`,
        }
      );

      setSnapshotOne(snapshotData.data.data.proposals[0]);
      setSnapshotTwo(snapshotData.data.data.proposals[1]);
      setSnapshotThree(snapshotData.data.data.proposals[2]);
      setSnapshotFour(snapshotData.data.data.proposals[3]);
    })();
  }, []);

  useEffect(() => {
    const temp = new Date(snapshotOne.end * 1000);
    setDateOne(temp.toDateString());

    const temp_two = new Date(snapshotTwo.end * 1000);
    setDateTwo(temp_two.toDateString());

    const temp_three = new Date(snapshotThree.end * 1000);
    setDateThree(temp_three.toDateString());

    const temp_four = new Date(snapshotFour.end * 1000);
    setDateFour(temp_four.toDateString());

    var today = new Date();
    
    if (temp < today) {
      setActiveOne(true);
    }

    if (temp_two < today) {
      setActiveTwo(true);
    }

    if (temp_three < today) {
      setActiveThree(true);
    }

    if (temp_four < today) {
      setActiveFour(true);
    }

  }, [snapshotOne, snapshotTwo, snapshotThree, snapshotFour, currentDate]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function length(obj) {
    return Object.keys(obj).length;
  }

  function handleChange(e) {
    setAmountInput(e.target.value);
  }

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

  useEffect(() => {
    if (state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) {
      const percentGovernanceContract = (
        (state.stakingBalances.BALANCE_USER_GOVERNANCE /
          state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setPercentGovernanceContract(percentGovernanceContract);

      const APYGovernance = (
        (41714 / state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE) *
        100
      ).toFixed(2);

      setAPYGovernance(APYGovernance);
    }
  }, [state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE]);

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

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

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
                {formatPrice(state.DGBalances.BALANCE_STAKING_GOVERNANCE, 3)}
              </p>
              <img 
                style={{ marginTop: '-4px' }}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif" 
                />
            </div>
            <p className={styles.price}>
              ${(props.price * state.DGBalances.BALANCE_STAKING_GOVERNANCE).toFixed(2)}
            </p>

            <p className={styles.lower_text}>
              Stake $DG to govern the treasury, vote on proposals, and earn
              yields.
            </p>

            <span>
              {Number(state.DGBalances.BALANCE_STAKING_GOVERNANCE) ? (
                <Button className={styles.lower_button}>
                  onClick={() => props.reward(stakeContractGovernance)}
                }
                >
                  Claim
                </Button>
              ) : (
                <Button disabled className={styles.lower_button}>
                  Claim
                </Button>
              )}
            </span>
          </div>

          <div className={styles.lower} style={{ width: '391px' }}>
            <p className={styles.lower_header}> Governance Staking</p>

              <p className={styles.apy_text}>Total $DG Staked</p>
              {state.stakingBalances.BALANCE_CONTRACT_GOVERNANCE ? (
                <p className={styles.apy_percent}>
                  {formatPrice(
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
                  className={styles.apy_text} 
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.5)' }}
                  onClick={() => setAmountInput(state.DGBalances.BALANCE_ROOT_DG)}
                >
                  {formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3)} DG
                </p>
                <p
                  className={styles.apy_text} 
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.5)' }}
                  onClick={() =>
                    setAmountInput(state.stakingBalances.BALANCE_USER_GOVERNANCE)
                  }
                >
                  {formatPrice(
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