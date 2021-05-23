import { useContext } from 'react';
import { GlobalContext } from '../../store';
import Intelligence from '../../components/home/Intelligence';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Decentraland = () => {
  // get whitelisted value from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Intel | Decentraland'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.whitelistedIntel ? (
        <Intelligence dashboard={'decentraland'} />
      ) : (
        <div className="account-other-inner-p">
          Please check you've connected using a whitelisted address
        </div>
      )}
    </Layout>
  );
};

export default Decentraland;
