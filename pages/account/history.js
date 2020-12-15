import { GlobalContext } from '../../store';
import { useContext, useState, useEffect } from 'react';
import AccountData from '../../components/home/AccountData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';
import Spinner from '../../components/Spinner';

const History = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | History'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus === 3 ? (
        <Spinner background={3} />
      ) : state.userStatus === 0 ? (
        <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
          You must log in with Metamask to view this page
        </div>
      ) : (
        <AccountData dataType={'history'} />
      )}
    </Layout>
  );
};

export default History;
