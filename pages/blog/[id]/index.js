import BlogPages from './blogPages';
import Layout from '../../../components/layout.js';
import Header from '../../../components/Header';
import Global from '../../../components/constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
      />

      <BlogPages />
    </Layout>
  );
};

export default Index;
