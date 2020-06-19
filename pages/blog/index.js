import BlogHome from './blogHome';
import Layout from '../../components/layout.js';
import Header from '../../components/Header';
import Global from '../../components/constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
      />

      <BlogHome />
    </Layout>
  );
};

export default Index;
