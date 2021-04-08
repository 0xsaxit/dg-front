import { GlobalContext } from '../../store';
import { useContext, useState, useEffect } from 'react';
import AccountData from '../../components/home/AccountData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';
import Spinner from '../../components/Spinner';

const Referrals = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.userStatus) {
      setIsErrorMessage(false);
      setIsLoading(false);
    } else {
      setIsErrorMessage(true);
      setIsLoading(false);
    }
  }, [state.userStatus]);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account | Referrals'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {isLoading === true ? (
        <Spinner background={1} />
      ) : isErrorMessage === true ? (
        <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
          You must connect your wallet to view this page
        </div>
      ) : (
        <AccountData dataType={'referrals'} />
      )}
    </Layout>
  );
};

export default Referrals;