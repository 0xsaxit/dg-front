import Home from '../components/home/Dashboard';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Index = () => {
  return (
    <Layout>
      <Header
        title={
          Global.TITLE +
          ' | Slots, Roulette, Blackjack and Backgammon Playable with Crypto'
        }
        description={Global.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Home />
    </Layout>
  );
};

export default Index;
