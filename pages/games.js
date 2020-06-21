import ContentGames from '../components/home/ContentGames';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Games'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      />

      <ContentGames />
    </Layout>
  );
};

export default Games;
