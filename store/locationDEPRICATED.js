import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function Location() {
  // verify user's location and update userStatus in the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // let userAddress = '';
  // const value = 5;

  useEffect(() => {
    // if (state.userStatus) {
    // userAddress = window.web3.currentProvider.selectedAddress;

    async function fetchData() {
      const ipAddress = await getIPAddress();
      console.log('IP address: ' + ipAddress);

      // if (state.userStatus === 4) {
      // if (countryCode === 'US') return;

      // update global state user status
      dispatch({
        type: 'ip_address',
        data: ipAddress,
      });

      // update user status in database
      // console.log('Posting user status to db: ' + value);
      // Fetch.USER_VERIFY(state.userAddress, value, state.affiliateAddress);
      // }
    }
    fetchData();
    // }
  }, []);

  async function getIPAddress() {
    const response = await Fetch.COUNTRY_CODE();
    const json = await response.json();

    // console.log(json);

    return json.ip;
  }

  return null;
}

export default Location;