import Marketplace from '../../components/home/Marketplace';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Market = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Market'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Marketplace maketState={'newest'} />
    </Layout>
  );
};

export default Market;
