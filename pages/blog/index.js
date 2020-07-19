import BlogHome from './blogHome';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Blog'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <BlogHome />
    </Layout>
  );
};

export default Index;
