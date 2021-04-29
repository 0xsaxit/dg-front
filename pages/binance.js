import BinanceData from '../components/home/BinanceData';
import { GlobalContext } from '../store';
import { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

const Binance = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  return (
    <Layout>
      <Header
        title={Global.CONSTANTS.TITLE + ' | Binance'}
        description={Global.CONSTANTS.DESCRIPTION}
        image={Images.SOCIAL_SHARE}
      />

      <BinanceData />

    </Layout>
  );
};

export default Binance;