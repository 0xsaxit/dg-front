import Admin from '../components/admin/admin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Administration = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Admin'}
        description={Global.DESCRIPTION}
        image={''}
      />

      <Admin />
    </Layout>
  );
};

export default Administration;
