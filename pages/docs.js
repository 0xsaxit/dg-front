import ContentDocs from '../components/home/ContentDocs';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Docs = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Docs'}
        description={Global.DESCRIPTION}
        image={Global.IMAGES.SOCIAL_SHARE}
      />

      <ContentDocs />
    </Layout>
  );
};

export default Docs;
