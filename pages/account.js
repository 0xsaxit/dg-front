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

  // define local variables 
  // const [isErrorMessage, setIsErrorMessage] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const loading = localStorage.getItem('loading');
  //   console.log(loading);
  //   if (loading === 'true') {
  //     setIsLoading(true);
  //   } else if (state.userStatus === 0) {
  //     setIsErrorMessage(true);
  //     setIsLoading(false);
  //   } else {
  //     setIsErrorMessage(false);
  //     setIsLoading(false);
  //   }
  // }, [state.userStatus]);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <AccountData />

    </Layout>
  );
};

export default Account;
