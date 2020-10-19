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
  const [stakingContract1, setStakingContract1] = useState({});
  const [stakingContract2, setStakingContract2] = useState({});
  const [userAddress, setUserAddress] = useState('');
  // const [workerAddress, setWorkerAddress] = useState('');

  const [txHash, setTxHash] = useState('');
  const [disabled, setDisabled] = useState(true);

  const rewardAmount = 10; // hard-coded reward amount

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();
      setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        // setWorkerAddress(addresses.WORKER_ADDRESS.toUpperCase());

        const workerAddress = addresses.WORKER_ADDRESS.toUpperCase();
        if (userAddress === workerAddress) setDisabled(false);

        console.log('userAddress: ' + userAddress);
        console.log('worker address: ' + workerAddress);

        const DG_STAKING_CONTRACT1 = window.web3.eth
          .contract(ABI_DG_STAKING)
          .at(addresses.DG_STAKING_ADDRESS);

        const DG_STAKING_CONTRACT2 = new web3.eth.Contract(
          ABI_DG_STAKING,
          addresses.DG_STAKING_ADDRESS
        );

        setStakingContract1(DG_STAKING_CONTRACT1);
        setStakingContract2(DG_STAKING_CONTRACT2);
      }
      fetchData();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle incoming RewardAdded() event and return reward and timestamp values
  useEffect(() => {
    if (Object.keys(stakingContract2).length !== 0) {
      // if (eventHandler) {
      stakingContract2.events.RewardAdded(
        {
          filter: {
            myIndexedParam: [20, 23],
            myOtherIndexedParam: '0x123456789...',
          }, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0,
        },
        async function (error, event) {
          // console.log('event data');
          // console.log(event);

          console.log('event hash: ' + event.transactionHash);
          console.log('tx hash: ' + txHash);

          if (event.transactionHash === txHash) {
            setDisabled(false);

            // return reward amount and cycle time
            const timestamp = await getPeriodFinish();

            // props.rewardData(event.returnValues.reward, timestamp);
            props.rewardData(rewardAmount, timestamp);
          }
        }
      );
    }
  }, [stakingContract2]);

  async function getPeriodFinish() {
    console.log('Return reward period finish time');

    try {
      const timestamp = await stakingContract2.methods.periodFinish().call();

      return timestamp;
    } catch (error) {
      console.log('Return reward period time error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for liquidity farming
  // async function transactionReward() {
  //   setDisabled(true);

  //   return new Promise(async (resolve, reject) => {
  //     console.log('Notify reward amount: start 40 minute cycle');

  //     try {
  //       stakingContract1.notifyRewardAmount(rewardAmount, async function (err, txHash) {
  //         if (err) {
  //           setDisabled(false);

  //           console.log('Notify reward amount failed', err);
  //           // reject(false);
  //         }

  //         console.log('notify return...');
  //         console.log(txHash);

  //         resolve(txHash);

  //         // setTxHash(txHash);
  //       });
  //     } catch (error) {
  //       console.log('Notify reward amount error: ' + error);
  //     }
  //   });
  // }

  async function transactionReward() {
    console.log('Notify reward amount: start 40 minute cycle');
    setDisabled(true);

    try {
      const data = await stakingContract2.methods
        .notifyRewardAmount(rewardAmount)
        .send({ from: userAddress });

      console.log('notify return...');
      console.log(data.transactionHash);

      setTxHash(data.transactionHash);
    } catch (error) {
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
