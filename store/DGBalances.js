import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
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
  const [DG_MATIC_CONTRACT, setDGMaticContract] = useState({});
  const [BPT_CONTRACT, setBPTContract] = useState({});
  const [keeperContract, setKeeperContract] = useState({});
  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  const [DG_BPT, setDG_BPT] = useState({});
  const [DAI_BPT, setDAI_BPT] = useState({});


  let interval = {};
  let currentTime = 0;

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
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDGTokenContract(DGTokenContract);

        const DGMaticContract = new maticWeb3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.DG_TOKEN_MATIC
        );
        setDGMaticContract(DGMaticContract);

        const DG_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.DG_TOKEN
        );
        setDG_BPT(DG_BPT);

        const DAI_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.DAI_TOKEN
        );
        setDAI_BPT(DAI_BPT);

        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);

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
        const balanceDG3 = (0).toFixed(3);
        const balanceDG4 = await getDGBalanceKeeper();
        const balance_BP_DG = await getDGBalancer();
        const balance_BP_DAI = await getDAIBalancer();
        const balance_DG_main = await getDGMainchain();
        const balance_DG_matic = await getDGMatic();

        console.log('DG points balance gameplay: ' + balanceDG1);
        console.log('DG points balance pool 1: ' + balanceDG2);
        console.log('DG points balance pool 2: ' + balanceDG3);
        console.log('DG points balance airdrop: ' + balanceDG4);
        console.log('DG BP balance: ' + balance_BP_DG);
        console.log('DAI BP balance: ' + balance_BP_DAI);
        console.log('DG mainchain balance: ' + balance_DG_main);
        console.log('DG matic balance: ' + balance_DG_matic);

        dispatch({
          type: 'dg_balances',
          data: [balanceDG1, balanceDG2, balanceDG3, balanceDG4, balance_BP_DG, balance_BP_DAI, balance_DG_main, balance_DG_matic],
        });

        // update global state staking DG and balancer pool tokens
        const balanceStaking = await getTokensStaking();

        console.log('balance BPT (contract pool 1):  ' + balanceStaking[0]);
        console.log('balance DG (contract pool 1):  ' + balanceStaking[1]);
        console.log('balance BPT (wallet pool 1):  ' + balanceStaking[2]);

        dispatch({
          type: 'staking_balances',
          data: balanceStaking,
        });
      })();
    }
  }, [instances, state.refreshBalances]);

  // get user's DG staking balance every few seconds for the reward period duration
  useEffect(() => {
    if (state.stakeTime) {
      currentTime = Math.round(new Date().getTime() / 1000);

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

          currentTime = Math.round(new Date().getTime() / 1000);
          if (currentTime >= state.stakeTime) clearInterval(interval);
        }, 3000);

        return () => clearInterval(interval);
      }
    }
  }, [state.stakeTime]);


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get mainchain DG balance
  async function getDGMainchain() {
    console.log("Get Mainchain DG balance");

    try {
      const amount = await DG_BPT.methods
        .balanceOf(userAddress)
        .call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get matic DG balance
  async function getDGMatic() {
    console.log("Get Matic DG balance");

    try {
      const amount = await DG_MATIC_CONTRACT.methods
        .balanceOf(userAddress)
        .call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get DG locked in balancer pool
  async function getDGBalancer() {
    console.log("Get DG locked in Balancer");

    try {
      const amount = await DG_BPT.methods
        .balanceOf('0x3Cf393b95a4fbf9B2BdfC2011Fd6675Cf51d3e5d')
        .call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get DAI locked in balancer pool
  async function getDAIBalancer() {
    console.log("Get DG locked in Balancer");

    try {
      const amount = await DAI_BPT.methods
        .balanceOf('0x3Cf393b95a4fbf9B2BdfC2011Fd6675Cf51d3e5d')
        .call();
      
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
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

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for liquidity farming
  async function getDGBalanceStaking() {
    console.log("Get user's DG staking balance from smart contract");

    try {
      const amount = await stakingContract.methods.earned(userAddress).call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for keeping funds
  async function getDGBalanceKeeper() {
    console.log("Get user's DG keeper balance from smart contract");

    try {
      const amount = await keeperContract.methods
        .availableBalance(userAddress)
        .call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get DG balance in balancer pool
  async function getDG() {

    try {
      const amount = await DGTokenContract.methods
        .balanceOf(0x3Cf393b95a4fbf9B2BdfC2011Fd6675Cf51d3e5d)
        .call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's total staking contract & wallet DG balance
  async function getTokensStaking() {
    console.log('Get staking DG & BPT balances');

    try {
      const contractBalanceBPT = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS,
        3
      );

      const contractBalanceDG = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS,
        3
      );

      const stakedBalanceBPT = await Transactions.balanceOfToken(
        stakingContract,
        userAddress,
        3
      );

      const walletBalanceBPT = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        userAddress,
        3
      );

      return [
        contractBalanceBPT,
        contractBalanceDG,
        stakedBalanceBPT,
        walletBalanceBPT,
      ];
    } catch (error) {
      console.log('Staking DG & BPT balances error: ' + error);
    }
  }

  return null;
}

export default DGBalances;
