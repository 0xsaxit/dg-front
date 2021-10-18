import DGHome from '../components/home/DG/index.js';
import Layout from '../components/Layout.js';
import Header from '../components/Header';
import Global from '../components/Constants';
import Images from '../common/Images';

import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';

const Index = () => {
  const [state, dispatch] = useContext(GlobalContext);  
  return (
    <>
      <Layout>
        <Header
          title={Global.CONSTANTS.TITLE + ' | Be The House'}
          description={Global.CONSTANTS.DESCRIPTION}
          image={Images.SOCIAL_SHARE}
        />
        <DGHome />
      </Layout>
    </>
  );
};

export default Index;
