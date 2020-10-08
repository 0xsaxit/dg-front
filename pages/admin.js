import { GlobalContext } from '../store';
import { useContext } from 'react';
import Admin from '../components/home/Admin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';


const Administration = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);


  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Admin />
    </Layout>
  );
};

export default Administration;
