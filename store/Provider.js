import { useReducer } from 'react';
import { GlobalContext } from './Context';

const initialState = {
  categories: ['All', 'Announcements', 'Tutorials', 'Technology'],
  isLoading: false,
  pages: {
    data: [],
    meta: {},
  },
  userStatus: 0,
  userAddress: '',
  userInfo: {
    name: '',
    index: 0,
    balancePLAY: 0,
    count: '',
    email: '',
    playersList: [],
    totalDAI: 0,
    totalMANA: 0,
    totalPLAY: 0,
    totalUSDT: 0,
    totalATRI: 0,
    tokenArray: [false, false, false, false, false, false],
  },
  userBalances: [
    [0, 0],
    [0, 0],
    [0, 0, 0, 0],
    [0, 0],
  ],
  transactions: [{}, {}],
  treasuryNumbers: {},
  txHash: '',
  gameRecords: {},
  networkID: 0,
  activeStatus: true,
  ethBalance: 0,
  adminBalances: {
    treasury: [0, 0, 0, 0, 0, 0, ''],
    slots: [0, 0, 0, 0, 0, 0, ''],
    roulette: [0, 0, 0, 0, 0, 0, ''],
    blackjack: [0, 0, 0, 0, 0, 0, ''],
  },
  usersList: [],
  DGBalances: {
    BALANCE_BP_DG_1: 0,
    BALANCE_BP_DG_2: 0,
    BALANCE_BP_DAI: 0,
    BALANCE_ROOT_DG: 0,
    BALANCE_CHILD_DG: 0,
    // BALANCE_CHILD_MANA: 0,
    // BALANCE_CHILD_DAI: 0,
    BALANCE_UNISWAP_DG: 0,
    BALANCE_UNISWAP_ETH: 0,
    BALANCE_STAKING_BALANCER_1: 0,
    BALANCE_STAKING_BALANCER_2: 0,
    BALANCE_STAKING_GOVERNANCE: 0,
    BALANCE_STAKING_UNISWAP: 0,
    BALANCE_MINING_DG: 0,
    BALANCE_KEEPER_DG: 0,
    TOTAL_MANA: 0,
    SUPPLY_BPT_1: 0,
    SUPPLY_BPT_2: 0,
    BALANCE_AFFILIATES: [0, 0],
  },
  DGPrices: {
    eth: 0,
    mana: 0,
    dai: 0,
    atri: 0,
    usdt: 0,
  },
  DGBreakdown: {
    eth: 0,
    mana: 0,
    dai: 0,
    atri: 0,
    usdt: 0,
  },
  wearables: [],
  poaps: [],
  eventsData: {},
  stakingBalances: {
    BALANCE_CONTRACT_BPT_1: 0,
    BALANCE_CONTRACT_BPT_2: 0,
    BALANCE_CONTRACT_DG_1: 0,
    BALANCE_STAKED_BPT_1: 0,
    BALANCE_STAKED_BPT_2: 0,
    BALANCE_WALLET_BPT_1: 0,
    BALANCE_WALLET_BPT_2: 0,
    BALANCE_CONTRACT_GOVERNANCE: 0,
    BALANCE_USER_GOVERNANCE: 0,
    BALANCE_CONTRACT_UNISWAP: 0,
    BALANCE_STAKED_UNISWAP: 0,
    BALANCE_WALLET_UNISWAP: 0,
  },
  refreshTokens: 'Initial',
  refreshBalances: true,
  updateInfo: true,
  affiliateAddress: '',
  stakeTime: 0,
  subgraphData: [],
  snapshotData: [],
  manaLoading: false,
  daiLoading: false,
  usdtLoading: false,
  atriLoading: false,
  wethLoading: false,
  dgLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'is_loading':
      return {
        ...state,
        isLoading: action.data,
      };

    case 'update_pages':
      return {
        ...state,
        pages: action.data,
      };

    case 'update_status':
      return {
        ...state,
        userStatus: action.data,
      };

    case 'user_address':
      return {
        ...state,
        userAddress: action.data,
      };

    case 'user_info':
      return {
        ...state,
        userInfo: action.data,
      };

    case 'update_balances':
      return {
        ...state,
        userBalances: action.data,
      };

    case 'update_history':
      return {
        ...state,
        transactions: action.data,
      };

    case 'treasury_numbers':
      return {
        ...state,
        treasuryNumbers: action.data,
      };

    case 'tx_hash':
      return {
        ...state,
        txHash: action.data,
      };

    case 'update_records':
      return {
        ...state,
        gameRecords: action.data,
      };

    case 'network_id':
      return {
        ...state,
        networkID: action.data,
      };

    case 'active_status':
      return {
        ...state,
        activeStatus: action.data,
      };

    case 'eth_balance':
      return {
        ...state,
        ethBalance: action.data,
      };

    case 'admin_balances':
      return {
        ...state,
        adminBalances: action.data,
      };

    case 'users_list':
      return {
        ...state,
        usersList: action.data,
      };

    case 'dg_balances':
      return {
        ...state,
        DGBalances: action.data,
      };

    case 'dg_gameplay_collected':
      return {
        ...state,
        DGGameplayCollected: action.data,
      };

    case 'staking_balances':
      return {
        ...state,
        stakingBalances: action.data,
      };

    case 'dg_prices':
      return {
        ...state,
        DGPrices: action.data,
      };

    case 'dg_breakdown':
      return {
        ...state,
        DGBreakdown: action.data,
      };

    case 'wearables':
      return {
        ...state,
        wearables: action.data,
      };

    case 'poaps':
      return {
        ...state,
        poaps: action.data,
      };

    case 'events_data':
      return {
        ...state,
        eventsData: action.data,
      };

    case 'refresh_tokens':
      return {
        ...state,
        refreshTokens: action.data,
      };

    case 'refresh_balances':
      return {
        ...state,
        refreshBalances: action.data,
      };

    case 'update_info':
      return {
        ...state,
        updateInfo: action.data,
      };

    case 'stake_time':
      return {
        ...state,
        stakeTime: action.data,
      };

    case 'subgraph_data':
      return {
        ...state,
        subgraphData: action.data,
      };

    case 'snapshot_data':
      return {
        ...state,
        snapshotData: action.data,
      };

    case 'affiliate_address':
      return {
        ...state,
        affiliateAddress: action.data,
      };

    case 'set_manaLoading':
      return {
        ...state,
        manaLoading: action.data,
      };

    case 'set_daiLoading':
      return {
        ...state,
        daiLoading: action.data,
      };

    case 'set_usdtLoading':
      return {
        ...state,
        usdtLoading: action.data,
      };

    case 'set_atriLoading':
      return {
        ...state,
        atriLoading: action.data,
      };

    case 'set_wethLoading':
      return {
        ...state,
        wethLoading: action.data,
      };
    case 'set_dgLoading':
      return {
        ...state,
        dgLoading: action.data,
      };

    default:
      throw new Error('Wrong action type got dispatched');
  }
};

const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <GlobalContext.Provider value={[state, dispatch]}>
      {children}
    </GlobalContext.Provider>
  );
};

export { Provider };
