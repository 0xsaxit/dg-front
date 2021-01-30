import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../static/css/theme';
import { GlobalStyles } from '../static/css/global';
import { useRouter } from 'next/router';
import Footer from './home/Footer';

const Layout = (props) => {
  // get theme (light or dark mode) from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();

  // define local variables
  // change second "lightTheme" to "darkTheme" when re implementing dark mode
  const themeMode = state.theme === 'light' ? lightTheme : lightTheme;

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(state.userAddress, state.userStatus, 0, 0);
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }, []);

  return (
    <ThemeProvider theme={themeMode}>
      <GlobalStyles />

      {router.pathname === '/' ? (
        <MenuTop isHomePage={true} />
      ) : (
        <MenuTop isHomePage={false} />
      )}

      {props.children}

      {router.pathname === '/' ? (
        null
      ) : (
        <Footer />
      )}
      
    </ThemeProvider>
  );
};

export default Layout;
