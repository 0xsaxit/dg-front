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
  
  // define local variables
  // change second "lightTheme" to "darkTheme" when theme jump is fixed
  const themeMode = state.theme === 'light' ? lightTheme : lightTheme;

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
    <ThemeProvider theme={themeMode}>
      <>
      {state.userVerified ? (
        <>
        <GlobalStyles />

        {typeof window === 'undefined' ||
        typeof window.matchMedia === 'undefined' ? (
          <></>
        ) : (
          <MenuTop />
        )}
  
        {props.children}
        </>
      ) : (
        <div
          style={{
            background: 'gray',
            textAlign: 'center',
            fontSize: '18px',
            height: '35px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          You don’t have permission to view this page!
        </div>
      )}
      </>
    </ThemeProvider>
  );
};

export default Layout;
