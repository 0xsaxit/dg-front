import Offerings from '../components/home/Offerings';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Games'}
        description={Global.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Offerings />
    </Layout>
  );
};

export default Games;
