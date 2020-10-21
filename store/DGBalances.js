import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';

import Web3 from 'web3';

import ABI_DG_TOKEN from '../components/ABI/ABIDGToken.json';
// import ABI_DG_STAKING from '../components/ABI/ABIDGStaking.json';
import ABI_BALANCER_POOL_TOKEN from '../components/ABI/ABIBalancerPoolToken.json';

// import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';

import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [addresses, setAddresses] = useState({});
  const [pointerContract, setPointerContract] = useState({});
  const [stakingContract, setStakingContract] = useState({});
  const [DG_TOKEN_CONTRACT, setDGTokenContract] = useState({});
  const [BPT_CONTRACT, setBPTContract] = useState({});

  const [defined, setDefined] = useState(false);

  const [userAddress, setUserAddress] = useState('');

  // let userAddress = '';
  // let maticWeb3 = {};
  let interval = {};

  // let web3 = {};

  // let addresses = {};
  // let DG_POINTER_CONTRACT = {};
  // let pointerContract = {};

  // let DG_TOKEN_CONTRACT = {};

  // let DG_STAKING_CONTRACT = {};
  // let stakingContract = {};

  // let BPT_CONTRACT = {};

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      // const maticWeb3 = new window.Web3(
      //   new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      // ); // pass MetaMask provider to Web3 constructor
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        setAddresses(addresses);

        // pointerContract = maticWeb3.eth
        //   .contract(ABI_DG_POINTER)
        //   .at(addresses.DG_POINTER_ADDRESS);
        const pointerContract = await Transactions.pointerContract(maticWeb3);
        setPointerContract(pointerContract);

        // const DG_TOKEN_CONTRACT = window.web3.eth
        //   .contract(ABI_DG_TOKEN)
        //   .at(addresses.DG_TOKEN_ADDRESS);
        const DG_TOKEN_CONTRACT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.DG_TOKEN_ADDRESS
        );
        setDGTokenContract(DG_TOKEN_CONTRACT);

        // DG_STAKING_CONTRACT = window.web3.eth
        //   .contract(ABI_DG_STAKING)
        //   .at(addresses.DG_STAKING_ADDRESS);
        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        // const BPT_CONTRACT = window.web3.eth
        //   .contract(ABI_BALANCER_POOL_TOKEN)
        //   .at(addresses.BP_TOKEN_ADDRESS);
        const BPT_CONTRACT = new web3.eth.Contract(
          ABI_BALANCER_POOL_TOKEN,
          addresses.BP_TOKEN_ADDRESS
        );
        setBPTContract(BPT_CONTRACT);

        setDefined(true);
      }
      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (defined) {
      (async function () {
        // update global state unclaimed DG points balances
        const balanceDG1 = await getDGBalanceGameplay();
        const balanceDG2 = await getDGBalanceStaking();

        console.log('DG points balance 1: ' + balanceDG1);
        console.log('DG points balance 2: ' + balanceDG2);

        dispatch({
          type: 'dg_balances',
          data: [balanceDG1, balanceDG2],
        });

        // update global state staking DG and balancer pool token
        const balanceStaking = await getDGTotalStaking();

        console.log('balance staking DG:  ' + balanceStaking[0]);
        console.log('balance staking BPT (contract):  ' + balanceStaking[1]);
        console.log('balance staking BPT (wallet):  ' + balanceStaking[2]);

        dispatch({
          type: 'staking',
          data: balanceStaking,
        });
      })();
    }
  }, [defined]);

  // get user's DG staking balance every second for the reward period duration
  useEffect(() => {
    if (state.stakeTime) {
      const currentTime = Math.round(new Date().getTime() / 1000);

      console.log('curent time: ' + currentTime);
      console.log('timestamp: ' + state.stakeTime);

      if (currentTime < state.stakeTime) {
        interval = setInterval(() => {
          (async () => {
            const balanceDGStaking = await getDGBalanceStaking();

            const ret = state.DGBalances.slice(1);
            ret[1] = balanceDGStaking;

            console.log('balances dg...');
            console.log(ret);

            dispatch({
              type: 'dg_balances',
              data: [...ret],
            });
          })();
        }, 3000);
      } else {
        clearInterval(interval);
      }

      return () => clearInterval(interval);
    }
  }, [state.stakeTime]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's total staking contract & wallet DG balance
  async function getDGTotalStaking() {
    console.log('Get DG contract staking balances');

    try {
      const contractBalanceDG = await Transactions.balanceOfToken2(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_ADDRESS,
        3
      );

      // console.log('staking contract...');
      // console.log(stakingContract);

      const contractBalanceBPT = await Transactions.balanceOfToken2(
        stakingContract,
        userAddress,
        3
      );

      const walletBalanceBPT = await Transactions.balanceOfToken2(
        BPT_CONTRACT,
        userAddress,
        3
      );

      return [contractBalanceDG, contractBalanceBPT, walletBalanceBPT];
    } catch (error) {
      console.log('Get DG staking balance error: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for gameplay mining
  // async function getDGBalanceGameplay() {
  //   return new Promise(async (resolve, reject) => {
  //     console.log("Get user's DG points balance from smart contract");

  //     try {
  //       DG_POINTER_CONTRACT.pointsBalancer(userAddress, async function (
  //         err,
  //         amount
  //       ) {
  //         if (err) {
  //           console.log('Get balance failed', err);
  //           reject(false);
  //         }

  //         const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR)
  //           .toFixed(3)
  //           .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //         resolve(pointsAdjusted);
  //       });
  //     } catch (error) {
  //       console.log('No DG points found: ' + error);
  //     }
  //   });
  // }

  async function getDGBalanceGameplay() {
    console.log("Get user's DG points balance from smart contract");

    try {
      const amount = await pointerContract.methods
        .pointsBalancer(userAddress)
        .call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR)
        .toFixed(3)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for liquidity farming
  // async function getDGBalanceStaking() {
  //   return new Promise(async (resolve, reject) => {
  //     console.log("Get user's DG points balance from smart contract");

  //     try {
  //       DG_STAKING_CONTRACT.earned(userAddress, async function (err, amount) {
  //         if (err) {
  //           console.log('Get balance failed', err);
  //           reject(false);
  //         }

  //         const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR)
  //           .toFixed(3)
  //           .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  //         resolve(pointsAdjusted);
  //       });
  //     } catch (error) {
  //       console.log('No DG points found: ' + error);
  //     }
  //   });
  // }

  async function getDGBalanceStaking() {
    console.log("Get user's DG staking balance from smart contract");

    try {
      const amount = await stakingContract.methods.earned(userAddress).call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR)
        .toFixed(3)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  return null;
}

export default DGBalances;
