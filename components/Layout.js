import React, { useEffect, useState } from 'react';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../static/css/theme';
import { GlobalStyles } from '../static/css/global';
import { useDarkMode } from './useDarkMode';


const Layout = (props) => {
  const [theme, toggleTheme] = useDarkMode();
  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }, []);

  return (
    <ThemeProvider theme={themeMode}>
    <GlobalStyles />

      <Aux>
        <MenuTop toggleTheme={toggleTheme} />
        
        {props.children}
      </Aux>
    </ThemeProvider>
  );
};

export default Layout;
