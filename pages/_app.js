import { Provider } from '../store';
// import App from 'next/app';
// import './i18n';

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
import ICEAttributes from '../store/ICEAttributes';
// import AppConfig from '../store/AppConfig';

// import Spinner from 'components/Spinner';
// import { useRouter } from 'next/router';
// import { useEffect, useContext, useState } from 'react';
// import { GlobalContext } from '../store';

function Application({ Component, pageProps, store }) {
  // const router = useRouter();
  // const [pageLoading, setPageLoading] = useState(true);

  // useEffect(() => {
  //   setPageLoading(true);
  //   const timer = setTimeout(() => {
  //     console.log('This will run after 3 second on first load!');
  //     setPageLoading(false);
  //   }, 3000);
  //   return () => clearTimeout(timer);
  // }, []);

  // useEffect(() => {
  //   const handleStart = () => {
  //     console.log('1. Page Loading is started.');
  //     setPageLoading(true);
  //   };
  //   const handleComplete = () => {
  //     console.log('2. Page Loading is completed.');
  //     setPageLoading(false);
  //   };

  //   router.events.on('routeChangeStart', handleStart);
  //   router.events.on('routeChangeComplete', handleComplete);
  //   router.events.on('routeChangeError', handleComplete);
  // }, [router]);

  return (
    <Provider store={store}>
      <style jsx global>{`
        body {
          background: black;
        }
      `}</style>

      {/* {pageLoading ? (
        <Spinner background={1} />
      ) : (
        <> */}
      <Segment />
      <Component {...pageProps} />
      {/* </>
      )} */}

      {/* <AppConfig /> */}
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
      <ICEAttributes />
    </Provider>
  );
  // }
}

export default Application;
