import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Fetch from '../common/Fetch';

const Whitelist = () => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let whitelisted = false;

  useEffect(() => {
    if (state.userStatus >= 4) {
      async function fetchData() {
        const userAddress = window.web3.currentProvider.selectedAddress.toUpperCase();

        const response = await Fetch.GET_ADDRESSES(userAddress);
        let json = await response.json();

        const arrayUpperCase = json.ADMIN_ADDRESSES.map((a) => a.toUpperCase());

        if (arrayUpperCase.includes(userAddress)) {
          whitelisted = true;
        }

        dispatch({
          type: 'set_whitelisted',
          data: whitelisted,
        });
      }

      fetchData();
    }
  }, [state.userStatus]);

  return null;
};

export default Whitelist;
