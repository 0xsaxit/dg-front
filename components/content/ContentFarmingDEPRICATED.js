import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store';
import { Divider, Input } from 'semantic-ui-react';
import Aux from '../_Aux';
import ContentGovernance from './ContentGovernance';
import ContentMining from './ContentMining';
import ContentBalancer from './ContentBalancer';
import ContentUniswap from './ContentUniswap';
import ContentToken from './ContentToken';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import Global from '../Constants';

const ContentFarming = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [amountInput, setAmountInput] = useState('10000000000000000000');

  const price = Number(
    state.DGBalances.balance_BP_DAI / (49 * state.DGBalances.balance_BP_DG)
  );

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function formatPrice(balanceDG, units) {
    const balanceAdjusted = Number(balanceDG)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  // get initial reward and timestamp values
  useEffect(() => {
    if (props.instances) {
      const rewardAdjusted = amountInput / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
    }
  }, [props.instances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, and get reward from staking contract
  async function staking(tokenContract, stakingContract, amount) {
    const amountAdjusted = amount * Global.CONSTANTS.FACTOR;
    const amountToString = web3.utils.toWei(amount);
    console.log('Staking amount input: ' + amountToString);

    try {
      console.log(
        'Get amount user has authorized our staking contract to spend'
      );

      const amountAllowance = await tokenContract.methods
        .allowance(userAddress, addresses.DG_STAKING_CONTRACT_ADDRESS_2)
        .call();

      console.log('Authorized amount: ' + amountAllowance);

      if (Number(amountAllowance) < amountAdjusted) {
        console.log("Approve staking contract to spend user's tokens");

        const data = await tokenContract.methods
          .approve(
            addresses.DG_STAKING_CONTRACT_ADDRESS_2,
            Global.CONSTANTS.MAX_AMOUNT
          )
          .send({ from: userAddress });

        console.log('approve() transaction confirmed: ' + data.transactionHash);
      }

      console.log('Call stake() function on smart contract');

      const data = await stakingContract.methods
        .stake(amountToString)
        .send({ from: userAddress });

      console.log('stake() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Staking transactions error: ' + error);
    }
  }

  async function withdraw(tokenContract, amount) {
    console.log('Call withdraw() function to unstake BP tokens');

    const amountToString = web3.utils.toWei(amount);
    console.log('Withdraw amount input: ' + amountToString);

    try {
      const data = await tokenContract.methods
        .withdraw(amountToString)
        .send({ from: userAddress });

      console.log('withdraw() transaction completed: ' + data.transactionHash);

      // update global state BPT balances
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('Unstake BP tokens error: ' + error);
    }
  }

  async function getReward(tokenContract) {
    console.log('Call getReward_2() function to claim DG tokens');

    try {
      const data = await tokenContract.methods
        .getReward()
        .send({ from: userAddress });

      console.log(
        'getReward_2() transaction completed: ' + data.transactionHash
      );

      // update global state unclaimed DG balance
      const refresh = !state.refreshBalances;

      dispatch({
        type: 'refresh_balances',
        data: refresh,
      });
    } catch (error) {
      console.log('getReward_2() transaction error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(e) {
    console.log('New amount: ' + e.target.value);

    setAmountInput(e.target.value);
  }

  async function rewardData(amountReward) {
    const timestamp = await props.getPeriodFinish();

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

  function contentAdmin() {
    return (
      <Aux>
        <div className="DG-liquidity-container top">
          <div className="DG-column top">
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                BPT balance in contract:{' '}
                {state.stakingBalances.contractBalanceBPT}
              </p>
              <p>
                DG balance in contract:{' '}
                {state.stakingBalances.contractBalanceDG}
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
                  stakingContract={props.stakingContract}
                  rewardAmount={amountInput}
                  rewardData={(amount) => rewardData(amount)}
                />
              </p>
              <p>
                <ButtonReward2
                  stakingContractTwo={props.stakingContractTwo}
                  rewardAmount={amountInput}
                  rewardData={(amount) => rewardData(amount)}
                />
              </p>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  if (props.content === 'governance') {
    return (
      <ContentGovernance
        price={price}
        formatPrice={formatPrice}
        staking={staking}
        witdraw={withdraw}
        getReward={getReward}
      />
    );
  } else if (props.content === 'mining') {
    return (
      <ContentMining
        price={price}
        formatPrice={formatPrice}
        staking={staking}
        witdraw={withdraw}
        getReward={getReward}
      />
    );
  } else if (props.content === 'balancer') {
    return (
      <ContentBalancer
        price={price}
        formatPrice={formatPrice}
        staking={staking}
        witdraw={withdraw}
        getReward={getReward}
      />
    );
  } else if (props.content === 'uniswap') {
    return (
      <ContentUniswap
        price={price}
        staking={staking}
        witdraw={withdraw}
        getReward={getReward}
      />
    );
  } else if (props.content === 'token') {
    return (
      <ContentToken
        staking={staking}
        witdraw={withdraw}
        getReward={getReward}
      />
    );
  } else if (props.content === 'admin') {
    return contentAdmin();
  }
};

export default ContentFarming;
