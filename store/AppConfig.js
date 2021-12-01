import { useContext, useEffect } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';
import { assignToken } from '../components/button/ButtonStartConnect';

function AppConfig() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  useEffect(() => {
    // Call on initial load and after the user logs in
    if (!state || state.userLoggedIn) {
      // fetch user status
      async function fetchData() {
        const accessToken = localStorage.getItem('token');

        // Get authToken if not already available
        if (!accessToken) {
          console.log('Getting access token...');
          await assignToken();
        }
        const response = await getAppConfig();

        if (response) {
          dispatch({
            type: 'app_config',
            data: response,
          });
        }
      }

      console.log('app config...');
      console.log(response);

      if (response) {
        dispatch({
          type: 'app_config',
          data: response,
        });
      }
    }
  }, [state.userLoggedIn]);

  async function getAppConfig() {
    try {
      const appConfig = await Fetch.APP_CONFIG();
      console.log('APP_CONFIG (appConfig): ', appConfig);

      return appConfig;
    } catch (err) {
      console.error(`Couldn't get appConfig`, err);
      return;
    }
  }

  return null;
}

export default AppConfig;