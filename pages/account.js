import TransactionHistory from '../components/home/TransactionHistory';
import Layout from '../components/layout.js';
import Header from '../components/Header';
import Global from '../components/constants';

const Account = () => {
  return (
    <Layout>
      <Header
        title={Global.TITLE + ' | Tx History'}
        description={Global.DESCRIPTION}
      />

      <TransactionHistory />
    </Layout>
  );
};

export default Account;
