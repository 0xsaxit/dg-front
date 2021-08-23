import { GlobalContext } from 'store';
import { useContext } from 'react';
import DAO from 'components/home/DAO';
import Farming from 'components/home/Farming';
import Layout from 'components/Layout.js';
import Header from 'components/Header';
import Global from 'components/Constants';
import Images from 'common/Images';

import styles from './dg.module.scss';

const Mining = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG | Mining'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {state.userStatus ? (
        <DAO DGState={'mining'} />
      ) : (
        <div className={styles.account_other_inner_p}>
          You must connect your wallet to view this page
        </div>
      )}
    </Layout>
  );
};

export default Mining;
