import Offerings from 'components/home/Offerings';
import Layout from 'components/Layout.js';
import Header from 'components/Header';
import Global from 'components/Constants';
import Images from 'common/Images';

const Leaderboard = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games | Leaderboard'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Offerings gameState={'leaderboard'} />
    </Layout>
  );
};

export default Leaderboard;
