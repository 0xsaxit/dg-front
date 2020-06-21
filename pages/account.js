import TransactionHistory from '../components/home/TransactionHistory';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';

const Account = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Account'}
        description={Global.DESCRIPTION}
        image={Global.SOCIAL_SHARE_IMAGE}
      />

      <TransactionHistory />
    </Layout>
  );
};

export default Account;
