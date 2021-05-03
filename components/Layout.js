import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from '../static/css/theme';
import { GlobalStyles } from '../static/css/global';
import { useRouter } from 'next/router';

const Layout = (props) => {
  // get user's address and status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);

  // define local variables
  // change second "lightTheme" to "darkTheme" when theme jump is fixed
  // const themeMode = state.theme === 'light' ? lightTheme : lightTheme;

  useEffect(() => {
    if (!window.GA_INITIALIZED) {
      initGA(state.userAddress, state.userStatus, 0, 0);
      window.GA_INITIALIZED = true;
    }

    logPageView();
  }, []);

  // useEffect(() => {
  //   if (state.userStatus > 3) {
  //     setIsLoading(false);
  //   }
  // }, [state.userStatus]);

  return (
    <ThemeProvider theme={lightTheme}>
      <GlobalStyles />

      {router.pathname === '/' ? (
        <MenuTop isHomePage={true} />
      ) : (
        <MenuTop isHomePage={false} />
      )}

      {props.children}
    </ThemeProvider>
  );
};

export default Layout;
