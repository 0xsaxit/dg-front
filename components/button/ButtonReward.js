import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Web3 from 'web3';
import ABI_DG_STAKING from '../ABI/ABIDGStaking.json';
import Aux from '../_Aux';
import Global from '../Constants';

function ButtonReward(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [stakingContract, setStakingContract] = useState({});
  const [userAddress, setUserAddress] = useState('');
  const [disabled, setDisabled] = useState(true);

  const rewardAmount = '10000000000000000000'; // hard-coded reward amount

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();
      setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;

        const workerAddress = addresses.WORKER_ADDRESS.toUpperCase();
        if (userAddress === workerAddress) setDisabled(false);

        const DG_STAKING_CONTRACT = new web3.eth.Contract(
          ABI_DG_STAKING,
          addresses.DG_STAKING_ADDRESS
        );

        setStakingContract(DG_STAKING_CONTRACT);
      }
      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (stakingContract) {
      (async () => {
        const timestamp = await getPeriodFinish();

        const rewardAdjusted = rewardAmount / Global.CONSTANTS.FACTOR;
        props.rewardData(rewardAdjusted, timestamp);
      })();
    }
  }, [stakingContract]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for liquidity farming
  async function transactionReward() {
    console.log('Notify reward amount: start 40 minute cycle');
    setDisabled(true);

    try {
      const data = await stakingContract.methods
        .notifyRewardAmount(rewardAmount)
        .send({ from: userAddress });

      setDisabled(false);

      // return reward amount and cycle time
      const returnReward = data.events.RewardAdded.returnValues.reward;
      const rewardAdjusted = returnReward / Global.CONSTANTS.FACTOR;
      const timestamp = await getPeriodFinish();

      props.rewardData(rewardAdjusted, timestamp);
    } catch (error) {
      setDisabled(false);

      console.log('Notify reward amount error: ' + error);
    }
  }

  async function getPeriodFinish() {
    console.log('Return reward period finish time');

    try {
      const timestamp = await stakingContract.methods.periodFinish().call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  return (
    <Aux>
      {disabled ? (
        <Button disabled className="account-connected-play-button">
          START REWARD CYCLE
        </Button>
      ) : (
        <Button
          className="account-connected-play-button"
          onClick={transactionReward}
        >
          START REWARD CYCLE
        </Button>
      )}
    </Aux>
  );
}

export default ButtonReward;