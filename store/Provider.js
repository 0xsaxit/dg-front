import React, { useReducer } from 'react';
import { GlobalContext } from './Context';

const initialState = {
  categories: ['All', 'Announcements', 'Tutorials', 'Technology'],
  pages: {
    data: [],
    meta: {},
  },
  userStatus: 0,
  userInfo: [],
  userBalances: [[], [], []],
  transactions: [[], []],
  txHash: '',
  tokenPings: 0,
  parcelDataAll: {},
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
  adminHistory: [[], []],
  DGBalances: [0, 0, 0, 0],
  stakingBalances: [[0], [0], [0], [0]],
  refreshBalances: true,
  stakeTime: 0,
  affiliateAddress: '',
};

const reducer = (state, action) => {
  switch (action.type) {
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

    case 'parcel_data_all':
      return {
        ...state,
        parcelDataAll: action.data,
      };

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

    case 'admin_history':
      return {
        ...state,
        adminHistory: action.data,
      };

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
