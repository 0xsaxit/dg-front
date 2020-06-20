import Home from '../components/home/dashboard';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Index = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Home'}
        description={Global.DESCRIPTION}
        image={''}
      />

      <Home />
    </Layout>
  );
};

export default Index;
