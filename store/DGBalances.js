import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
// import ABI_BALANCER_POOL_TOKEN from '../components/ABI/ABIBalancerPoolToken';
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
  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  let interval = {};

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const addresses = await Global.API_ADDRESSES;
        setAddresses(addresses);

        const pointerContract = await Transactions.pointerContract(maticWeb3);
        setPointerContract(pointerContract);

        const DGTokenContract = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.DG_TOKEN_ADDRESS
        );
        setDGTokenContract(DGTokenContract);

        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        // const BPTContract = new web3.eth.Contract(
        //   ABI_BALANCER_POOL_TOKEN,
        //   addresses.BP_TOKEN_ADDRESS
        // );
        const BPTContract = await Transactions.BPTContract(web3);
        setBPTContract(BPTContract);

        setInstances(true); // contract instantiation complete
      }
      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (instances) {
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
  }, [instances]);

  // get user's DG staking balance every few seconds for the reward period duration
  useEffect(() => {
    if (state.stakeTime) {
      const currentTime = Math.round(new Date().getTime() / 1000);

      console.log('curent time: ' + currentTime);
      console.log('timestamp: ' + state.stakeTime);

      if (currentTime < state.stakeTime) {
        interval = setInterval(() => {
          (async () => {
            const balanceDGStaking = await getDGBalanceStaking();

            const arrayNew = state.DGBalances.slice();
            arrayNew[1] = balanceDGStaking;

            dispatch({
              type: 'dg_balances',
              data: arrayNew,
            });
          })();

          if (currentTime > state.stakeTime) clearInterval(interval);
        }, 3000);
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
      const contractBalanceDG = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_ADDRESS,
        3
      );

      const contractBalanceBPT = await Transactions.balanceOfToken(
        stakingContract,
        userAddress,
        3
      );

      const walletBalanceBPT = await Transactions.balanceOfToken(
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
