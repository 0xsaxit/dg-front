// https://api.decentral.games, http://localhost:5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const Fetch = {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls
  GET_ADDRESSES: (address) => {
    return fetch(`${API_BASE_URL}/addresses?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  GAME_RECORDS: (address) => {
    return fetch(`${API_BASE_URL}/admin/getTotalRecords?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  TREASURY_STATS_GRAPH: (address) => {
    return fetch(`${API_BASE_URL}/admin/getTreasuryBalanceHistory/week?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  TREASURY_STATS_NUMBERS: (address) => {
    return fetch(`${API_BASE_URL}/admin/getTreasuryBalanceHistory/hour?address=${address}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  PARCEL_DATA: (landID, tokenID, address) => {
    return fetch(
      `${API_BASE_URL}/nft/${landID}/${tokenID}?address=${address}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
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

  // ADMIN_HISTORY: () => {
  //   return fetch(`${API_BASE_URL}/admin/getHistory?address=${address}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // },

  // MACHINE_DATA: () => {
  //   return fetch(`${API_BASE_URL}/admin/getMachine?address=${address}`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // POST API calls
  USER_STATUS: (address) => {
    return fetch(`${API_BASE_URL}/order/verifyAddress`, {
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

  USER_VERIFY: (address, step, affiliate) => {
    return fetch(`${API_BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        verifyStep: step,
        affiliate: affiliate,
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
  COUNTRY_CODE: () => {
    return fetch(`https://ipapi.co/json`);
  },

  NFTS: (address) => {
    return fetch(`https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  AVATAR_IMAGE: (address) => {
    return fetch(`https://peer.decentral.games/lambdas/profile/${address}`, {
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

  DG_SUPPLY_GECKO: () => {
    return fetch(`https://api.coingecko.com/api/v3/coins/decentral-games`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  BPT_SUPPLY_1: () => {
    return fetch(
      `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0xca54c398195fce98856888b0fd97a9470a140f71&apikey=343PW1Z28AS3KMI3VQRBBCF7ZN6JFIU12W`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },

  LAND_PRICE: () => {
    return fetch(`https://nonfungible.com/api/v4/market/summary/decentraland?daily=true&filter=[{"id":"nftTicker","value":"LAND"},{"id":"saleType","value":""}]`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  BPT_SUPPLY_2: () => {
    return fetch(
      `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d&apikey=343PW1Z28AS3KMI3VQRBBCF7ZN6JFIU12W`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
  },
};

export default Fetch;
