import { GlobalContext } from '@/store';
import { useContext, useState, useEffect } from 'react';
import DAO from '../../components/home/DAO';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';
import Spinner from '../../components/Spinner';

const MiningV1 = () => {
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
        title={Global.CONSTANTS.TITLE + ' | $DG | Mining V1'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {isLoading === true ? (
        <Spinner background={1} />
      ) : isErrorMessage === true ? (
        <div className="account-other-inner-p" style={{ marginTop: '150px' }}>
          You must connect your wallet to view this page
        </div>
      ) : (
        <DAO DGState={'miningv1'} />
      )}
    </Layout>
  );
};

export default MiningV1;
