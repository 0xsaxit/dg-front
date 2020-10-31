import Administration from '../components/home/Administration';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';
import Whitelist from '../components/Whitelist';

const Admin = () => {
  // define local variables
  const whitelisted = Whitelist();

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Admin'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      {whitelisted ? (
        <Administration />
      ) : (
        <div className="account-other-inner-p">
          Please check you've connected using a whitelisted address
        </div>
      )}
    </Layout>
  );
};

export default Admin;
