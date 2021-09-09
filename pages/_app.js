import { Provider } from '../store';
import App from 'next/app';
import 'semantic-ui-css/semantic.min.css';
import 'public/static/css/main.css';
import 'public/static/css/agate.css';
import 'public/static/css/blog.css';
import 'public/static/css/spinner.css';
import 'public/static/css/mobile.css';
import '../styles/bootstrap-overrides.scss';
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
import PricesBreakdown from '../store/PricesBreakdown';
import NFTSPOAPS from '../store/NFTSPOAPS';
import EventsData from '../store/EventsData';
import SubgraphQuery from '../store/SubgraphQuery';

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
        <PricesBreakdown />
        <NFTSPOAPS />
        <EventsData />
        <SubgraphQuery />

        <Component {...pageProps} />
      </Provider>
    );
  }
}

export default Application;
