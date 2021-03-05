import Intelligence from '../../components/home/Intelligence';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Website = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Intel | Website'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Intelligence dashboard={'website'} />
    </Layout>
  );
};

export default Website;
