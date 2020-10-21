import NFTs from '../components/home/NFTs';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const nonFungibleTokens = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | NFTs'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <NFTs />
    </Layout>
  );
};

export default nonFungibleTokens;
