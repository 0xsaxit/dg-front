import axios from 'axios';

const call = (url, method, withToken = true, data = {}) => {
  const accessToken = localStorage.getItem('token');

  const currentTimestamp = new Date().getTime() / 1000;
  const expiredTimestamp =
    Number(localStorage.getItem('expiretime')) || Number.MAX_SAFE_INTEGER;

  if (currentTimestamp > expiredTimestamp || !window.ethereum.selectedAddress) {
    return new Promise((resolve, reject) => {
      reject('Unauthorized Error');
    });
  }

  let header = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (withToken) {
    header['Authorization'] = `Bearer ${accessToken}`;
  }

  const options = {
    url,
    method,
    headers: header,
    data,
  };

  return axios.request(options).then(res => res.data);
};

export default call;
