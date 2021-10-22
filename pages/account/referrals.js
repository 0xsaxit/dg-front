import { GlobalContext } from '../../store';
import { useContext } from 'react';
import AccountData from '../../components/home/AccountData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import FoxAnimation from '../../components/lottieAnimation/animations/fox'
import Images from '../../common/Images';

const Referrals = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account | Referrals'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus ? (
        <AccountData dataType={'referrals'} />
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
          <FoxAnimation />
        </div>
      )}
    </Layout>
  );
};

export default Referrals;
