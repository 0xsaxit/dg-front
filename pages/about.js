import About from '../components/home/about';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Company = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Company'}
        description={Global.DESCRIPTION}
        image={''}
      />

      <About />
    </Layout>
  );
};

export default Company;
