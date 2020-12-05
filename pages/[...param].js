import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../store/index';
import { useRouter } from 'next/router';
import Content404 from '../components/content/Content404';
import Chateau from '../components/home/Chateau';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Aux from '../components/_Aux';
import Global from '../components/Constants';
import Images from '../common/Images';

const Wildcard = () => {
  // dispatch affiliate referral address to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [affiliateAddress, setAffiliateAddress] = useState(0);

  const router = useRouter();
  let parameter = '';

  useEffect(() => {
    if (router.query.param) {
      parameter = router.query.param[0];

      if (parameter.slice(0, 2) === '0x') {
        setAffiliateAddress(1);

        console.log('Affiliate address received: ' + parameter);

        dispatch({
          type: 'affiliate_address',
          data: parameter,
        });
      } else {
        setAffiliateAddress(2);
      }
    }
  }, [router]);

  return (
    <Layout>
      {affiliateAddress === 1 ? (
        <Aux>
          <Header
            title={
              Global.CONSTANTS.TITLE +
              ' | Metavarse Casinos Playable with Crypto'
            }
            description={Global.CONSTANTS.DESCRIPTION}
            image={Images.SOCIAL_SHARE}
          />

          <Chateau />
        </Aux>
      ) : affiliateAddress === 2 ? (
        <Aux>
          <Header
            title={Global.CONSTANTS.TITLE + ' | Page Not Found'}
            description={Global.CONSTANTS.DESCRIPTION}
            image={Images.SOCIAL_SHARE}
          />

          <Content404 />
        </Aux>
      ) : null}
    </Layout>
  );
};

export default Wildcard;
