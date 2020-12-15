import { GlobalContext } from '../../store';
import { useContext, useState, useEffect } from 'react';
import Farming from '../../components/home/Farming';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';
import Spinner from '../../components/Spinner';

const DG = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG'}
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
        <Farming DGState={'governance'} />
      )}
    </Layout>
  );
};

export default DG;
