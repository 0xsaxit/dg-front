import { Provider } from '../store';
import App from 'next/app';
import 'semantic-ui-css/semantic.min.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import '../static/css/mobile.css';
import '../static/css/introjs.scss';
import Segment from '../components/Segment';
import UserStatus from '../store/UserStatus';
import UserBalances from '../store/UserBalances';
import Transactions from '../store/Transactions';
import TreasuryNumbers from '../store/TreasuryNumbers';
import GameRecords from '../store/GameRecords';
import ActiveStatus from '../store/ActiveStatus';
import UserInfo from '../store/UserInfo';
import AdminBalances from '../store/AdminBalances';
import UsersList from '../store/UsersList';
import DGBalances from '../store/DGBalances';

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <style jsx global>{`
          body {
            background: black;
          }
        `}</style>
        <Segment />
        <UserStatus />
        <UserBalances />
        <Transactions />
        <TreasuryNumbers />
        <GameRecords />
        <ActiveStatus />
        <UserInfo />
        <AdminBalances />
        <UsersList />
        <DGBalances />

        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default Application;
