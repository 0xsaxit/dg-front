import { GlobalContext } from '../store';
import { useContext, useState, useEffect } from 'react';
import AccountData from '../components/home/AccountData';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import Spinner from '../components/Spinner';

const Account = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, []);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {isLoading === false ? (
        <AccountData />
      ) : (
        <Spinner background={3} />
      )}
    </Layout>
  );
};

export default Account;
