import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import { useRouter } from 'next/router';

function Affiliate() {
  // dispatch users transaction history data to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let affiliateAddress = '';
  const router = useRouter();

  useEffect(() => {
    if (state.userStatus) {
      if (router.pathname === '/[...param]') {
        console.log('Affiliate address received: ' + router.query.param[0]);

        affiliateAddress = router.query.param[0];
      }

      dispatch({
        type: 'affiliate_address',
        data: affiliateAddress,
      });
    }
  }, [state.userStatus]);

  return null;
}

export default Affiliate;
