import { GlobalContext } from '../../store';
import { useContext } from 'react';
import DAO from '../../components/home/DAO';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

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

      <DAO DGState={'mining'} />
    </Layout>
  );
};

export default Mining;
