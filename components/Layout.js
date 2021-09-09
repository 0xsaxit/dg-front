import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop/index.js';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../public/static/css/theme';
import { GlobalStyles } from '../public/static/css/global';
import { useRouter } from 'next/router';

const Layout = props => {
  // get theme (light or dark mode) from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(state.userAddress, state.userStatus, 0, 0);
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }, []);

  useEffect(() => {
    if (state.userStatus > 3) {
      setIsLoading(false);
    }
  }, [state.userStatus]);

  return (
    <>
      {router.pathname === '/' ? <MenuTop isHomePage={true} /> : <MenuTop />}

      {props.children}
    </>
  );
};

export default Layout;
