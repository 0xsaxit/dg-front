import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_CHILD_TOKEN_MANA from '../components/ABI/ABIChildTokenMANA';
import ABI_ICE_LP from '../components/ABI/ABILiquidityICE';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
// import Fetch from '../common/Fetch';

function DGBalances() {
  // dispatch user's unclaimed DG balance to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [pointerContract, setPointerContract] = useState({});
  const [pointerContractNew, setPointerContractNew] = useState({});
  const [stakingContractPool1, setStakingContractPool1] = useState({});
  const [stakingContractPool2, setStakingContractPool2] = useState({});
  const [stakingContractUniswap, setStakingContractUniswap] = useState({});
  const [stakeContractGovernance, setStakeContractGovernance] = useState({});
  const [DGTokenContract, setDGTokenContract] = useState({});
  const [DGMaticContract, setDGMaticContract] = useState({});
  const [BPTContract1, setBPTContract1] = useState({});
  const [BPTContract2, setBPTContract2] = useState({});
  const [uniswapContract, setUniswapContract] = useState({});
  const [keeperContract, setKeeperContract] = useState({});
  const [maticMana, setMaticMana] = useState({});
  const [maticDAIContract, setMaticDAIContract] = useState({});
  const [DAI_BPT, setDAI_BPT] = useState({});
  const [MANA_BPT, setMANA_BPT] = useState({});
  const [ETH_UNI, setETH_UNI] = useState({});
  const [iceContract, setIceContract] = useState({});
  const [maticLPContract, setMaticLPContract] = useState({});
  // const [CEO_MANA, setCEO_MANA] = useState({});
  // const [CEO_DAI, setCEO_DAI] = useState({});
  const [instances, setInstances] = useState(false);

  let interval = {};
  let currentTime = 0;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        // this is for mining DG
        const pointerContract = await Transactions.pointerContract(maticWeb3);
        setPointerContract(pointerContract);

        // this is for affiliates
        const pointerContractNew = await Transactions.pointerContractNew(
          maticWeb3
        );
        setPointerContractNew(pointerContractNew);

        // set up dg token contract (same for both pools)
        const DGTokenContract = await Transactions.DGTokenContract(web3);
        setDGTokenContract(DGTokenContract);

        // matic contract to get DG balance on matic chain for modal
        const DGMaticContract = new maticWeb3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG
        );
        setDGMaticContract(DGMaticContract);

        const DAI_BPT = new web3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DAI
        );
        setDAI_BPT(DAI_BPT);

        const ETH_UNI = new web3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.UNISWAP_ADDRESS_WETH
        );
        setETH_UNI(ETH_UNI);

        const DG_MANA = new web3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.ROOT_TOKEN_ADDRESS_MANA
        );
        setMANA_BPT(DG_MANA);

        const MATIC_MANA = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
        );
        setMaticMana(MATIC_MANA);

        const maticDAIContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
        );
        setMaticDAIContract(maticDAIContract);

        const maticICEContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_MANA,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE
        );
        setIceContract(maticICEContract);

        const maticLPContract = new maticWeb3.eth.Contract(
          ABI_ICE_LP,
          "0x9e3880647C07BA13E65663DE29783eCD96Ec21dE"
        );
        setMaticLPContract(maticLPContract); 

        console.log(maticLPContract);

        const stakingContractPool1 = await Transactions.stakingContractPool1(
          web3
        );
        setStakingContractPool1(stakingContractPool1);

        const stakingContractPool2 = await Transactions.stakingContractPool2(
          web3
        );
        setStakingContractPool2(stakingContractPool2);

        const keeperContract = await Transactions.keeperContract(web3);
        setKeeperContract(keeperContract);

        const stakeContractGovernance = await Transactions.stakingContractGovernance(
          web3
        );
        setStakeContractGovernance(stakeContractGovernance);

        const BPTContract1 = await Transactions.BPTContract1(web3);
        setBPTContract1(BPTContract1);

        const BPTContract2 = await Transactions.BPTContract2(web3);
        setBPTContract2(BPTContract2);

        const stakingContractUniswap = await Transactions.stakingContractUniswap(
          web3
        );
        setStakingContractUniswap(stakingContractUniswap);

        const uniswapContract = await Transactions.uniswapContract(web3);
        setUniswapContract(uniswapContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  // anytime user updates values on /dg pages this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        // update global state unclaimed DG points balances
        const tokenBalances = await getTokenBalances();

        dispatch({
          type: 'dg_balances',
          data: tokenBalances,
        });

        // get historical gameplay collected amount
        const DGGameplayCollected = await getDGGameplayCollected();

        dispatch({
          type: 'dg_gameplay_collected',
          data: DGGameplayCollected,
        });

        // update global state staking DG and balancer pool tokens
        const balancesStaking = await getBalancesStaking();

        dispatch({
          type: 'staking_balances',
          data: balancesStaking,
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
  async function getTokenBalances() {
    try {
      const BALANCE_BP_DG_1 = await Transactions.balanceOfToken(
        DGTokenContract, // was DG_BPT
        Global.ADDRESSES.BP_TOKEN_ADDRESS_2,
        3
      );

      const BALANCE_BP_DG_2 = await Transactions.balanceOfToken(
        DGTokenContract, // was DG_BPT_2
        Global.ADDRESSES.BP_TOKEN_ADDRESS_1,
        3
      );

      const BALANCE_BP_DAI = await Transactions.balanceOfToken(
        DAI_BPT,
        Global.ADDRESSES.BP_TOKEN_ADDRESS_2,
        3
      );

      const BALANCE_BP_MANA = await Transactions.balanceOfToken(
        MANA_BPT,
        Global.ADDRESSES.BP_TOKEN_ADDRESS_1,
        3
      );

      const BALANCE_ROOT_DG = await Transactions.balanceOfToken(
        DGTokenContract, // was DG_BPT
        state.userAddress,
        0
      );

      const UNVESTED_DG_1 = await Transactions.balanceOfToken(
        DGTokenContract,
        "0x9e78ADcc93eA1CD666f37ECfC3c5a868Ae55d274",
        3
      );

      const UNVESTED_DG_2 = await Transactions.balanceOfToken(
        DGMaticContract,
        "0x9e78ADcc93eA1CD666f37ECfC3c5a868Ae55d274",
        3
      );

      // const BALANCE_TREASURY_DG = await Transactions.balanceOfToken(
      //   DGTokenContract,
      //   '0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09',
      //   0
      // );

      const BALANCE_CHILD_DG = await Transactions.balanceOfToken(
        DGMaticContract,
        state.userAddress,
        3
      );

      const BALANCE_ICE = await Transactions.balanceOfToken(
        iceContract,
        "0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09",
        3
      );

      // const BALANCE_CHILD_MANA = await Transactions.balanceOfToken(
      //   maticMana,
      //   Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      //   3
      // );

      // const BALANCE_CHILD_DAI = await Transactions.balanceOfToken(
      //   maticDAIContract,
      //   Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS,
      //   3
      // );

      // const CEO_DAI = await Transactions.balanceOfToken(
      //   maticDAIContract,
      //   '0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09',
      //   3
      // );

      // const CEO_MANA = await Transactions.balanceOfToken(
      //   maticMana,
      //   '0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09',
      //   3
      // );

      const BALANCE_UNISWAP_DG = await Transactions.balanceOfToken(
        DGTokenContract, // was DG_BPT
        Global.ADDRESSES.UNISWAP_ADDRESS_STAKING,
        3
      );

      const BALANCE_UNISWAP_ETH = await Transactions.balanceOfToken(
        ETH_UNI,
        Global.ADDRESSES.UNISWAP_ADDRESS_STAKING,
        3
      );

      const BALANCE_STAKING_BALANCER_1 = await Transactions.balanceEarned(
        stakingContractPool1,
        state.userAddress,
        3
      );

      const BALANCE_STAKING_BALANCER_2 = await Transactions.balanceEarned(
        stakingContractPool2,
        state.userAddress,
        3
      );

      const BALANCE_STAKING_GOVERNANCE = await Transactions.balanceEarned(
        stakeContractGovernance,
        state.userAddress,
        3
      );

      const BALANCE_STAKING_UNISWAP = await Transactions.balanceEarned(
        stakingContractUniswap,
        state.userAddress,
        3
      );

      const BALANCE_MINING_DG = await getDGBalanceGameplay(); // gameplay mining balance v1

      const BALANCE_MINING_DG_V2 = await getDGBalanceGameplayV2(); // gameplay mining balance v2

      const BALANCE_KEEPER_DG = await getDGBalanceKeeper(); // airdrop balance

      const BALANCE_AFFILIATES = await getAffiliateBalances(); // affiliate balances

      const BALANCE_UNCLAIMED = await getDGGameplayUnclaimed(); // unclaimed dg in rewards contract

      const USDC_BALANCE_LP = await getUSDCBalanceLP(); // get USDC balance in LP

      const ICE_BALANCE_LP = await getICEBalanceLP(); // get ice balance in LP

      return {
        BALANCE_BP_DG_1: BALANCE_BP_DG_1,
        BALANCE_BP_DG_2: BALANCE_BP_DG_2,
        BALANCE_BP_DAI: BALANCE_BP_DAI,
        BALANCE_ROOT_DG: BALANCE_ROOT_DG,
        BALANCE_CHILD_DG: BALANCE_CHILD_DG,
        UNVESTED_DG_1: UNVESTED_DG_1,
        UNVESTED_DG_2: UNVESTED_DG_2,
        BALANCE_ICE: BALANCE_ICE,
        // BALANCE_CHILD_MANA: BALANCE_CHILD_MANA,
        // BALANCE_CHILD_DAI: BALANCE_CHILD_DAI,
        BALANCE_UNISWAP_DG: BALANCE_UNISWAP_DG,
        BALANCE_UNISWAP_ETH: BALANCE_UNISWAP_ETH,
        BALANCE_STAKING_BALANCER_1: BALANCE_STAKING_BALANCER_1,
        BALANCE_STAKING_BALANCER_2: BALANCE_STAKING_BALANCER_2,
        BALANCE_STAKING_GOVERNANCE: BALANCE_STAKING_GOVERNANCE,
        BALANCE_STAKING_UNISWAP: BALANCE_STAKING_UNISWAP,
        BALANCE_MINING_DG: BALANCE_MINING_DG,

        // DG_MINING_COLLECTED: DG_MINING_COLLECTED,

        BALANCE_MINING_DG_V2: BALANCE_MINING_DG_V2,
        BALANCE_KEEPER_DG: BALANCE_KEEPER_DG,

        // CEO_MANA: CEO_MANA,
        // CEO_DAI: CEO_DAI,

        // BALANCE_TREASURY_DG: BALANCE_TREASURY_DG,
        BALANCE_AFFILIATES: BALANCE_AFFILIATES,
        BALANCE_UNCLAIMED: BALANCE_UNCLAIMED,
        ICE_BALANCE_LP: ICE_BALANCE_LP,
        USDC_BALANCE_LP: USDC_BALANCE_LP,

      };
    } catch (error) {
      console.log('Token balances error: ' + error);
    }
  }

  // get user's DG points balance from smart contract for gameplay mining
  async function getDGBalanceGameplay() {
    try {
      const amount = await pointerContract.methods
        .pointsBalancer(state.userAddress)
        .call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  // get historical DG gameplay rewards amount from dgPointer smart contract
  async function getDGGameplayCollected() {
    try {
      const events = await DGMaticContract.getPastEvents('Transfer', {
        filter: {
          to: state.userAddress,
          from: Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS_NEW,
        },
        fromBlock: 7564153, // 16890328,
        toBlock: 'latest',
      });

      let valueAdjusted = 0;
      if (events.length) {
        const value = events[0].returnValues.value;
        valueAdjusted = (value / Global.CONSTANTS.FACTOR).toFixed(3);

        console.log(
          'Returned gameplay rewards collected value: ' + valueAdjusted
        );
      } else {
        console.log('No gameplay rewards collected thus far');
      }

      return valueAdjusted;
    } catch (error) {
      console.log('Get gameplay rewards collected error: ' + error);
    }
  }

  // get user's DG points balance from smart contract for gameplay mining
  async function getDGBalanceGameplayV2() {
    try {
      const amount = await pointerContractNew.methods
        .pointsBalancer(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG
        )
        .call();

      const pointsAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return pointsAdjusted;
    } catch (error) {
      console.log('No DG points found: ' + error);
    }
  }

  // get user's DG unclaimed balance from smart contract for keeping funds
  async function getDGBalanceKeeper() {
    try {
      const amount = await keeperContract.methods
        .availableBalance(state.userAddress)
        .call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  // get ice and usdc balances in lp pool
  async function getUSDCBalanceLP() {
    try {
      const amount = await maticLPContract.methods
        .getReserves().call();

      const usdc = (amount[0] / 1000000);

      return usdc;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  async function getICEBalanceLP() {
    try {
      const amount = await maticLPContract.methods
        .getReserves().call();

      const ice = (amount[1] / 1000000000000000000);

      return ice;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  // get contracts DG unclaimed balance from smart contract for keeping funds
  async function getDGGameplayUnclaimed() {
    try {
      const amount = await keeperContract.methods
        .availableBalance("0x9e78ADcc93eA1CD666f37ECfC3c5a868Ae55d274")
        .call();
      const balanceAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(3);

      return balanceAdjusted;
    } catch (error) {
      console.log('No DG keeper balance found: ' + error);
    }
  }

  // get user's affiliate balances
  async function getAffiliateBalances() {
    try {
      const amountMana = await pointerContractNew.methods
        .profitPagination(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA,
          0,
          50
        )
        .call();

      const amountDai = await pointerContractNew.methods
        .profitPagination(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI,
          0,
          50
        )
        .call();

      const amountUSDT = await pointerContractNew.methods
        .profitPagination(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT,
          0,
          50
        )
        .call();
      const amountAtri = await pointerContractNew.methods
        .profitPagination(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI,
          0,
          50
        )
        .call();
      const amountEth = await pointerContractNew.methods
        .profitPagination(
          state.userAddress,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH,
          0,
          50
        )
        .call();

      const wrappedResult = amountMana._players.map((address, index) => {
        return {
          address,
          mana: amountMana._profits[index] / Global.CONSTANTS.FACTOR,
          dai: amountDai._profits[index] / Global.CONSTANTS.FACTOR,
          usdt: amountUSDT._profits[index] / Global.CONSTANTS.FACTOR,
          atri: amountAtri._profits[index] / Global.CONSTANTS.FACTOR,
          eth: amountEth._profits[index] / Global.CONSTANTS.FACTOR,
        };
      });

      return wrappedResult;
    } catch (error) {
      console.log('Affiliate array not found: ' + error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function getBalancesStaking() {
    try {
      const BALANCE_CONTRACT_BPT_1 = await Transactions.balanceOfToken(
        BPTContract1,
        Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1,
        4
      );

      const BALANCE_CONTRACT_BPT_2 = await Transactions.balanceOfToken(
        BPTContract2,
        Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_2,
        4
      );

      const BALANCE_CONTRACT_DG_1 = await Transactions.balanceOfToken(
        DGTokenContract,
        Global.ADDRESSES.DG_STAKING_BALANCER_ADDRESS_1,
        4
      );

      const BALANCE_STAKED_BPT_1 = await Transactions.balanceOfToken(
        stakingContractPool1,
        state.userAddress,
        0
      );

      const BALANCE_STAKED_BPT_2 = await Transactions.balanceOfToken(
        stakingContractPool2,
        state.userAddress,
        0
      );

      const BALANCE_WALLET_BPT_1 = await Transactions.balanceOfToken(
        BPTContract1,
        state.userAddress,
        0
      );

      const BALANCE_WALLET_BPT_2 = await Transactions.balanceOfToken(
        BPTContract2,
        state.userAddress,
        0
      );

      const BALANCE_CONTRACT_GOVERNANCE = await Transactions.balanceOfToken(
        DGTokenContract,
        Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS
      );

      const BALANCE_USER_GOVERNANCE = await Transactions.balanceOfToken(
        stakeContractGovernance,
        state.userAddress,
        0
      );

      const BALANCE_CONTRACT_UNISWAP = await Transactions.balanceOfToken(
        uniswapContract,
        Global.ADDRESSES.DG_STAKING_UNISWAP_ADDRESS,
        4
      );

      const BALANCE_STAKED_UNISWAP = await Transactions.balanceOfToken(
        stakingContractUniswap,
        state.userAddress,
        0
      );

      // const BALANCE_STAKED_UNISWAP_TREASURY = await Transactions.balanceOfToken(
      //   stakingContractUniswap,
      //   '0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09',
      //   0
      // );

      const BALANCE_WALLET_UNISWAP = await Transactions.balanceOfToken(
        uniswapContract,
        state.userAddress,
        0
      );

      return {
        BALANCE_CONTRACT_BPT_1: BALANCE_CONTRACT_BPT_1,
        BALANCE_CONTRACT_BPT_2: BALANCE_CONTRACT_BPT_2,
        BALANCE_CONTRACT_DG_1: BALANCE_CONTRACT_DG_1,
        BALANCE_STAKED_BPT_1: BALANCE_STAKED_BPT_1,
        BALANCE_STAKED_BPT_2: BALANCE_STAKED_BPT_2,
        BALANCE_WALLET_BPT_1: BALANCE_WALLET_BPT_1,
        BALANCE_WALLET_BPT_2: BALANCE_WALLET_BPT_2,
        BALANCE_CONTRACT_GOVERNANCE: BALANCE_CONTRACT_GOVERNANCE,
        BALANCE_USER_GOVERNANCE: BALANCE_USER_GOVERNANCE,
        BALANCE_CONTRACT_UNISWAP: BALANCE_CONTRACT_UNISWAP,
        BALANCE_STAKED_UNISWAP: BALANCE_STAKED_UNISWAP,
        // BALANCE_STAKED_UNISWAP_TREASURY: BALANCE_STAKED_UNISWAP_TREASURY,
        BALANCE_WALLET_UNISWAP: BALANCE_WALLET_UNISWAP,
      };
    } catch (error) {
      console.log('Staking balances error: ' + error);
    }
  }

  return null;
}

export default DGBalances;
