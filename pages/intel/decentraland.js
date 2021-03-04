import Intelligence from '../../components/home/Intelligence';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Decentraland = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Intel | Decentraland'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Intelligence dashboard={'decentraland'} />
    </Layout>
  );
};

export default Decentraland;
