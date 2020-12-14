import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_BP from '../components/ABI/ABIBalancerPoolToken';
import test from '../components/ABI/ABIChildTokenMANA';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
import Fetch from '../common/Fetch';

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [addresses, setAddresses] = useState({});
  const [pointerContract, setPointerContract] = useState({});
  const [stakingContract, setStakingContract] = useState({});
  const [stakingContractTwo, setStakingContractTwo] = useState({});
  const [stakingContractGov, setStakingContractGov] = useState({});

  const [DG_TOKEN_CONTRACT, setDGTokenContract] = useState({});
  const [DG_MATIC_CONTRACT, setDGMaticContract] = useState({});
  const [BPT_CONTRACT, setBPTContract] = useState({});
  const [BPT_CONTRACT_2, setBPTContractTwo] = useState({});
  const [keeperContract, setKeeperContract] = useState({});
  const [maticMana, setMaticMana] = useState({});
  const [maticDai, setMaticDai] = useState({});

  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');

  const [DG_BPT, setDG_BPT] = useState({});
  const [DAI_BPT, setDAI_BPT] = useState({});
  const [DG_BPT_2, setDG_BPT_2] = useState({});
  const [MANA_BPT, setMANA_BPT] = useState({});

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

        // this is for mining DG
        const pointerContract = await Transactions.pointerContract(maticWeb3);
        setPointerContract(pointerContract);

        // set up dg token contract (same for both pools)
        const DGTokenContract = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDGTokenContract(DGTokenContract);

        // matic contract to get DG balance on matic chain for modal
        const DGMaticContract = new maticWeb3.eth.Contract(
          ABI_DG_TOKEN,
          // addresses.DG_TOKEN_MATIC
          addresses.CHILD_TOKEN_ADDRESS_DG
        );
        setDGMaticContract(DGMaticContract);

        const DG_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          // addresses.DG_TOKEN
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDG_BPT(DG_BPT);

        const DAI_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          // addresses.DAI_TOKEN
          addresses.ROOT_TOKEN_ADDRESS_DAI
        );
        setDAI_BPT(DAI_BPT);

        const DG_BPT_2 = new web3.eth.Contract(
          ABI_DG_TOKEN,
          // addresses.DG_TOKEN
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDG_BPT_2(DG_BPT_2);

        const DG_MANA = new web3.eth.Contract(
          ABI_DG_TOKEN,
          // addresses.MANA_TOKEN
          addresses.ROOT_TOKEN_ADDRESS_MANA
        );
        setMANA_BPT(DG_MANA);

        // for treasury stuff
        const MATIC_MANA = new maticWeb3.eth.Contract(
          test,
          '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'
        );
        setMaticMana(MATIC_MANA);

        // for treasury stuff
        const MATIC_DAI = new maticWeb3.eth.Contract(
          test,
          '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063'
        );
        setMaticDai(MATIC_DAI);

        // POOL 1
        const stakingContract = await Transactions.stakingContract(web3);
        setStakingContract(stakingContract);

        // POOL 2
        const stakingContractTwo = await Transactions.stakingContractTwo(web3);
        setStakingContractTwo(stakingContractTwo);

        // for airdrop stuff (don't touch)
        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);

        // gov
        const stakingContractGov = await Transactions.stakingContractGov(web3);
        setStakingContractGov(stakingContractGov);

        // POOL 1
        const BPTContract = await Transactions.BPTContract(web3);
        setBPTContract(BPTContract);

        // POOL 2
        const BPTContractTwo = await Transactions.BPTContractTwo(web3);
        setBPTContractTwo(BPTContractTwo);

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
        const balanceDG3 = await getDGBalanceStaking_2();
        const balanceDG4 = await getDGBalanceKeeper();
        const balance_BP_DG = await getDGBalancer();
        const balance_BP_DAI = await getDAIBalancer();
        const balance_DG_main = await getDGMainchain();
        const balance_DG_matic = await getDGMatic();
        const balance_BP_DG_2 = await getDGBalancer_2();
        const balance_BP_MANA = await getMANABalancer();
        const balance_maticMana = await getMaticMana();
        const balance_maticDai = await getMaticDai();
        const balance_stakingGov = await getDGBalanceStakingGov();

        // calculate price of mana locked in balancer
        let response = await Fetch.MANA_PRICE();
        let json = await response.json();
        let temp = json.market_data.current_price.usd;
        const MANA_total = temp * balance_BP_MANA;

        // get BPT supply of pool 1
        let response_2 = await Fetch.BPT_SUPPLY_1();
        let json_2 = await response_2.json();
        const BPT_supply_1 = json_2.result / Global.CONSTANTS.FACTOR;

        // get BPT supply of pool 2
        let response_3 = await Fetch.BPT_SUPPLY_2();
        let json_3 = await response_3.json();
        const BPT_supply_2 = json_3.result / Global.CONSTANTS.FACTOR;

        console.log('DG points balance gameplay: ' + balanceDG1);
        console.log('DG points balance pool 1: ' + balanceDG2);
        console.log('DG points balance pool 2: ' + balanceDG3);
        console.log('DG points balance airdrop: ' + balanceDG4);
        console.log('DG points balance gov: ' + balance_stakingGov);

        console.log('DG mainchain balance: ' + balance_DG_main);
        console.log('DG matic balance: ' + balance_DG_matic);

        console.log('DG BP balance pool 1: ' + balance_BP_DG_2);
        console.log('MANA BP value (in usd) pool 1: ' + MANA_total);
        console.log('BPT supply pool 1: ' + BPT_supply_1);
        console.log('BPT supply pool 2: ' + BPT_supply_2);

        console.log('DG BP balance pool 2: ' + balance_BP_DG);
        console.log('DAI BP balance pool 2: ' + balance_BP_DAI);

        console.log('treasury mana: ' + balance_maticMana);
        console.log('treasury dai: ' + balance_maticDai);

        dispatch({
          type: 'dg_balances',
          data: [
            balanceDG1,
            balanceDG2,
            balanceDG3,
            balanceDG4,
            balance_BP_DG,
            balance_BP_DAI,
            balance_DG_main,
            balance_DG_matic,
            MANA_total,
            balance_BP_DG_2,
            BPT_supply_1,
            BPT_supply_2,
            balance_maticMana,
            balance_maticDai,
            balance_stakingGov,
          ],
        });

        // update global state staking DG and balancer pool tokens
        const balanceStaking = await getTokensStaking();

        console.log('balance BPT (contract pool 1):  ' + balanceStaking[0]);
        console.log('balance DG (contract pool 1):  ' + balanceStaking[1]);
        console.log('balance BPT (staked pool 1):  ' + balanceStaking[2]);
        console.log('balance BPT (wallet pool 1):  ' + balanceStaking[3]);

        console.log('balance BPT (contract pool 2):  ' + balanceStaking[4]);
        console.log('balance DG (contract pool 2):  ' + balanceStaking[5]);
        console.log('balance BPT (staked pool 2):  ' + balanceStaking[6]);
        console.log('balance BPT (wallet pool 2):  ' + balanceStaking[7]);

        console.log('balance DG total staked (gov): ' + balanceStaking[8]);
        console.log('balance DG user staked (gov): ' + balanceStaking[9]);

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
            // const balanceDGStaking = await getDGBalanceStaking();
            // const arrayNew = state.DGBalances.slice();

            // arrayNew[1] = balanceDGStaking;

            // dispatch({
            //   type: 'dg_balances',
            //   data: arrayNew,
            // });

            // update global state BPT balances
            const refresh = !state.refreshBalances;

            dispatch({
              type: 'refresh_balances',
              data: refresh,
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
  // get treasury matic mana
  async function getMaticMana() {

    try {
      const amount = await maticMana.methods.balanceOf('0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3').call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get treasury matic dai
  async function getMaticDai() {

    try {
      const amount = await maticDai.methods.balanceOf('0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3').call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get mainchain DG balance
  async function getDGMainchain() {
    console.log('Get Mainchain DG balance');

    try {
      const amount = await DG_BPT.methods.balanceOf(userAddress).call();

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
    console.log('Get Matic DG balance');

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
  // get DG locked in balancer pool 2
  // if things go south, check this address being passed in 
  // sorry for the confusing function names (this is pool 1!)
  async function getDGBalancer_2() {
    console.log('Get DG locked in Balancer pool 1');

    try {
      const amount = await DG_BPT_2.methods
        .balanceOf('0xca54c398195fce98856888b0fd97a9470a140f71')
        .call();

      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get MANA locked in balancer pool 2
  async function getMANABalancer() {
    console.log('Get MANA locked in Balancer pool 1');

    try {
      const amount = await MANA_BPT.methods
        .balanceOf('0xca54c398195fce98856888b0fd97a9470a140f71')
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
    console.log('Get DG locked in Balancer pool 2');

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
    console.log('Get DAI locked in Balancer pool 2');

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
  // get user's DG unclaimed balance from smart contract for liquidity farming for pool 1
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
  // get user's DG unclaimed balance from smart contract for gov
  async function getDGBalanceStakingGov() {
    console.log("Get user's DG staking balance from gov smart contract");

    try {
      const amount = await stakingContractGov.methods.earned(userAddress).call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for liquidity farming for pool 2
  async function getDGBalanceStaking_2() {
    console.log("Get user's DG staking balance from smart contract for pool 2");

    try {
      const amount = await stakingContractTwo.methods
        .earned(userAddress)
        .call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for liquidity farming for pool 2
  async function getDGBalanceStaking_gov() {
    console.log("Get user's DG staking balance from smart contract for pool 2");

    try {
      const amount = await stakingContractGov.methods
        .earned(userAddress)
        .call();
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
        .balanceOf(0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d)
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
    console.log('Get staking DG & BPT balances pool 1');

    try {
      // POOL 1
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
        0
      );

      const walletBalanceBPT = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        userAddress,
        0
      );

      // POOL 2
      const contractBalanceBPTTwo = await Transactions.balanceOfToken(
        BPT_CONTRACT_2,
        addresses.DG_STAKING_CONTRACT_ADDRESS_2,
        3
      );

      const contractBalanceDGTwo = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS_2,
        3
      );

      const stakedBalanceBPTTwo = await Transactions.balanceOfToken(
        stakingContractTwo,
        userAddress,
        0
      );

      const walletBalanceBPTTwo = await Transactions.balanceOfToken(
        BPT_CONTRACT_2,
        userAddress,
        0
      );

      // gov
      const contractBalanceStakingGov = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_GOV,
        3
      );

      const stakedBalanceUserGov = await Transactions.balanceOfToken(
        stakingContractGov,
        userAddress,
        0
      );

      return [
        contractBalanceBPT,
        contractBalanceDG,
        stakedBalanceBPT,
        walletBalanceBPT,
        contractBalanceBPTTwo,
        contractBalanceDGTwo,
        stakedBalanceBPTTwo,
        walletBalanceBPTTwo,
        contractBalanceStakingGov,
        stakedBalanceUserGov,
      ];
    } catch (error) {
      console.log('Staking DG & BPT pool 1 balances error: ' + error);
    }
  }

  return null;
}

export default DGBalances;
