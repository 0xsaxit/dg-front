import Coin from '../components/home/coin';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const NFTs = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
      />

      <Coin />
    </Layout>
  );
};

export default NFTs;
