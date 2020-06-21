import Coin from '../components/home/coin';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const NFTs = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      />

      <Coin />
    </Layout>
  );
};

export default NFTs;
