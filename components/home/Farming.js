import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Web3 from 'web3';
import Link from 'next/link';
import { Menu, Divider, Input } from 'semantic-ui-react';
import ContentGovernance from '../content/ContentGovernance';
import ContentMining from '../content/ContentMining';
import ContentBalancer from '../content/ContentBalancer';
import ContentUniswap from '../content/ContentUniswap';
import ContentToken from '../content/ContentToken';
import ButtonReward1 from '../button/ButtonReward1';
import ButtonReward2 from '../button/ButtonReward2';
import ButtonAffiliates from '../button/ButtonAffiliates';
import Transactions from '../../common/Transactions';
import Global from '../Constants';

const Farming = (props) => {
  // get user's state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakingContract, setStakingContract] = useState({});
  const [stakingContract2, setStakingContract2] = useState({});
  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState({});
  const [currenReward, setCurrentReward] = useState(0);
  const [finishTime, setFinishTime] = useState(0);
  const [amountInput, setAmountInput] = useState('10000000000000000000');

  const DGState = props.DGState;
  const price = Number(
    state.DGBalances.BALANCE_BP_DAI / (49 * state.DGBalances.BALANCE_BP_DG_1)
  );

  useEffect(() => {
    if (state.userStatus >= 4) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create contract instances
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      async function fetchData() {
        const stakingContract = await Transactions.stakingContractPool1(web3);
        setStakingContract(stakingContract);

        const stakingContract2 = await Transactions.stakingContractPool2(web3);
        setStakingContract2(stakingContract2);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

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
    if (instances) {
      const rewardAdjusted = amountInput / Global.CONSTANTS.FACTOR;
      rewardData(rewardAdjusted);
    }
  }, [instances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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

  async function getPeriodFinish() {
    try {
      const timestamp = await stakingContract.methods.periodFinish().call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // stake, withdraw, and get reward from staking contracts
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

  async function withdrawal(tokenContract, amount) {
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
      console.log('Withdraw transaction error: ' + error);
    }
  }

  async function reward(tokenContract) {
    console.log('Call getReward() function to claim DG tokens');

    try {
      const data = await tokenContract.methods
        .getReward()
        .send({ from: userAddress });

      console.log('getReward() transaction completed: ' + data.transactionHash);

      // update global state unclaimed DG balance
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

            {DGState === 'token' ? (
              <b className="account-hover active">AIRDROP</b>
            ) : (
              <Link href="/dg/airdrop">
                <Menu.Item className="account-hover">AIRDROP</Menu.Item>
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(e) {
    console.log('New amount: ' + e.target.value);

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
                stakingContract={stakingContract}
                rewardAmount={amountInput}
                rewardData={(amount) => rewardData(amount)}
              />
            </p>
            <p>
              <ButtonReward2
                stakingContract2={stakingContract2}
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

          {DGState === 'admin' ? (
            contentAdmin()
          ) : DGState === 'governance' ? (
            <ContentGovernance
              price={price}
              formatPrice={formatPrice}
              instances={instances}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'mining' ? (
            <ContentMining
              price={price}
              formatPrice={formatPrice}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'balancer' ? (
            <ContentBalancer
              price={price}
              formatPrice={formatPrice}
              instances={instances}
              stakingContract={stakingContract}
              stakingContract2={stakingContract2}
              staking={staking}
              withdrawal={withdrawal}
              reward={reward}
            />
          ) : DGState === 'uniswap' ? (
            <ContentUniswap
              price={price}
              formatPrice={formatPrice}
              staking={staking}
              reward={reward}
            />
          ) : DGState === 'token' ? (
            <ContentToken price={price} formatPrice={formatPrice} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Farming;
