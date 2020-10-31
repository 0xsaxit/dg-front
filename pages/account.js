import { GlobalContext } from '../store';
import { useContext } from 'react';
import AccountData from '../components/home/AccountData';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Account = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userInfo[1] === undefined ? (
        <div className="account-other-inner-p">
          Please connect Metask to view this page
        </div>
      ) : (
        <AccountData />
      )}
    </Layout>
  );
};

export default Account;
