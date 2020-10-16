import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';

// import Web3 from 'web3';

import ABI_DG_TOKEN from '../components/ABI/ABIDGToken.json';

import ABI_DG_STAKING from '../components/ABI/ABIDGStaking.json';
import ABI_BALANCER_POOL_TOKEN from '../components/ABI/ABIBalancerPoolToken.json';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [web3, setWeb3] = useState({});

  let userAddress = '';
  let maticWeb3 = {};
  // let web3 = {};
  let addresses = {};
  let DG_POINTER_CONTRACT = {};
  let DG_TOKEN_CONTRACT = {};
  let DG_STAKING_CONTRACT = {};
  let BPT_CONTRACT = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      // setWeb3(web3);

      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      ); // pass MetaMask provider to Web3 constructor

      async function fetchData() {
        addresses = await Global.API_ADDRESSES;

        DG_POINTER_CONTRACT = maticWeb3.eth
          .contract(ABI_DG_POINTER)
          .at(addresses.DG_POINTER_ADDRESS);

        DG_TOKEN_CONTRACT = window.web3.eth
          .contract(ABI_DG_TOKEN)
          .at(addresses.DG_TOKEN_ADDRESS);

        DG_STAKING_CONTRACT = window.web3.eth
          .contract(ABI_DG_STAKING)
          .at(addresses.DG_STAKING_ADDRESS);

        BPT_CONTRACT = window.web3.eth
          .contract(ABI_BALANCER_POOL_TOKEN)
          .at(addresses.BP_TOKEN_ADDRESS);
        // })();

        // async function fetchData() {
        const balanceDG1 = await getDGBalanceGameplay();
        const balanceDG2 = await getDGBalanceStaking();

        console.log('DG points balance 1: ' + balanceDG1);
        console.log('DG points balance 2: ' + balanceDG2);

        // update global state unclaimed DG points balances
        dispatch({
          type: 'dg_balances',
          data: [balanceDG1, balanceDG2],
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
    console.log('Get DG staking balances');

    try {
      const contractBalanceDG = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_ADDRESS,
        3
      );

      const contractBalanceBPT = await Transactions.balanceOfToken(
        DG_STAKING_CONTRACT,
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
    return new Promise(async (resolve, reject) => {
      console.log("Get user's DG points balance from smart contract");

      try {
        DG_POINTER_CONTRACT.pointsBalancer(userAddress, async function (
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG points balance from smart contract for liquidity farming
  async function getDGBalanceStaking() {
    return new Promise(async (resolve, reject) => {
      console.log("Get user's DG points balance from smart contract");

      try {
        DG_STAKING_CONTRACT.earned(userAddress, async function (err, amount) {
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

export default DGBalances;
