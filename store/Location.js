import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function Location() {
  // verify user's location and update userStatus in the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  const value = 5;

  useEffect(() => {
    if (state.userStatus >= 4) {
      userAddress = window.web3.currentProvider.selectedAddress;

      async function fetchData() {
        const countryCode = await getCountryCode();
        console.log('Country code: ' + countryCode);

        if (state.userStatus === 4) {
          // if (countryCode === 'US') return;

          // update global state user status
          dispatch({
            type: 'update_status',
            data: value,
          });

          // update user status in database
          console.log('Posting user status to db: ' + value);

          Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);
        }
      }
      fetchData();
    }
  }, [state.userStatus]);

  async function getCountryCode() {
    const response = await Fetch.COUNTRY_CODE();
    const json = await response.json();

    return json.country_code;
  }

  return null;
}

export default Location;
