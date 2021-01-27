import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function Location() {
  // get user's location and update countryCode in the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    async function fetchData() {
      const countryCode = await getCountryCode();
      console.log('Country code: ' + countryCode);

      // update user's country code
      dispatch({
        type: 'country_code',
        data: countryCode,
      });
    }

    fetchData();
  }, []);

  async function getCountryCode() {
    const response = await Fetch.COUNTRY_CODE();
    const json = await response.json();

    console.log('ipapi...');
    console.log(json);

    return json.country_code;
  }

  return null;
}

export default Location;
