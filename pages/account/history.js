import { useContext } from 'react';
import AccountData from 'components/home/AccountData';
import { GlobalContext } from 'store';
import Layout from 'components/Layout.js';
import Header from 'components/Header';
import Global from 'components/Constants';
import Images from 'common/Images';

import styles from './account.module.scss';

const History = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account | History'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus ? (
        <AccountData dataType={'history'} />
      ) : (
        <div className={styles.account_other_inner_p}>
          You must connect your wallet to view this page
        </div>
      )}
    </Layout>
  );
};

export default History;
