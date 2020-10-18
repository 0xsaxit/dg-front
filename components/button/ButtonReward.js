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
  // const [eventData, setEventData] = useState('');

  useEffect(() => {
    if (state.userStatus) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;

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
  // handle incoming RewardAdded() event
  useEffect(() => {
    if (Object.keys(stakingContract2).length !== 0) {
      stakingContract2.events.RewardAdded(
        {
          filter: {
            myIndexedParam: [20, 23],
            myOtherIndexedParam: '0x123456789...',
          }, // Using an array means OR: e.g. 20 or 23
          fromBlock: 0,
        },
        function (error, event) {
          // console.log('incoming event data...');
          // console.log(event.returnValues.reward);

          // return reward amount and cycle time
          props.rewardData(event.returnValues.reward, 40); // ***************************
        }
      );
    }
  }, [stakingContract2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for liquidity farming
  async function transactionReward() {
    return new Promise(async (resolve, reject) => {
      console.log('Notify reward amount: start 40 minute cycle');

      try {
        stakingContract1.notifyRewardAmount(5, async function (err, foo) {
          if (err) {
            console.log('Get balance failed', err);
            reject(false);
          }

          // console.log('notify return...');
          // console.log(foo);

          // resolve(foo);
          // setEventHandler(true)
        });
      } catch (error) {
        console.log('Notify reward amount error: ' + error);
      }
    });
  }

  // async function transactionReward() {
  //   console.log('Notify reward amount: start 40 minute cycle');

  //   try {
  //     const foo = await stakingContract.methods.notifyRewardAmount(5).call();

  //     return foo;
  //   } catch (error) {
  //     console.log('Notify reward amount error: ' + error);
  //   }
  // }

  return (
    <Aux>
      <Button
        className="account-connected-play-button"
        onClick={transactionReward}
      >
        NOTIFY REWARD AMOUNT
      </Button>
      worker address...
    </Aux>
  );
}

export default ButtonReward;
