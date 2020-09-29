import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../store/index';
import { useRouter } from 'next/router';
import Content404 from '../components/home/Content404';
import TransactionHistory from '../components/home/TransactionHistory';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Aux from '../components/_Aux';
import Global from '../components/Constants';

const Wildcard = () => {
  // dispatch affiliate referral address to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const router = useRouter();
  const [affiliateAddress, setAffiliateAddress] = useState(false);

  useEffect(() => {
    if (router.query.param) {
      if (router.query.param[0].slice(0, 2) === '0x') {
        setAffiliateAddress(true);

        console.log('Affiliate address received: ' + router.query.param[0]);

        dispatch({
          type: 'affiliate_address',
          data: router.query.param[0],
        });
      }
    }
  }, [router]);

  return (
    <Layout>
      {affiliateAddress ? (
        <Aux>
          <Header
            title={Global.TITLE + ' | Account'}
            description={Global.DESCRIPTION}
            image={Global.IMAGES.SOCIAL_SHARE}
          />

          <TransactionHistory />
        </Aux>
      ) : (
        <Aux>
          <Header
            title={Global.TITLE + ' | Page Not Found'}
            description={Global.DESCRIPTION}
            image={Global.IMAGES.SOCIAL_SHARE}
          />

          <Content404 />
        </Aux>
      )}
    </Layout>
  );
};

export default Wildcard;
