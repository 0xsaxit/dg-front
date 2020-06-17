import Home from '../components/home/dashboard';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Home'}
        description={Global.DESCRIPTION}
      />

      <Home />
    </Layout>
  );
};

export default Index;
