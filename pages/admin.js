import Admin from '../components/home/Admin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Administration = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Admin'}
        description={Global.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Admin />
    </Layout>
  );
};

export default Administration;
