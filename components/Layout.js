import React, { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './analytics.js';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

const Layout = (props) => {
  const [state, dispatch] = useContext(GlobalContext);
  console.log('dashboard value: ' + state.dashboard);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  });

  return (
    <Aux>
      <MenuTop dashboard={state.dashboard} />

      {props.children}
    </Aux>
  );
};

export default Layout;
