import { GlobalContext } from '../store';
import { useContext, useState } from 'react';
import Admin from '../components/home/Admin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';


const Administration = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [addressExists, setAddressExists] = useState(false);

  var checkExist = setInterval(function() {
     if (state.userInfo[1] != undefined) {
      clearInterval(checkExist);
      setAddressExists(true);
     }
  }, 100); // check every 100ms

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {addressExists && Global.ADMIN_ADDRESSES.includes(state.userInfo[1].toUpperCase()) ? (
        <Admin />
      ) : (
        <div className="account-other-inner-p">
          Please check you've connected using a whitelisted address 
        </div>
      )}
    </Layout>
  );
};

export default Administration;
