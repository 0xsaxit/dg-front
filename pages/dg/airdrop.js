import { GlobalContext } from '../../store';
import { useContext } from 'react';
import Farming from '../../components/home/Farming';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Airdrop = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG | Airdrop'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus >= 20 ? (
        <Farming DGState={'airdrop'} />
      ) : (
        <div className="account-other-inner-p">
          Please ensure you've connected using a team member wallet address
        </div>
      )}
    </Layout>
  );
};

export default Airdrop;
