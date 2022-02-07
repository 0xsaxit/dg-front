import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import Fetch from '../common/Fetch';
import { assignToken } from "../components/button/ButtonConnect";

function AppConfig() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    fetchData();
  }, []);

  // fetch user status
  async function fetchData() {
    let accessToken = localStorage.getItem('token');

    // Get authToken if not already available
    if (!accessToken) {
      console.log('No access token found.');
      await assignToken(dispatch);
    } else {
      // Check if token is valid
      console.log('Verifying existing access token.');
      const { isTokenValid } = await verifyToken();

      // If token is invalid, clear old token and fetch new token
      if (!isTokenValid) {
        console.log('Access token expired. Removing token.');
        dispatch({
          type: 'set_userLoggedIn',
          data: false,
        });

        await assignToken(dispatch);
        console.log('Using new access token.');
      } else {
        console.log('Access token valid: using existing token.');
        dispatch({
          type: 'set_userLoggedIn',
          data: true,
        });
      }
    }

    const response = await getAppConfig();

    if (response) {
      dispatch({
        type: 'app_config',
        data: response,
      });
    }
  }

  async function verifyToken() {
    try {
      const isTokenValid = await Fetch.VERIFY_TOKEN();
      console.log('isTokenValid: ', isTokenValid);

      return isTokenValid;
    } catch (e) {
      console.error(`Couldn't get appConfig`);
      return;
    }
  }

  async function getAppConfig() {
    try {
      const appConfig = await Fetch.APP_CONFIG();
      console.log('APP_CONFIG (appConfig): ', appConfig);

      return appConfig;
    } catch (e) {
      console.error(`Couldn't get appConfig`);
      return;
    }
  }

  return null;
}

export default AppConfig;
