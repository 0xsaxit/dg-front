import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
import Fetch from '../common/Fetch';

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [addresses, setAddresses] = useState({});
  const [pointerContract, setPointerContract] = useState({});
  const [stakingContractPool1, setStakingContractPool1] = useState({});
  const [stakingContractPool2, setStakingContractPool2] = useState({});
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});
  const [stakingContractGovernance, setStakingContractGovernance] = useState(
    {}
  );
  const [DG_TOKEN_CONTRACT, setDGTokenContract] = useState({});
  const [DG_MATIC_CONTRACT, setDGMaticContract] = useState({});
  const [BPT_CONTRACT, setBPTContract] = useState({});
  const [BPT_CONTRACT_2, setBPTContractTwo] = useState({});
  const [UNI_CONTRACT, setUNIContract] = useState({});
  const [keeperContract, setKeeperContract] = useState({});
  const [maticMana, setMaticMana] = useState({});
  const [maticDAIContract, setMaticDAIContract] = useState({});
  const [instances, setInstances] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [DG_BPT, setDG_BPT] = useState({});
  const [DAI_BPT, setDAI_BPT] = useState({});
  const [DG_BPT_2, setDG_BPT_2] = useState({});
  const [MANA_BPT, setMANA_BPT] = useState({});
  const [ETH_UNI, setETH_UNI] = useState({});

  let interval = {};
  let currentTime = 0;

  useEffect(() => {
    if (state.userStatus >= 4) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const addresses = await Global.ADDRESSES;
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
          addresses.CHILD_TOKEN_ADDRESS_DG
        );
        setDGMaticContract(DGMaticContract);

        const DG_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDG_BPT(DG_BPT);

        const DAI_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.ROOT_TOKEN_ADDRESS_DAI
        );
        setDAI_BPT(DAI_BPT);

        const ETH_UNI = new web3.eth.Contract(
          ABI_DG_TOKEN,
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        );
        setETH_UNI(ETH_UNI);

        const DG_BPT_2 = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.ROOT_TOKEN_ADDRESS_DG
        );
        setDG_BPT_2(DG_BPT_2);

        const DG_MANA = new web3.eth.Contract(
          ABI_DG_TOKEN,
          addresses.ROOT_TOKEN_ADDRESS_MANA
        );
        setMANA_BPT(DG_MANA);

        // for treasury stuff
        const MATIC_MANA = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4'
        );
        setMaticMana(MATIC_MANA);

        // for treasury stuff
        const maticDAIContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          addresses.CHILD_TOKEN_ADDRESS_DAI
        );
        setMaticDAIContract(maticDAIContract);

        // POOL 1
        const stakingContractPool1 = await Transactions.stakingContractPool1(
          web3
        );
        setStakingContractPool1(stakingContractPool1);

        // POOL 2
        const stakingContractPool2 = await Transactions.stakingContractPool2(
          web3
        );
        setStakingContractPool2(stakingContractPool2);

        // for airdrop stuff (don't touch)
        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);

        // gov
        const stakingContractGovernance = await Transactions.stakingContractGovernance(
          web3
        );
        setStakingContractGovernance(stakingContractGovernance);

        // POOL 1
        const BPTContract = await Transactions.BPTContract1(web3);
        setBPTContract(BPTContract);

        // POOL 2
        const BPTContractTwo = await Transactions.BPTContract2(web3);
        setBPTContractTwo(BPTContractTwo);

        // UNISWAP
        const stakingContractUniswap = await Transactions.stakingContractUniswap(
          web3
        );
        setStakingContractUniswap(stakingContractUniswap);

        const UNIContract = await Transactions.uniswapContract(web3);
        setUNIContract(UNIContract);

        setInstances(true); // contract instantiation complete
      }
      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (instances) {
      (async function () {
        // update global state unclaimed DG points balances
        const BALANCE_MINING_DG = await getDGBalanceGameplay();
        const BALANCE_STAKING_BALANCER_1 = await getDGBalanceStakingBalancer1();
        const BALANCE_STAKING_BALANCER_2 = await getDGBalanceStakingBalancer2();
        const BALANCE_KEEPER_DG = await getDGBalanceKeeper();
        const BALANCE_BP_DG_1 = await getDGBalancer();
        const BALANCE_BP_DG_2 = await getDGBalancer_2();
        const BALANCE_BP_DAI = await getDAIBalancer();
        const BALANCE_BP_MANA = await getMANABalancer();
        const BALANCE_ROOT_DG = await getDGMainchain();
        const BALANCE_CHILD_DG = await getDGMatic();
        const BALANCE_CHILD_MANA = await getMaticMana();
        const BALANCE_CHILD_DAI = await getMaticDai(); //
        const BALANCE_STAKING_GOVERNANCE = await getDGBalanceStakingGovernace(); // governance
        const BALANCE_STAKING_UNISWAP = await getDGBalanceStakingUniswap();
        const BALANCE_UNISWAP_DG = await getDGUniswap();
        const BALANCE_UNISWAP_ETH = await getETHUniswap();

        // calculate price of mana locked in balancer
        let response = await Fetch.MANA_PRICE();
        let json = await response.json();
        let temp = json.market_data.current_price.usd;
        const TOTAL_MANA = temp * BALANCE_BP_MANA;

        // get BPT supply of pool 1
        let response_2 = await Fetch.BPT_SUPPLY_1();
        let json_2 = await response_2.json();
        const SUPPLY_BTP_1 = json_2.result / Global.CONSTANTS.FACTOR;

        // get BPT supply of pool 2
        let response_3 = await Fetch.BPT_SUPPLY_2();
        let json_3 = await response_3.json();
        const SUPPLY_BTP_2 = json_3.result / Global.CONSTANTS.FACTOR;

        // console.log('DG points balance gameplay: ' + BALANCE_MINING_DG);
        // console.log('DG points balance pool 1: ' + BALANCE_STAKING_BALANCER_1);
        // console.log('DG points balance pool 2: ' + BALANCE_STAKING_BALANCER_2);
        // console.log('DG points balance airdrop: ' + BALANCE_KEEPER_DG);
        // console.log('DG points balance gov: ' + BALANCE_STAKING_GOVERNANCE);
        // console.log('DG mainchain balance: ' + BALANCE_ROOT_DG);
        // console.log('DG matic balance: ' + BALANCE_CHILD_DG);
        // console.log('DG BP balance pool 1: ' + BALANCE_BP_DG_1);
        // console.log('DG BP balance pool 2: ' + BALANCE_BP_DG_2);
        // console.log('MANA BP value (in usd) pool 1: ' + TOTAL_MANA);
        // console.log('BPT supply pool 1: ' + SUPPLY_BTP_1);
        // console.log('BPT supply pool 2: ' + SUPPLY_BTP_2);
        // console.log('DAI BP balance pool 2: ' + BALANCE_BP_DAI);
        // console.log('Treasury mana: ' + BALANCE_CHILD_MANA);
        // console.log('Treasury dai: ' + BALANCE_CHILD_DAI);

        dispatch({
          type: 'dg_balances',
          data: {
            BALANCE_MINING_DG: BALANCE_MINING_DG, // 0
            BALANCE_STAKING_BALANCER_1: BALANCE_STAKING_BALANCER_1, // 1
            BALANCE_STAKING_BALANCER_2: BALANCE_STAKING_BALANCER_2, // 2
            BALANCE_KEEPER_DG: BALANCE_KEEPER_DG, // 3
            BALANCE_BP_DG_1: BALANCE_BP_DG_1, // 4
            BALANCE_BP_DG_2: BALANCE_BP_DG_2, // 9
            BALANCE_BP_DAI: BALANCE_BP_DAI, // 5
            BALANCE_ROOT_DG: BALANCE_ROOT_DG, // 6
            BALANCE_CHILD_DG: BALANCE_CHILD_DG, // 7
            TOTAL_MANA: TOTAL_MANA, // 8
            SUPPLY_BTP_1: SUPPLY_BTP_1, // 10
            SUPPLY_BTP_2: SUPPLY_BTP_2, // 11
            BALANCE_CHILD_MANA: BALANCE_CHILD_MANA, // 12
            BALANCE_CHILD_DAI: BALANCE_CHILD_DAI, // 13
            BALANCE_STAKING_GOVERNANCE: BALANCE_STAKING_GOVERNANCE, // 14
            BALANCE_STAKING_UNISWAP: BALANCE_STAKING_UNISWAP, // 15
            BALANCE_UNISWAP_DG: BALANCE_UNISWAP_DG, // 16
            BALANCE_UNISWAP_ETH: BALANCE_UNISWAP_ETH, // 17
          },
        });

        // update global state staking DG and balancer pool tokens
        const balanceStaking = await getTokensStaking();

        // console.log('!!!!!!!!');
        // console.log('earned uni: ' + BALANCE_STAKING_UNISWAP);
        // console.log('balance uni wallet: ' + balanceStaking[13]);
        // console.log('balance uni staked: ' + balanceStaking[12]);
        // console.log('balance dg in uniswap: ' + balanceStaking[11]);
        // console.log('balance of uni total: ' + balanceStaking[10]);
        // console.log(BALANCE_UNISWAP_DG);
        // console.log(BALANCE_UNISWAP_ETH);

        // console.log('Balance BPT (contract pool 1):  ' + balanceStaking[0]);
        // console.log('Balance DG (contract pool 1):  ' + balanceStaking[1]);
        // console.log('Balance BPT (staked pool 1):  ' + balanceStaking[2]);
        // console.log('Balance BPT (wallet pool 1):  ' + balanceStaking[3]);
        // console.log('Balance BPT (contract pool 2):  ' + balanceStaking[4]);
        // console.log('Balance DG (contract pool 2):  ' + balanceStaking[5]);
        // console.log('Balance BPT (staked pool 2):  ' + balanceStaking[6]);
        // console.log('Balance BPT (wallet pool 2):  ' + balanceStaking[7]);
        // console.log('Balance DG total staked (gov): ' + balanceStaking[8]);
        // console.log('Balance DG user staked (gov): ' + balanceStaking[9]);

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
      const amount = await maticMana.methods
        .balanceOf('0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3')
        .call();

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
      // const amount = await maticDai.methods
      //   .balanceOf('0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3')
      //   .call();

      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      const balance = await Transactions.balanceOfToken(
        maticDAIContract,
        addresses.TREASURY_CONTRACT_ADDRESS,
        3
      );

      return balance;
    } catch (error) {
      console.log('No MATIC DAI balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get mainchain DG balance
  async function getDGMainchain() {
    console.log('Get Mainchain DG balance');

    try {
      // const amount = await DG_BPT.methods.balanceOf(userAddress).call();
      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      const balance = await Transactions.balanceOfToken(DG_BPT, userAddress, 0);

      return balance;
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
  // get DG locked in uniswap
  async function getDGUniswap() {
    console.log('Get DG locked in uniswap');

    try {
      const amount = await DG_BPT.methods
        .balanceOf('0x44c21f5dcb285d92320ae345c92e8b6204be8cdf')
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
  async function getETHUniswap() {
    console.log('Get ETH locked in Uniswap');

    try {
      const amount = await ETH_UNI.methods
        .balanceOf('0x44c21f5dcb285d92320ae345c92e8b6204be8cdf')
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
  async function getDGBalanceStakingBalancer1() {
    console.log(
      "Get user's DG staking balance from balancer contract (pool 1)"
    );

    try {
      // const amount = await stakingContract.methods.earned(userAddress).call();
      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      // return balanceAdjusted;

      const balanceEarned = await Transactions.balanceEarned(
        stakingContractPool1,
        userAddress,
        3
      );

      return balanceEarned;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for liquidity farming for pool 2
  async function getDGBalanceStakingBalancer2() {
    console.log(
      "Get user's DG staking balance from balancer contract (pool 2)"
    );

    try {
      // const amount = await stakingContractTwo.methods
      //   .earned(userAddress)
      //   .call();
      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      const balanceEarned = await Transactions.balanceEarned(
        stakingContractPool2,
        userAddress,
        3
      );

      return balanceEarned;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for governance
  async function getDGBalanceStakingGovernace() {
    console.log("Get user's DG staking balance from governance smart contract");

    try {
      // const amount = await stakingContractGovernance.methods
      //   .earned(userAddress)
      //   .call();
      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      const balanceEarned = await Transactions.balanceEarned(
        stakingContractGovernance,
        userAddress,
        3
      );

      return balanceEarned;
    } catch (error) {
      console.log('No DG staking balance found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's DG unclaimed balance from smart contract for uni
  async function getDGBalanceStakingUniswap() {
    console.log("Get user's DG staking balance from Uniswap contract");

    try {
      // const amount = await stakingContractThree.methods
      //   .earned(userAddress)
      //   .call();
      // const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      const balanceEarned = await Transactions.balanceEarned(
        stakingContractUniswap,
        userAddress,
        3
      );

      return balanceEarned;
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
  // async function getDG() {
  //   try {
  //     const amount = await DGTokenContract.methods
  //       .balanceOf(0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d)
  //       .call();
  //     const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

  //     return balanceAdjusted;
  //   } catch (error) {
  //     console.log('No DG keeper balance found: ' + error);
  //   }
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get user's total staking contract & wallet DG balance
  async function getTokensStaking() {
    console.log('Get staking DG, BPT, UNI');

    try {
      // POOL 1
      const BALANCE_CONTRACT_BPT_1 = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS,
        4
      );

      const BALANCE_CONTRACT_BPT_2 = await Transactions.balanceOfToken(
        BPT_CONTRACT_2,
        addresses.DG_STAKING_CONTRACT_ADDRESS_2,
        4
      );

      const BALANCE_CONTRACT_DG_1 = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS,
        4
      );

      const BALANCE_CONTRACT_DG_2 = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS_2,
        4
      );

      const BALANCE_STAKED_BPT_1 = await Transactions.balanceOfToken(
        stakingContractPool1,
        userAddress,
        0
      );

      const BALANCE_STAKED_BPT_2 = await Transactions.balanceOfToken(
        stakingContractPool2,
        userAddress,
        0
      );

      const BALANCE_WALLET_BPT_1 = await Transactions.balanceOfToken(
        BPT_CONTRACT,
        userAddress,
        0
      );

      const BALANCE_WALLET_BPT_2 = await Transactions.balanceOfToken(
        BPT_CONTRACT_2,
        userAddress,
        0
      );

      // gov
      const BALANCE_CONTRACT_GOVERNANCE = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_GOVERNANCE_ADDRESS
      );

      const BALANCE_USER_GOVERNANCE = await Transactions.balanceOfToken(
        stakingContractGovernance,
        userAddress,
        0
      );

      // UNI
      const BALANCE_CONTRACT_UNISWAP = await Transactions.balanceOfToken(
        UNI_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS_3,
        4
      );

      const BALANCE_CONTRACT_DG_UNISWAP = await Transactions.balanceOfToken(
        DG_TOKEN_CONTRACT,
        addresses.DG_STAKING_CONTRACT_ADDRESS_3,
        4
      );

      const BALANCE_STAKED_UNISWAP = await Transactions.balanceOfToken(
        stakingContractUniswap,
        userAddress,
        0
      );

      const BALANCE_WALLET_UNISWAP = await Transactions.balanceOfToken(
        UNI_CONTRACT,
        userAddress,
        0
      );

      return {
        BALANCE_CONTRACT_BPT_1: BALANCE_CONTRACT_BPT_1,
        BALANCE_CONTRACT_BPT_2: BALANCE_CONTRACT_BPT_2,
        BALANCE_CONTRACT_DG_1: BALANCE_CONTRACT_DG_1,
        BALANCE_CONTRACT_DG_2: BALANCE_CONTRACT_DG_2,
        BALANCE_STAKED_BPT_1: BALANCE_STAKED_BPT_1,
        BALANCE_STAKED_BPT_2: BALANCE_STAKED_BPT_2,
        BALANCE_WALLET_BPT_1: BALANCE_WALLET_BPT_1,
        BALANCE_WALLET_BPT_2: BALANCE_WALLET_BPT_2,
        BALANCE_CONTRACT_GOVERNANCE: BALANCE_CONTRACT_GOVERNANCE,
        BALANCE_USER_GOVERNANCE: BALANCE_USER_GOVERNANCE,
        BALANCE_CONTRACT_UNISWAP: BALANCE_CONTRACT_UNISWAP,
        BALANCE_CONTRACT_DG_UNISWAP: BALANCE_CONTRACT_DG_UNISWAP,
        BALANCE_STAKED_UNISWAP: BALANCE_STAKED_UNISWAP,
        BALANCE_WALLET_UNISWAP: BALANCE_WALLET_UNISWAP,
      };
    } catch (error) {
      console.log('Staking DG, BPT, UNISWAP balances error: ' + error);
    }
  }

  return null;
}

export default DGBalances;
