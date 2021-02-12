import Games from '../../components/home/Games';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Shop = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games | Shop'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Games gameState={'shop'} />
    </Layout>
  );
};

export default Shop;