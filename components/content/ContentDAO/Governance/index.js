import cn from 'classnames';
import BigNumber from 'bignumber.js';
import { useEffect, useContext, useState, React } from 'react';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner_updated';
import { GlobalContext } from '../../../../store';
import styles from './Governance.module.scss';
import Transactions from '../../../../common/Transactions';
import Global from '../../../Constants';
import Constants from '../../../Constants';

const Governance = props => {
  // get the treasury's balances numbers from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakeType, setStakeType] = useState('Stake');
  const [amountInput, setAmountInput] = useState(0);
  const [DGLightTokenContract, setDGLightTokenContract] = useState({});
  const [DGTownHallContract, setDGTownHallContract] = useState({});
  const [apy, setAPY] = useState('');
  const [stakedBalance, setStakedBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [approving, setApproving] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  function handleAmountInputChange(e) {
    setAmountInput(Number(e.target.value));
  }

  // fetch staking contract data
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const [_DGLightTokenContract, _DGTownHallContract] = await Promise.all([
          Transactions.DGLightTokenContract(web3),
          Transactions.DGTownHallContract(web3),
        ]);

        const [balance, _stakedBalance] = [
          await _DGTownHallContract.methods.innerSupply().call(),
          await _DGTownHallContract.methods.DGAmount(state.userAddress).call(),
        ];

        setDGLightTokenContract(_DGLightTokenContract);
        setDGTownHallContract(_DGTownHallContract);
        setStakedBalance(_stakedBalance);

        setAPY(
          BigNumber(7821000000)
            .div(BigNumber(balance))
            .multipliedBy(Constants.CONSTANTS.FACTOR)
            .toString()
        );
      }

      fetchData();
    }
  }, [state.userStatus]);

  async function staking() {
    const { amountAdjusted, amountToString } = props.getAmounts(amountInput);

    try {
      const amountAllowance = await DGLightTokenContract.methods
        .allowance(state.userAddress, DGTownHallContract._address)
        .call();

      if (Number(amountAllowance) < amountAdjusted) {
        await DGLightTokenContract.methods
          .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: state.userAddress })
          .on('transactionHash', function (hash) {
            setApproving(true);
          })
          .on('confirmation', function (confirmation, receipt) {
            setApproving(false);
          });

        dispatch({
          type: 'show_toastMessage',
          data: 'DG approved successfully!',
        });
      }

      await DGTownHallContract.methods
        .stepInside(amountToString)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
        });

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'DG staked successfully!',
      });
    } catch (error) {
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to stake DG!',
      });
    }
  }

  async function unstaking() {
    const { amountAdjusted, amountToString } = props.getAmounts(amountInput);

    try {
      const amountAllowance = await DGLightTokenContract.methods
        .allowance(state.userAddress, DGTownHallContract._address)
        .call();

      if (Number(amountAllowance) < amountAdjusted) {
        await DGLightTokenContract.methods
          .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: state.userAddress })
          .on('transactionHash', function (hash) {
            setApproving(true);
          })
          .on('confirmation', function (confirmation, receipt) {
            console.log('approve() transaction completed');
            setApproving(false);
          });

        dispatch({
          type: 'show_toastMessage',
          data: 'DG approved successfully!',
        });
      }

      await DGTownHallContract.methods
        .stepOutside(amountToString)
        .send({ from: state.userAddress })
        .on('transactionHash', function (hash) {
          setLoading(true);
        })
        .on('confirmation', function (confirmation, receipt) {
          setLoading(false);
        });

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
      dispatch({
        type: 'show_toastMessage',
        data: 'DG unstaked successfully!',
      });
    } catch (error) {
      setLoading(false);
      setApproving(false);

      dispatch({
        type: 'show_toastMessage',
        data: 'Failed to unstake DG!',
      });
    }
  }

  return (
    <div>
      <div className={styles.left_panel}>
        <p className={styles.welcome_text}>Welcome to DG Governance</p>
        <p className={styles.welcome_content}>
          When you stake DG in governance, you receive xDG, a token which
          represents your share in the governance. In return, you can make
          proposals and vote on the future of the DAO, earn autocompounding APR,
          and get access to ICE Wearable mints.
        </p>
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

            <p className={cn(styles.lower_header, 'mb-3')}>
              New Governance Staking
            </p>

            <div className="d-flex w-100 mb-5">
              <span className="d-flex justify-content-center w-50">
                <span className="d-flex flex-column align-items-center pb-3">
                  <p className={styles.apy_text}>Your Staked DG Value</p>
                  {stakedBalance ? (
                    <p className={styles.apy_percent}>
                      {props.formatPrice(
                        new BigNumber(stakedBalance)
                          .div(new BigNumber(10).pow(18))
                          .toString()
                      )}
                    </p>
                  ) : (
                    <Spinner width={33} height={33} />
                  )}
                </span>
              </span>

              <span className="d-flex justify-content-center w-50">
                <span className="d-flex flex-column align-items-center pb-3">
                  <p className={styles.apy_text}>Gov Staking APY</p>
                  {apy ? (
                    <p className={styles.apy_percent}>{apy}%</p>
                  ) : (
                    <Spinner width={33} height={33} />
                  )}
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
                      stakeType === 'Stake'
                        ? state.DGBalances.BALANCE_ROOT_DG_LIGHT
                        : state.stakingBalances.BALANCE_USER_GOVERNANCE
                    );
                  }}
                >
                  MAX
                </Button>

                <div className={styles.description}>
                  <h4
                    className={
                      Number(amountInput) <=
                      Number(
                        stakeType === 'Stake'
                          ? state.DGBalances.BALANCE_ROOT_DG_LIGHT
                          : state.stakingBalances.BALANCE_USER_GOVERNANCE
                      )
                        ? styles.success
                        : styles.error
                    }
                  >
                    {props.formatPrice(
                      stakeType === 'Stake'
                        ? state.DGBalances.BALANCE_ROOT_DG_LIGHT
                        : state.stakingBalances.BALANCE_USER_GOVERNANCE,
                      3
                    )}
                    &nbsp;{stakeType === 'Stake' ? '' : 'x'}DG Available
                    to&nbsp;
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
                      staking();
                      setAmountInput('');
                    }}
                    disabled={
                      approving ||
                      loading ||
                      Number(amountInput) <= 0 ||
                      Number(amountInput) >
                        Number(state.DGBalances.BALANCE_ROOT_DG_LIGHT)
                        ? true
                        : false
                    }
                  >
                    {approving || loading ? (
                      <Spinner width={33} height={33} />
                    ) : null}
                    &nbsp;
                    {approving || loading
                      ? ''
                      : `${stakeType} ${amountInput > 0 ? amountInput : ''} DG`}
                  </Button>
                ) : (
                  <Button
                    className={styles.button_blue}
                    onClick={() => {
                      unstaking();
                      setAmountInput('');
                    }}
                    disabled={
                      approving ||
                      loading ||
                      Number(amountInput) <= 0 ||
                      Number(amountInput) >
                        state.stakingBalances.BALANCE_USER_GOVERNANCE
                        ? true
                        : false
                    }
                  >
                    {approving || loading ? (
                      <Spinner width={33} height={33} />
                    ) : null}
                    &nbsp;
                    {approving || loading
                      ? ''
                      : `${stakeType} ${amountInput > 0 ? amountInput : ''} DG`}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Governance;
