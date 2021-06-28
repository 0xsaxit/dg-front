import SubgraphData from '../../components/home/SubgraphData';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const Subgraphs = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Subgraphs'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <SubgraphData dataType={'treasury'} />
    </Layout>
  );
};

export default Subgraphs;
