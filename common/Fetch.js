import call from 'common/API';
// https://api.decentral.games, http://localhost:5000
const API_BASE_URL = `https://api.${window.location.hostname}`;

const apiCall = {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (no wallet address necessary)
  TREASURY_STATS_NUMBERS: period => {
    return call(
      `${API_BASE_URL}/admin/getTreasuryBalanceHistory/${period}`,
      'GET',
      false
    );
  },

  EVENTS: () => {
    return call(`${API_BASE_URL}/players/getEvents`, 'GET', false);
  },

  GAME_RECORDS: () => {
    return call(`${API_BASE_URL}/admin/getTotalRecords`, 'GET', false);
  },

  PLAYER_DATA: address => {
    return call(`${API_BASE_URL}/admin/getCryptoRecords`, 'GET');
  },

  USERS_LIST: address => {
    return call(`${API_BASE_URL}/admin/getUsersList`, 'GET');
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (wallet address necessary)
  PLAYER_INFO: address => {
    return call(`${API_BASE_URL}/admin/getUser?address=${address}`, 'GET');
  },

  POKER_DATA: address => {
    return call(
      `${API_BASE_URL}/admin/getPokerHandHistory?address=${address}`,
      'GET'
    );
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls (no wallet address necessary)
  USER_STATUS: (address, ipAddress) => {
    return call(`${API_BASE_URL}/order/webLogin`, 'POST', true);
  },

  REGISTER: (address, ipAddress, affiliate) => {
    return call(`${API_BASE_URL}/order/webRegister`, 'POST', true, {
      affiliate,
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls (wallet address necessary)
  UPDATE_TOKEN_ARRAY: (address, index) => {
    return call(`${API_BASE_URL}/order/updateTokenArray`, 'POST', true, {
      address,
      index,
    });
  },

  TOP_UP_USER: address => {
    return call(`${API_BASE_URL}/order/topup`, 'POST', true, { address });
  },

  HISTORY_DATA: address => {
    return call(`${API_BASE_URL}/order/getHistory`, 'POST', true, {
      address,
      limit: 99999, // call all of the data
      page: 1,
    });
  },

  PLAY_DATA: address => {
    return call(`${API_BASE_URL}/order/getPlayInfo`, 'POST', true, {
      address,
      limit: 99999, // call all of the data
      page: 1,
    });
  },

  POST_HISTORY: (address, amount, type, state, txHash, step) => {
    return call(`${API_BASE_URL}/order/updateHistory`, 'POST', true, {
      address,
      amount,
      type,
      state,
      txHash,
      step,
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // third-party API calls
  NFTS_1: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0xbf53c33235cbfc22cef5a61a83484b86342679c5&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  NFTS_2: address => {
    return call(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0x7038e9d2c6f5f84469a84cf9bc5f4909bb6ac5e0&order_direction=desc&offset=0&limit=10`,
      'GET',
      false
    );
  },

  AVATAR_IMAGE: address => {
    return call(
      `https://peer.decentraland.org/lambdas/profile/${address}`,
      'GET',
      false
    );
  },

  PROPOSALS: () => {
    return call(
      `https://hub.snapshot.page/api/decentralgames.eth/proposals`,
      'GET',
      false
    );
  },

  MANA_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentraland`,
      'GET',
      false
    );
  },

  ETH_PRICE: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/ethereum`,
      'GET',
      false
    );
  },

  ATRI_PRICE: () => {
    return call(`https://api.coingecko.com/api/v3/coins/atari`, 'GET', false);
  },

  DG_SUPPLY_GECKO: () => {
    return call(
      `https://api.coingecko.com/api/v3/coins/decentral-games`,
      'GET',
      false
    );
  },

  LAND_PRICE: () => {
    return call(
      `https://nonfungible.com/api/v4/market/summary/decentraland?daily=true&filter=[{"id":"nftTicker","value":"LAND"},{"id":"saleType","value":""}]`,
      'GET',
      false
    );
  },

  POAPS: address => {
    return call(`https://api.poap.xyz/actions/scan/${address}`, 'GET', false);
  },
};

export default apiCall;
