// https://api.decentral.games, http://localhost:5000
const API_BASE_URL = 'https://api.decentral.games';

const Fetch = {
  GET_ADDRESSES: () => {
    return fetch(`${API_BASE_URL}/addresses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  },

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

  COUNTRY_CODE: () => {
    return fetch(`https://ipapi.co/json`);
  },

  PARCEL_DATA: (landID, tokenID) => {
    return fetch(`${API_BASE_URL}/nft/${landID}/${tokenID}`, {
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

  GAME_RECORDS: () => {
    return fetch(`${API_BASE_URL}/admin/getTotalRecords`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }); 
  },

  USER_NUMBERS: () => {
    return fetch(`${API_BASE_URL}/players/getPlayerCount`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
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

  //   GET_TOKENS: (address) => {
  //     return fetch(`${API_BASE_URL}/order/getTokens`, {
  //       method: 'POST',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         address: address,
  //       }),
  //     });
  //   },

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

  ADMIN_HISTORY: () => {
    return fetch(`${API_BASE_URL}/admin/getHistory`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },

  MACHINE_DATA: () => {
    return fetch(`${API_BASE_URL}/admin/getMachine`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  },
};

export default Fetch;
