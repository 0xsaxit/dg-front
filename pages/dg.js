import Farming from '../components/home/Farming';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const dg = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | DG'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Farming />
    </Layout>
  );
};

export default dg;
