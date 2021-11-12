import {useContext, useEffect} from 'react';
import {GlobalContext} from './index';
import Fetch from '../common/Fetch';

function AppConfig() {
  // dispatch user's status value to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  useEffect(() => {
    // fetch user status
    async function fetchData() {
      const response = await getAppConfig();

      if (response) {
        dispatch({
          type: 'app_config',
          data: response,
        });
      }
    }
    fetchData();
  }, []);

  async function getAppConfig() {

    try {
      const appConfig = await Fetch.APP_CONFIG();

      return appConfig;
    } catch (e) {
      console.error(`Couldn't get appConfig`);
      return;
    }
  }

  return null;
}

export default AppConfig;
