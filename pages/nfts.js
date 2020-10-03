import Tokens from '../components/home/Tokens';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const NFTs = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Tokens />
    </Layout>
  );
};

export default NFTs;
