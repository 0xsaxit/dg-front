import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Fetch from '../common/Fetch';

const Whitelist = () => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let whitelistedAdmin = false;
  let whitelistedIntel = false;

  useEffect(() => {
    if (state.userStatus >= 4) {
      async function fetchData() {
        const userAddress = state.userAddress.toUpperCase();

        const response = await Fetch.GET_ADDRESSES(userAddress);
        let json = await response.json();

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        const arrayUpperCaseAdmin = json.FOUNDERS.map((a) => a.toUpperCase());

        if (arrayUpperCaseAdmin.includes(userAddress)) {
          whitelistedAdmin = true;
        }

        dispatch({
          type: 'set_whitelisted_admin',
          data: whitelistedAdmin,
        });

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        const arrayUpperCaseIntel = json.INTEL.map((a) => a.toUpperCase());

        if (arrayUpperCaseIntel.includes(userAddress)) {
          whitelistedIntel = true;
        }

        dispatch({
          type: 'set_whitelisted_intel',
          data: whitelistedIntel,
        });
      }

      fetchData();
    }
  }, [state.userStatus]);

  return null;
};

export default Whitelist;
