import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../store/index';
import { useRouter } from 'next/router';
import Content404 from '../components/content/Content404';
import AccountData from '../components/home/AccountData';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Aux from '../components/_Aux';
import Global from '../components/Constants';
import Images from '../common/Images';

const Wildcard = () => {
  // dispatch affiliate referral address to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [affiliateAddress, setAffiliateAddress] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (router.query.param) {
      // test if URL parameter is valid hex string of 6 characters in length
      const parameter = router.query.param[0];
      const re = /[0-9A-Fa-f]{6}/g;

      if (re.test(parameter) && parameter.length === 6) {
        setAffiliateAddress(true);

        console.log('Affiliate address received: ' + parameter);

        dispatch({
          type: 'affiliate_address',
          data: parameter,
        });
      }
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    if (!state.userStatus) {
      setIsErrorMessage(true);
    } else {
      setIsErrorMessage(false);
    }
  }, [state.userStatus]);

  return (
    <Layout>
      {affiliateAddress ? (
        <Aux>
          <Header
            title={Global.CONSTANTS.TITLE + ' | Account | Balances'}
            description={Global.CONSTANTS.DESCRIPTION}
            image={Images.SOCIAL_SHARE}
          />

          {isLoading === true ? (
            <Spinner background={1} />
          ) : isErrorMessage === true ? (
            <div
              className="account-other-inner-p"
              style={{ paddingTop: '20px' }}
            >
              You must connect your wallet to view this page
            </div>
          ) : (
            <AccountData dataType={'balances'} />
          )}
        </Aux>
      ) : (
        <Aux>
          <Header
            title={Global.CONSTANTS.TITLE + ' | Page Not Found'}
            description={Global.CONSTANTS.DESCRIPTION}
            image={Images.SOCIAL_SHARE}
          />

          <Content404 />
        </Aux>
      )}
    </Layout>
  );
};

export default Wildcard;
