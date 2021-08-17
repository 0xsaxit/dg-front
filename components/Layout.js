import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop/index.js';
import { lightTheme} from '../static/css/theme';
import { useRouter } from 'next/router';
import Footer from './home/Footer';

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
      <>
      {router.pathname === '/' ? (
        <MenuTop isHomePage={true} />
      ) : (
        <MenuTop isHomePage={false} />
      )}

      {props.children}

      <Footer />
      </>
  );
};

export default Layout;
