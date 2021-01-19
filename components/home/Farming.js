import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import Link from 'next/link';
import { Menu, Divider, Input } from 'semantic-ui-react';
import ContentGovernance from '../content/ContentGovernance';
import ContentMining from '../content/ContentMining';
import ContentBalancer from '../content/ContentBalancer';
import ContentUniswap from '../content/ContentUniswap';
import ContentAirdrop from '../content/ContentAirdrop';
import ContentTreasury from '../content/ContentTreasury';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import ButtonAffiliates from '../button/ButtonAffiliates';
import Transactions from '../../common/Transactions';
import Global from '../Constants';

const Farming = (props) => {
  // get user's state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakingContractPool1, setStakingContractPool1] = useState({});
  const [stakingContractPool2, setStakingContractPool2] = useState({});
  const [instances, setInstances] = useState(false);
  const [web3, setWeb3] = useState({});
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [price, setPrice] = useState(0);
  const [amountInput, setAmountInput] = useState('10000000000000000000');

  const DGState = props.DGState;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 provider and create contract instances
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      async function fetchData() {
        const stakingContractPool1 = await Transactions.stakingContractPool1(
          web3
        );
        setStakingContractPool1(stakingContractPool1);

        const stakingContractPool2 = await Transactions.stakingContractPool2(
          web3
        );
        setStakingContractPool2(stakingContractPool2);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.DGBalances.BALANCE_BP_DAI && state.DGBalances.BALANCE_BP_DG_1) {
      const price = Number(
        state.DGBalances.BALANCE_BP_DAI /
          (49 * state.DGBalances.BALANCE_BP_DG_1)
      );

      setPrice(price);
    }
  }, [state.DGBalances.BALANCE_BP_DAI, state.DGBalances.BALANCE_BP_DG_1]);

  // get initial reward and timestamp values
  useEffect(() => {
    if (instances) {
      const rewardAdjusted = amountInput / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
    }
  }, [instances]);

  // get timestamp on page load
  useEffect(() => {
    if (instances) {
      (async () => {
        const timestamp = await getPeriodFinish();

        // dispatch timestamp to the Context API store
        dispatch({
          type: 'stake_time',
          data: timestamp,
        });
      })();
    }
  }, [instances]);

  function formatPrice(balanceDG, units) {
    const priceFormatted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return priceFormatted;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, and get reward from staking contracts
  function getAmounts(amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const re = new RegExp('^-?\\d+(?:.\\d{0,' + (10 || -1) + '})?');
    const truncated = amount.toString().match(re)[0];
    const amountToString = web3.utils.toWei(truncated);

    return { amountAdjusted, amountToString };
  }

  async function staking(
    tokenContract,
    contractAddress,
    stakingContract,
    amount
  ) {
    console.log('Call stake() function to stake tokens');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Staking amount input (number): ' + amountAdjusted);
    console.log('Staking amount input (string): ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our staking contract to spend'
      );

      const amountAllowance = await tokenContract.methods
        .allowance(state.userAddress, contractAddress)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await tokenContract.methods
          .approve(contractAddress, Global.CONSTANTS.MAX_AMOUNT)
          .send({ from: state.userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContract.methods
        .stake(amountToString)
        .send({ from: state.userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdrawal(stakingContract, amount) {
    console.log('Call withdraw() function to unstake tokens');

    const { amountAdjusted, amountToString } = getAmounts(amount);
    console.log('Withdraw amount input (number): ' + amountAdjusted);
    console.log('Withdraw amount input (string): ' + amountToString);

    try {
      const data = await stakingContract.methods
        .withdraw(amountToString)
        .send({ from: state.userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Withdraw transaction error: ' + error);
    }
  }

  async function reward(stakingContract) {
    console.log('Call getReward() function to claim tokens');

    try {
      const data = await stakingContract.methods
        .getReward()
        .send({ from: state.userAddress });

      console.log('getReward() transaction completed: ' + data.transactionHash);

      // update global state staking balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Get rewards transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        <span className="dg-tabs-desktop">
          <p className="account-other-p">
            {DGState === 'governance' ? (
              <b className="account-hover active">GOVERNANCE</b>
            ) : (
              <Link href="/dg">
                <Menu.Item className="account-hover">GOVERNANCE</Menu.Item>
              </Link>
            )}

            {DGState === 'mining' ? (
              <b className="account-hover active">GAMEPLAY REWARDS</b>
            ) : (
              <Link href="/dg/mining">
                <Menu.Item className="account-hover">
                  GAMEPLAY REWARDS
                </Menu.Item>
              </Link>
            )}

            {DGState === 'balancer' ? (
              <b className="account-hover active">BALANCER</b>
            ) : (
              <Link href="/dg/balancer">
                <Menu.Item className="account-hover">BALANCER</Menu.Item>
              </Link>
            )}

            {DGState === 'uniswap' ? (
              <b className="account-hover active">UNISWAP</b>
            ) : (
              <Link href="/dg/uniswap">
                <Menu.Item className="account-hover">UNISWAP</Menu.Item>
              </Link>
            )}

            {state.whitelisted ? (
              DGState === 'admin' ? (
                <b className="account-hover active">ADMIN</b>
              ) : (
                <Link href="/dg/admin">
                  <Menu.Item className="account-hover">ADMIN</Menu.Item>
                </Link>
              )
            ) : null}
          </p>

          <ButtonAffiliates />
        </span>

        <span className="dg-tabs-mobile">
          <p className="account-other-p">
            {DGState === 'governance' ? (
              <b className="account-hover active">GOV</b>
            ) : (
              <Link href="/dg/">
                <Menu.Item className="account-hover">GOV</Menu.Item>
              </Link>
            )}

            {DGState === 'mining' ? (
              <b className="account-hover active">GAMEPLAY</b>
            ) : (
              <Link href="/dg/mining">
                <Menu.Item className="account-hover">GAMEPLAY</Menu.Item>
              </Link>
            )}

            {DGState === 'balancer' ? (
              <b className="account-hover active">BALANCER</b>
            ) : (
              <Link href="/dg/balancer">
                <Menu.Item className="account-hover">BALANCER</Menu.Item>
              </Link>
            )}

            {DGState === 'uniswap' ? (
              <b className="account-hover active">UNI</b>
            ) : (
              <Link href="/dg/uniswap">
                <Menu.Item className="account-hover">UNI</Menu.Item>
              </Link>
            )}
          </p>

          <ButtonAffiliates />
        </span>
      </div>
    );
  }

  function handleChange(e) {
    setAmountInput(e.target.value);
  }

  async function rewardData(amountReward) {
    const timestamp = await getPeriodFinish();

    const date = new Date(timestamp * 1000);
    const hours = date.getHours(); // hours part from the timestamp
    const minutes = '0' + date.getMinutes(); // minutes part from the timestamp
    const seconds = '0' + date.getSeconds(); // seconds part from the timestamp
    const formattedTime =
      hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    setCurrentReward(amountReward);
    setFinishTime(formattedTime);

    // dispatch timestamp to the Context API store
    dispatch({
      type: 'stake_time',
      data: timestamp,
    });
  }

  async function getPeriodFinish() {
    try {
      const timestamp = await stakingContractPool1.methods
        .periodFinish()
        .call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  function contentAdmin() {
    return (
      <div className="DG-liquidity-container top">
        <div className="DG-column top">
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <p>
              BPT balance in contract:{' '}
              {formatPrice(state.stakingBalances.BALANCE_CONTRACT_BPT_1, 3)}
            </p>
            <p>
              DG balance in contract:{' '}
              {formatPrice(state.stakingBalances.BALANCE_CONTRACT_DG_1, 3)}
            </p>
            <p>Current reward amount: {currenReward}</p>
            <p>Reward period finish time: {finishTime}</p>

            <Input
              className="liquidity-input"
              fluid
              placeholder="Amount"
              value={amountInput}
              onChange={handleChange}
            />

            <Divider />

            <p>
              <ButtonReward1
                stakingContractPool1={stakingContractPool1}
                rewardAmount={amountInput}
                rewardData={(amount) => rewardData(amount)}
              />
            </p>
            <p>
              <ButtonReward2
                stakingContractPool2={stakingContractPool2}
                rewardAmount={amountInput}
                rewardData={(amount) => rewardData(amount)}
              />
            </p>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider
            className="tab-divider"
            style={{ marginTop: '18px', paddingBottom: '21px' }}
          />

          {DGState === 'governance' ? (
            <ContentGovernance
              price={price}
              formatPrice={formatPrice}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'mining' ? (
            <ContentMining price={price} formatPrice={formatPrice} />
          ) : DGState === 'balancer' ? (
            <ContentBalancer
              price={price}
              formatPrice={formatPrice}
              instances={instances}
              stakingContractPool1={stakingContractPool1}
              stakingContractPool2={stakingContractPool2}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'uniswap' ? (
            <ContentUniswap
              price={price}
              formatPrice={formatPrice}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'treasury' ? (
            <ContentTreasury />
          ) : DGState === 'airdrop' ? (
            <ContentAirdrop price={price} formatPrice={formatPrice} />
          ) : DGState === 'admin' ? (
            contentAdmin()
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Farming;
