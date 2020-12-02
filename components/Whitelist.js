import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Fetch from '../common/Fetch';

const Whitelist = () => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [whitelisted, setWhitelisted] = useState(false);

  useEffect(() => {
    if (state.userStatus) {
      async function fetchData() {
        console.log('Fetching admin addresses...');

        const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();

        const response = await Fetch.GET_ADDRESSES();
        const json = await response.json();
        const arrayUpperCase = json.ADMIN_ADDRESSES.map((a) => a.toUpperCase());

        // console.log('user address: ' + userAddress);
        // console.log('array upper-case: ' + arrayUpperCase);

        // setAdminAddresses(arrayUpperCase);
        if (arrayUpperCase.includes(userAddress)) {
          // console.log('return true');

          setWhitelisted(true);
        }
      }

      // check every 1000ms
      const interval = setInterval(() => {
        fetchData();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [state.userStatus]);

  return whitelisted;
};

export default Whitelist;
