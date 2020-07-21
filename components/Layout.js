import React, { useEffect } from 'react';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

const Layout = (props) => {
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
