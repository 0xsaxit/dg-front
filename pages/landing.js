import Dashboard from '../components/home/Dashboard';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Index = () => {
  return (
    <Layout>
      <Header
        title={
          Global.CONSTANTS.TITLE +
          ' | Metavarse Casinos Playable with Crypto'
        }
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Dashboard />
    </Layout>
  );
};

export default Index;