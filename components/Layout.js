import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './Analytics';
import MenuTop from './home/MenuTop';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from '../static/css/theme';
import { GlobalStyles } from '../static/css/global';
// import { useDarkMode } from './useDarkMode';
import MailChimp from './Mailchimp';

const Layout = (props) => {
  // get theme (light or dark mode) from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [theme, toggleTheme] = useDarkMode();
  const themeMode = state.theme === 'light' ? lightTheme : darkTheme;

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

      <MenuTop />
      <MailChimp />

      {props.children}
    </ThemeProvider>
  );
};

export default Layout;
