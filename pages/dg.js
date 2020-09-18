import Farming from '../components/home/Farming';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const dg = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | DG'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <Farming />
    </Layout>
  );
};

export default dg;