import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function Location() {
  // dispatch user's location boolean to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let bool = true;

  useEffect(() => {
    async function fetchData() {
      const countryCode = await getCountryCode();
      console.log('Country code: ' + countryCode);

      if (countryCode === 'US') bool = false;

      dispatch({
        type: 'ip_address',
        data: bool,
      });
    }
    fetchData();
  }, []);

  async function getCountryCode() {
    const response = await Global.fetchCountryCode();
    const json = await response.json();

    return json.country_code;
  }

  return null;
}

export default Location;
