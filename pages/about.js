import About from '../components/home/about';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Company = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Company'}
        description={Global.DESCRIPTION}
      />

      <About />
    </Layout>
  );
};

export default Company;
