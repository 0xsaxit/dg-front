import ReactGA from 'react-ga';
import Global from './Constants';


export const initGA = (userAddress, userStatus, winningsDAI, winningsMANA) => {
  // console.log('user address (GA): ' + userAddress);
  // console.log('user status (GA): ' + userStatus);
  // console.log('winnings DAI (GA): ' + winningsDAI);
  // console.log('winnings MANA (GA): ' + winningsMANA);

  ReactGA.initialize(Global.KEYS.GOOGLE_ANALYTICS, {
    debug: false,
    titleCase: false,
    gaOptions: {
      dimension1: userAddress,
      dimension2: userStatus,
      dimension3: winningsDAI,
      dimension4: winningsMANA,
    },
  });
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
