import Farming from '../../components/home/Farming';
import Layout from '../../components/Layout.js';
import Header from '../../components/Header';
import Global from '../../components/Constants';
import Images from '../../common/Images';

const DG = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | $DG | Treasury'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />
      <Farming DGState={'treasury'} />
    </Layout>
  );
};

export default DG;
