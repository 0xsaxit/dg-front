import { Provider } from '../store';
import App from 'next/app';
import 'decentraland-ui/lib/styles.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import '../static/css/mobile.css';
import UserStatus from '../components/UserStatus';
import UserBalances from '../components/UserBalances';
import Transactions from '../components/Transactions';
import ParcelData from '../components/ParcelData';
import GameRecords from '../components/GameRecords';
import BalancesOverlay from '../components/BalancesOverlay';
import Location from '../components/Location';
import ActiveStatus from '../components/ActiveStatus';
import UserInfo from '../components/UserInfo';
import AdminBalances from '../components/AdminBalances';
import AdminData from '../components/AdminData';

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <UserStatus />
        <UserBalances />
        <Transactions />
        <ParcelData />
        <GameRecords />
        <BalancesOverlay />
        <Location />
        <ActiveStatus />
        <UserInfo />
        <AdminBalances />
        <AdminData />

        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default Application;
