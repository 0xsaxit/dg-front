import { GlobalContext } from '../../store';
import { useContext } from 'react';
import AccountData from '../../components/home/AccountData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Items = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account | My Items'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus ? (
        <AccountData dataType={'items'} />
      ) : (
        <div className="account-other-inner-p">
          You must connect your wallet to view this page
        </div>
      )}
    </Layout>
  );
};

export default Items;