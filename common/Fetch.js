// https://api.decentral.games, http://localhost:5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Fetch = {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (no wallet address necessary)
  TREASURY_STATS_NUMBERS: (period) => {
    return fetch(`${API_BASE_URL}/admin/getTreasuryBalanceHistory/${period}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls (wallet address necessary)
  GAME_RECORDS: (address) => {
    return fetch(`${API_BASE_URL}/admin/getTotalRecords?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  PLAYER_INFO: (address) => {
    return fetch(`${API_BASE_URL}/admin/getUser?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  PLAYER_DATA: (address) => {
    return fetch(`${API_BASE_URL}/admin/getCryptoRecords?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  EVENTS: (address) => {
    return fetch(
      `https://api.decentral.games/players/getEvents?address=${address}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },

  USERS_LIST: (address) => {
    return fetch(`${API_BASE_URL}/admin/getUsersList?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls
  USER_STATUS: (address, ipAddress) => {
    return fetch(`${API_BASE_URL}/order/webLogin`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        ipAddress: ipAddress,
      }),
    });
  },

  REGISTER: (address, ipAddress, affiliate) => {
    return fetch(`${API_BASE_URL}/order/webRegister`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        ipAddress: ipAddress,
        affiliate: affiliate,
      }),
    });
  },

  UPDATE_TOKEN_ARRAY: (address, index) => {
    return fetch(`${API_BASE_URL}/order/updateTokenArray`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        index: index,
      }),
    });
  },

  TOP_UP_USER: (address) => {
    return fetch(`${API_BASE_URL}/order/topup`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
      }),
    });
  },

  HISTORY_DATA: (address) => {
    return fetch(`${API_BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        limit: 99999, // fetch all of the data
        page: 1,
      }),
    });
  },

  PLAY_DATA: (address) => {
    return fetch(`${API_BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        limit: 99999, // fetch all of the data
        page: 1,
      }),
    });
  },

  POST_HISTORY: (address, amount, type, state, txHash, step) => {
    return fetch(`${API_BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        amount: amount,
        type: type,
        state: state,
        txHash: txHash,
        step: step,
      }),
    });
  },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // third-party API calls
  NFTS_1: (address) => {
    return fetch(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0xbf53c33235cbfc22cef5a61a83484b86342679c5&order_direction=desc&offset=0&limit=10`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },

  NFTS_2: (address) => {
    return fetch(
      `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=0x7038e9d2c6f5f84469a84cf9bc5f4909bb6ac5e0&order_direction=desc&offset=0&limit=10`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },

  AVATAR_IMAGE: (address) => {
    return fetch(`https://peer.decentraland.org/lambdas/profile/${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  PROPOSALS: () => {
    return fetch(`https://hub.snapshot.page/api/decentralgames.eth/proposals`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  MANA_PRICE: () => {
    return fetch(`https://api.coingecko.com/api/v3/coins/decentraland`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  ETH_PRICE: () => {
    return fetch(`https://api.coingecko.com/api/v3/coins/ethereum`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  ATRI_PRICE: () => {
    return fetch(`https://api.coingecko.com/api/v3/coins/atari`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  DG_SUPPLY_GECKO: () => {
    return fetch(`https://api.coingecko.com/api/v3/coins/decentral-games`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  LAND_PRICE: () => {
    return fetch(
      `https://nonfungible.com/api/v4/market/summary/decentraland?daily=true&filter=[{"id":"nftTicker","value":"LAND"},{"id":"saleType","value":""}]`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },

  POAPS: (address) => {
    return fetch(`https://api.poap.xyz/actions/scan/${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },
};

export default Fetch;