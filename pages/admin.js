import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Admin from '../components/home/Admin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import Fetch from '../common/Fetch';

const Administration = () => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [adminAddresses, setAdminAddresses] = useState([]);
  const [userAddress, setUserAddress] = useState('');

  useEffect(() => {
    async function fetchData() {
      console.log('Fetching admin addresses...');

      const response = await Fetch.GET_ADDRESSES();
      let json = await response.json();
      const arrayUpperCase = json.ADMIN_ADDRESSES.map((a) => a.toUpperCase());

      setAdminAddresses(arrayUpperCase);
    }

    // check every 1000ms
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (state.userStatus) {
      setUserAddress(window.web3.currentProvider.selectedAddress.toUpperCase());
    }
  }, [state.userStatus]);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {adminAddresses.includes(userAddress) ? (
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
