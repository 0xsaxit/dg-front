import Content404 from '../components/home/Content404';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const notFound = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Page Not Found'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <Content404/>
    </Layout>
  );
};

export default notFound;