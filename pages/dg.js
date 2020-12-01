import { GlobalContext } from '../store';
import { useContext, useState, useEffect } from 'react';
import Farming from '../components/home/Farming';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import Spinner from '../components/Spinner';
import Fetch from '../common/Fetch';


const dg = (props) => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables 
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localStatus, setLocalStatus] = useState(5);
  let userAddress = '';

  useEffect(() => {
    (async function () {
      if (window.ethereum) {
        userAddress = window.web3.currentProvider.selectedAddress;
      } else {
        userAddress = '';
      }

      const response = await Fetch.USER_STATUS(userAddress);
      const json = await response.json();
      setLocalStatus(json.result);

      if (localStatus === 'false') {
        setIsErrorMessage(true);
        setIsLoading(false);
      } else {
        setIsErrorMessage(false);
        setIsLoading(false);
      }
    })();
  }, [localStatus, isLoading, isErrorMessage]);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {isLoading ? (
        <Spinner background={1} />
      ) : isErrorMessage === true ?  (
        <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
          You must log in with Metamask to view this page
        </div>
      ) : (
        <Farming />
      )}

    </Layout>
  );
};

export default dg;
