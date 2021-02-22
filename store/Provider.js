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
  userInfo: [],
  userBalances: [
    [0, 0],
    [0, 0],
    [0, 0],
  ],
  transactions: [[], []],
  txHash: '',
  tokenPings: 0,
  // parcelDataAll: {},
  parcelDataUser: {},
  gameRecords: {},
  balancesOverlay: 0,
  networkID: 0,
  activeStatus: true,
  ethBalance: 0,
  adminBalances: [
    [0, 0],
    [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ],
  ],
  // adminHistory: [[], []],
  DGBalances: {
    BALANCE_BP_DG_1: 0,
    BALANCE_BP_DG_2: 0,
    BALANCE_BP_DAI: 0,
    BALANCE_ROOT_DG: 0,
    BALANCE_CHILD_DG: 0,
    BALANCE_CHILD_MANA: 0,
    BALANCE_CHILD_DAI: 0,
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
  },
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
  refreshBalances: true,
  stakeTime: 0,
  affiliateAddress: `{sessionStorage.getItem('ref')}`,
  toggleTheme: 'light',
  whitelisted: false,
  // countryCode: '',
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

    case 'tx_hash':
      return {
        ...state,
        txHash: action.data,
      };

    case 'token_pings':
      return {
        ...state,
        tokenPings: action.data,
      };

    // case 'parcel_data_all':
    //   return {
    //     ...state,
    //     parcelDataAll: action.data,
    //   };

    case 'parcel_data_user':
      return {
        ...state,
        parcelDataUser: action.data,
      };

    case 'update_records':
      return {
        ...state,
        gameRecords: action.data,
      };

    case 'balances_overlay':
      return {
        ...state,
        balancesOverlay: action.data,
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

    // case 'admin_history':
    //   return {
    //     ...state,
    //     adminHistory: action.data,
    //   };

    case 'dg_balances':
      return {
        ...state,
        DGBalances: action.data,
      };

    case 'staking_balances':
      return {
        ...state,
        stakingBalances: action.data,
      };

    case 'refresh_balances':
      return {
        ...state,
        refreshBalances: action.data,
      };

    case 'stake_time':
      return {
        ...state,
        stakeTime: action.data,
      };

    case 'affiliate_address':
      return {
        ...state,
        affiliateAddress: action.data,
      };

    case 'toggle_theme':
      return {
        ...state,
        theme: action.data,
      };

    case 'set_whitelisted':
      return {
        ...state,
        whitelisted: action.data,
      };

    // case 'country_code':
    //   return {
    //     ...state,
    //     countryCode: action.data,
    //   };

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
