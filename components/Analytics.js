import ReactGA from 'react-ga';
import Global from './Constants';

export const initGA = () => {
  ReactGA.initialize(Global.KEYS.GOOGLE_ANALYTICS);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
