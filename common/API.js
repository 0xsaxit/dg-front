import axios from 'axios';

const call = (url, method, withToken = true, data = {}) => {
  const accessToken = localStorage.getItem('token');

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
