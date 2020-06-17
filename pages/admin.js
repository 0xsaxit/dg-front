import Admin from '../components/admin/admin';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Administration = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Admin'}
        description={Global.DESCRIPTION}
      />

      <Admin />
    </Layout>
  );
};

export default Administration;
