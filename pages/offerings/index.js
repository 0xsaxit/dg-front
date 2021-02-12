import Games from '../../components/home/Games';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Offerings = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Offerings | Games'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Games gameState={'games'} />
    </Layout>
  );
};

export default Offerings;
