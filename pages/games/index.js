import Offerings from '../../components/home/Offerings/index.js';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Offerings gameState={'games'} />
    </Layout>
  );
};

export default Games;
