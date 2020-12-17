import getConfig from 'next/config'
// https://api.decentral.games, http://localhost:5000
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const {
  publicRuntimeConfig: { API_URL } = {},
} = getConfig();

console.log('!!!!');
console.log(process.env.NEXT_PUBLIC_API_URL);

console.log('publicRuntimeConfig>>>>  ', API_URL);

const Fetch = {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // GET API calls
  GET_ADDRESSES: (address) => {
    return fetch(`${API_BASE_URL}/addresses?address=${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

  PARCEL_DATA: (landID, tokenID, address) => {
    return fetch(`${API_BASE_URL}/nft/${landID}/${tokenID}/${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
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

  // ADMIN_HISTORY: () => {
  //   return fetch(`${API_BASE_URL}/admin/getHistory`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // },

  // MACHINE_DATA: () => {
  //   return fetch(`${API_BASE_URL}/admin/getMachine`, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // },

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // third-party API calls
  COUNTRY_CODE: () => {
    return fetch(`https://ipapi.co/json`);
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
