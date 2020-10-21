import Games from '../components/home/Games';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const ourGames = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Games />
    </Layout>
  );
};

export default ourGames;
