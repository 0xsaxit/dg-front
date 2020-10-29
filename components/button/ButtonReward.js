import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';
import Global from '../Constants';

function ButtonReward(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [userAddress, setUserAddress] = useState('');
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();
      setUserAddress(userAddress);

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;

        const workerAddress = addresses.WORKER_ADDRESS.toUpperCase();
        if (userAddress === workerAddress) setDisabled(false);
      }
      fetchData();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function transactionReward() {
    console.log('Notify reward amount: start 40 minute cycle');
    setDisabled(true);

    try {
      const data = await props.stakingContract.methods
        .notifyRewardAmount(props.rewardAmount)
        .send({ from: userAddress });

      setDisabled(false);

      // confirm reward amount on smart contract
      const returnReward = data.events.RewardAdded.returnValues.reward;
      const rewardAdjusted = returnReward / Global.CONSTANTS.FACTOR;

      props.rewardData(rewardAdjusted);
    } catch (error) {
      setDisabled(false);

      console.log('Notify reward amount error: ' + error);
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
