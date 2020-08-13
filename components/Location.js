import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function Location() {
  // dispatch user's location boolean to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let bool = true;

  // let ipAddress = '';

  useEffect(() => {
    // get the user's IP address and exclude forbidden regions
    // bool = false;

    // ipAddress = '134.201.250.155';

    async function fetchData() {
      const countryCode = await getCountryCode();

      if (countryCode === 'US') bool = false;

      console.log('Country code: ' + countryCode);

      dispatch({
        type: 'ip_address',
        data: bool,
      });
    }
    fetchData();
  }, []);

  async function getCountryCode() {
    // const ipstackObject =
    //   'https://api.ipstack.com/' +
    //   ipAddress +
    //   '?access_key=' +
    //   Global.KEYS.IPSTACK +
    //   '&fields=country_code';

    const response = await Global.fetchCountryCode();
    const json = await response.json();

    // console.log(json);

    // if (json.status === 'ok') {
    //   if (json.result === 'false') {
    //     return false;
    //   }

    //   console.log('ipstack result...');
    //   console.log(json.result);

    return json.country_code;
    // }
  }

  return null;
}

export default Location;
