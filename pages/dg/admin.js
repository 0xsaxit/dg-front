import { GlobalContext } from '../../store';
import { useContext } from 'react';
import Farming from '../../components/home/Farming';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Admin = () => {
  // get whitelisted value from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.whitelistedAdmin ? (
        <Farming DGState={'admin'} />
      ) : (
        <div className="account-other-inner-p">
          Please check you've connected using a whitelisted address
        </div>
      )}
    </Layout>
  );
};

export default Admin;
