import Offerings from '../components/home/Offerings';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import { hydrate } from '@emotion/css';

if (typeof window !== 'undefined') {
  hydrate(window.__NEXT_DATA__.ids);
}

const Games = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Games'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <Offerings />
    </Layout>
  );
};

export default Games;
