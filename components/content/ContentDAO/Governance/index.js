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

const Governance = props => {
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
        <div className="row">
          <div className={cn('col-xl-8 d-flex pt-10', styles.left_panel)}>
            <div className="mx-auto d-flex flex-column">
              <p className={styles.welcome_text}>Welcome to New DG Staking</p>
              <p className={styles.welcome_content}>Governance Staking</p>
              <div className={cn(styles.blue_container, 'd-flex flex-column')}>
                <div className="d-flex">
                  <div className={styles.blue_text}>
                    <p className={styles.blue_header}>
                      DG Has a New <br /> Token. Swap Now!
                    </p>
                    <p className={styles.blue_lower}>
                      Swap to the new DG to take advantage of autoclaiming and
                      higher gov APR!
                    </p>
                  </div>
                  <img
                    className={styles.blue_img}
                    src="/images/doubleDG.png"
                    alt="double dg logo"
                  />
                </div>
                <div className="d-flex">
                  <Button
                    className={cn(styles.button, styles.blue)}
                    onClick={() => {
                      router.push('/dg/governance');
                    }}
                  >
                    Swap Now
                  </Button>
                  <Button
                    className={cn(styles.button, styles.grey)}
                    onClick={() => {
                      router.push('/dg/governance');
                    }}
                  >
                    Learn More
                  </Button>
                </div>
                <div className={styles.close_button}>
                  <svg
                    width="14"
                    height="13"
                    viewBox="0 0 14 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.18262 10.8501C0.772461 11.2676 0.750488 12.0366 1.19727 12.4761C1.64404 12.9229 2.40576 12.9082 2.82324 12.4907L6.9541 8.35986L11.0776 12.4834C11.5098 12.9229 12.2568 12.9155 12.6963 12.4688C13.1431 12.0293 13.1431 11.2822 12.7109 10.8501L8.5874 6.72656L12.7109 2.5957C13.1431 2.16357 13.1431 1.4165 12.6963 0.977051C12.2568 0.530273 11.5098 0.530273 11.0776 0.962402L6.9541 5.08594L2.82324 0.955078C2.40576 0.544922 1.63672 0.522949 1.19727 0.969727C0.757812 1.4165 0.772461 2.17822 1.18262 2.5957L5.31348 6.72656L1.18262 10.8501Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <div className={cn('d-flex', styles.stake_DG_container)}>
                <div className={cn(styles.lower, styles.panel)}>
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
                  <p className={styles.apy_text}>Your DG Staked</p>
                  <p className={styles.apy_percent}>
                    {props.formatPrice(
                      state.stakingBalances.BALANCE_USER_GOVERNANCE,
                      2
                    )}
                    <br />
                    <abbr>
                      $
                      {props.formatPrice(
                        state.stakingBalances.BALANCE_USER_GOVERNANCE *
                          state.DGPrices.dg,
                        2
                      )}
                    </abbr>
                  </p>

                  <div className="d-flex w-75">
                    <span className="d-flex justify-content-center w-50">
                      <span className="d-flex flex-column align-items-center pb-3">
                        <p className={styles.apy_text}>Gov Staking APY</p>
                        {APYGovernance ? (
                          <p className="earned-amount stat">{APYGovernance}%</p>
                        ) : (
                          <Spinner width={33} height={33} />
                        )}
                      </span>
                    </span>

                    <span className="d-flex justify-content-center w-50">
                      <span className="d-flex flex-column align-items-center">
                        <p className={styles.apy_text}>Your DG Yielded</p>
                        <p className="earned-amount stat">0</p>
                      </span>
                    </span>
                  </div>

                  <div className={styles.content}>
                    <div className={styles.contract_div}>
                      <div className={styles.content}>
                        <img
                          className={styles.dg}
                          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
                          alt="DG"
                        />
                        <input
                          type="number"
                          className={styles.dg_input}
                          value={amountInput.toString()}
                          onChange={handleAmountInputChange}
                          style={{
                            minWidth: `${
                              5 + (amountInput.toString().length + 1) * 12
                            }px`,
                            maxWidth: `${
                              5 + (amountInput.toString().length + 1) * 12
                            }px`,
                          }}
                        />
                      </div>

                      <Button
                        className={styles.max_button}
                        onClick={() => {
                          setAmountInput(
                            props.formatPrice(
                              stakeType === 'Stake'
                                ? state.DGBalances.BALANCE_ROOT_DG
                                : state.stakingBalances.BALANCE_USER_GOVERNANCE,
                              3
                            )
                          );
                        }}
                      >
                        MAX
                      </Button>

                      <div className={styles.description}>
                        <h4
                          className={
                            amountInput <= state.DGBalances.BALANCE_ROOT_DG
                              ? styles.success
                              : styles.error
                          }
                        >
                          {props.formatPrice(
                            stakeType === 'Stake'
                              ? state.DGBalances.BALANCE_ROOT_DG
                              : state.stakingBalances.BALANCE_USER_GOVERNANCE,
                            3
                          )}
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
                          disabled={
                            amountInput <= 0 ||
                            amountInput > state.DGBalances.BALANCE_ROOT_DG
                              ? true
                              : false
                          }
                        >
                          {stakeType} {amountInput > 0 ? amountInput : ''} DG
                        </Button>
                      ) : (
                        <Button
                          className={styles.button_blue}
                          onClick={() => {
                            props.withdrawal(
                              stakeContractGovernance,
                              amountInput
                            );
                            setAmountInput('');
                          }}
                          disabled={
                            amountInput <= 0 ||
                            parseFloat(amountInput.toString(), 10) >
                              state.stakingBalances.BALANCE_USER_GOVERNANCE
                              ? true
                              : false
                          }
                        >
                          {stakeType} {amountInput > 0 ? amountInput : ''} DG
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-4 d-flex pt-xl-10 flex-column">
            <div className="mx-auto">
              <p className={styles.welcome_content}>(Old) $DG Staked</p>
              <div className={cn(styles.lower, 'mx-auto')}>
                <p className={styles.lower_header}>Claim $DG Rewards</p>
                <div className={styles.lower_value}>
                  <p className={styles.DG_value}>
                    {props.formatPrice(
                      state.DGBalances.BALANCE_STAKING_GOVERNANCE,
                      3
                    )}
                  </p>
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624411671/Spinning-Logo-DG_n9f4xd.gif" />
                </div>
                <p className={styles.price}>
                  $
                  {props.formatPrice(
                    (
                      props.price * state.DGBalances.BALANCE_STAKING_GOVERNANCE
                    ).toFixed(2),
                    2
                  )}
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
                    <Button disabled className={styles.lower_button}>
                      Claim {state.DGBalances.BALANCE_STAKING_GOVERNANCE} $DG
                    </Button>
                  )}
                </span>
              </div>

              <div className={cn(styles.lower, 'mx-auto mt-4')}>
                <p className={styles.lower_header}>(Old) $DG Staked</p>
                <video
                  src="https://res.cloudinary.com/dnzambf4m/video/upload/v1626798440/Wallet_1_k0dqit.webm"
                  className={styles.lower_img}
                  type="video/mp4"
                  frameBorder="0"
                  autoPlay={true}
                  loop
                  muted
                ></video>
                <p className={styles.staked_label}>$DG Staked</p>

                <div className={styles.lower_value}>
                  <p className={styles.DG_value}>
                    {state.DGBalances.BALANCE_STAKING_GOVERNANCE} $DG
                  </p>
                </div>

                <p className={styles.lower_text}>
                  Migrate to the new DG for auto claiming and higher gov yields.
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
                      Migrate to New DG
                    </Button>
                  ) : (
                    <Button disabled className={styles.lower_button}>
                      Migrate to New DG
                    </Button>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Aux>
  );
};

export default Governance;
