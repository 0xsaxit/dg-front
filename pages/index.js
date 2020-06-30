import Home from '../components/home/Dashboard';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Multiplayer Casino Games Playable with Crypto'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      />

      <Home />
    </Layout>
  );
};

export default Index;
