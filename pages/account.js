import { GlobalContext } from '../store';
import { useContext } from 'react';
import TransactionHistory from '../components/home/TransactionHistory';
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
        <TransactionHistory />
      )}
    </Layout>
  );
};

export default Account;
