import Exchange from '../components/home/exchange';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Crypto = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Exchange'}
        description={Global.DESCRIPTION}
      />

      <Exchange />
    </Layout>
  );
};

export default Crypto;
