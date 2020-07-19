import Offerings from '../components/home/Offerings';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Games'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <Offerings />
    </Layout>
  );
};

export default Games;
