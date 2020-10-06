import TransactionHistory from '../components/home/TransactionHistory';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Account = () => {
  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Account'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <TransactionHistory />
    </Layout>
  );
};

export default Account;
