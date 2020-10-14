import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';

// import Web3 from 'web3';

import ABI_DG_STAKING from '../components/ABI/ABIDGStaking.json';
import ABI_BALANCER_POOL_TOKEN from '../components/ABI/ABIBalancerPoolToken.json';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function DGBalance() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [web3, setWeb3] = useState({});

  let userAddress = '';
  let maticWeb3 = {};
  // let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      // setWeb3(web3);

      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      ); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        const balancePoints = await getDGBalance();

        console.log('DG points balance: ' + balancePoints);

        // update global state unclaimed DG points balance
        dispatch({
          type: 'dg_points',
          data: balancePoints,
        });

        const balanceStaking = await getDGStaking();

        console.log('balance staking DG:  ' + balanceStaking[0]);
        console.log('balance staking BPT:  ' + balanceStaking[1]);

        // update global state staking DG and balancer pool token
        dispatch({
          type: 'staking',
          data: balanceStaking,
        });
      }
      fetchData();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's staking contract DG balance
  async function getDGStaking() {
    const addresses = await Global.API_ADDRESSES;

    // const DG_STAKING_CONTRACT = web3Default.eth
    //   .contract(ABI_DG_STAKING)
    //   .at(addresses.DG_STAKING);

    // const DG_STAKING_CONTRACT = new web3Default.eth.Contract(
    //   ABI_DG_STAKING,
    //   addresses.DG_STAKING
    // );

    const DG_STAKING_CONTRACT = window.web3.eth
      .contract(ABI_DG_STAKING)
      .at(addresses.DG_STAKING);

    const BPT_CONTRACT = window.web3.eth
      .contract(ABI_BALANCER_POOL_TOKEN)
      .at(addresses.BALANCER_POOL_TOKEN);

    try {
      // const DGStakingBalance = await DG_STAKING_CONTRACT.methods.balanceOf(
      //   _userAddress
      // );

      // console.log('userAddress: ' + userAddress);

      const DGStakingBalance = await Transactions.balanceOfToken(
        DG_STAKING_CONTRACT,
        userAddress,
        3
      );

      const BPTBalance = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        userAddress,
        3
      );

      // console.log('dg staking balance...');
      // console.log(DGStakingBalance);

      // console.log('bpt balance...');
      // console.log(BPTBalance);

      // const pointsAdjusted = (DGStakingBalance / Global.CONSTANTS.FACTOR)
      //   .toFixed(3)
      //   .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return [DGStakingBalance, BPTBalance];
    } catch (error) {
      console.log('Get DG staking balance error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract
  function getDGBalance() {
    return new Promise(async (resolve, reject) => {
      console.log("Get user's DG points balance from smart contract");

      const addresses = await Global.API_ADDRESSES;

      const dgPointerContract = maticWeb3.eth
        .contract(ABI_DG_POINTER)
        .at(addresses.DG_POINTER_ADDRESS);

      try {
        dgPointerContract.pointsBalancer(userAddress, async function (
          err,
          amount
        ) {
          if (err) {
            console.log('Get balance failed', err);
            reject(false);
          }

          const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR)
            .toFixed(3)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

          resolve(pointsAdjusted);
        });
      } catch (error) {
        console.log('No DG points found: ' + error);
      }
    });
  }

  return null;
}

export default DGBalance;
