import ContentGames from '../components/home/ContentGames';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
      />

      <ContentGames />
    </Layout>
  );
};

export default Games;
