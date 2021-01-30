import { Provider } from '../store';
import App from 'next/app';
import 'semantic-ui-css/semantic.min.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import '../static/css/mobile.css';
import Segment from '../components/Segment';
import UserStatus from '../store/UserStatus';
import UserBalances from '../store/UserBalances';
// import BalancesEvents from '../store/BalancesEvents';
import Transactions from '../store/Transactions';
import ParcelData from '../store/ParcelData';
import GameRecords from '../store/GameRecords';
import BalancesOverlay from '../store/BalancesOverlay';
// import Location from '../store/Location';
import ActiveStatus from '../store/ActiveStatus';
import UserInfo from '../store/UserInfo';
import AdminBalances from '../store/AdminBalances';
// import AdminData from '../store/AdminData';
import DGBalances from '../store/DGBalances';
import Whitelist from '../store/Whitelist';

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Provider store={store}>
        <Segment />
        <UserStatus />
        <UserBalances />
        <Transactions />
        <ParcelData />
        <GameRecords />
        <BalancesOverlay />
        <ActiveStatus />
        <UserInfo />
        <AdminBalances />
        <DGBalances />
        <Whitelist />

        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default Application;
