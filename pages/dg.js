import { GlobalContext } from '../store';
import { useContext } from 'react';
import DG from '../components/home/DG';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';


const decentralGamesToken = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | DG'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userInfo[1] === undefined ? (
        <div className="account-other-inner-p">
          Please connect Metask to view this page
        </div>
      ) : ( 
        <DG />
      )}
    </Layout>
  );
};

export default decentralGamesToken;
