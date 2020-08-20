import { Provider } from '../store';
import App from 'next/app';
import 'decentraland-ui/lib/styles.css';
import '../static/css/main.css';
import '../static/css/agate.css';
import '../static/css/blog.css';
import '../static/css/spinner.css';
import Aux from '../components/_Aux';
import UserStatus from '../components/UserStatus';
import Balances from '../components/Balances';
import Transactions from '../components/Transactions';
import ParcelData from '../components/ParcelData';
import GameRecords from '../components/GameRecords';
import BalancesOverlay from '../components/BalancesOverlay';
import Location from '../components/Location';
import ActiveStatus from '../components/ActiveStatus';

class Application extends App {
  render() {
    const { Component, pageProps, store } = this.props;

    return (
      <Aux>
        <Provider store={store}>
          <UserStatus />
          <Balances />
          <Transactions />
          <ParcelData />
          <GameRecords />
          <BalancesOverlay />
          <Location />
          <ActiveStatus />

          <Component {...pageProps} />
        </Provider>
      </Aux>
    );
  }
}

export default Application;
