import { useContext } from 'react';
import { GlobalContext } from '../../store';
import Intelligence from '../../components/home/Intelligence';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Website = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Intel | Website'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus === 12 || state.userStatus === 16 ? (
        <Intelligence dashboard={'website'} />
      ) : (
        <div className="account-other-inner-p">
          Please ensure you've connected using a whitelisted address
        </div>
      )}
    </Layout>
  );
};

export default Website;
