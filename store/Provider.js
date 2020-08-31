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
  balances: [[], []],
  transactions: [[], []],
  // messageBox: 0,
  tokenPings: 0,
  parcelData: {},
  gameRecords: {},
  balancesOverlay: 0,
  networkID: 0,
  // location: true,
  activeStatus: true,
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
        balances: action.data,
      };

    case 'update_history':
      return {
        ...state,
        transactions: action.data,
      };

    // case 'message_box':
    //   return {
    //     ...state,
    //     messageBox: action.data,
    //   };

    case 'token_pings':
      return {
        ...state,
        tokenPings: action.data,
      };

    case 'parcel_data':
      return {
        ...state,
        parcelData: action.data,
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

    // case 'ip_address':
    //   return {
    //     ...state,
    //     location: action.data,
    //   };

    case 'active_status':
      return {
        ...state,
        activeStatus: action.data,
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
