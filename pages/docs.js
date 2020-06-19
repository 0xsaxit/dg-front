import ContentDocs from '../components/home/ContentDocs';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Docs = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | NFTs'}
        description={Global.DESCRIPTION}
      />

      <ContentDocs />
    </Layout>
  );
};

export default Docs;
