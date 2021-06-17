import Chateau from '../components/home/Chateau';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Be The House'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Chateau />
    </Layout>
  );
};

export default Index;
