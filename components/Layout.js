import React, { useEffect } from 'react';
// import { GlobalContext } from '../store';
import { initGA, logPageView } from './analytics.js';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

const Layout = (props) => {
  // const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  });

  return (
    <Aux>
      <MenuTop />

      {props.children}
    </Aux>
  );
};

export default Layout;
