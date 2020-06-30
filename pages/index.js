import Home from '../components/home/Dashboard';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Slots, Roulette, Blackjack and Backgammoon Playable with Crypto'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      />

      <Home />
    </Layout>
  );
};

export default Index;
