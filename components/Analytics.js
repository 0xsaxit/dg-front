import ReactGA from 'react-ga';
import Global from './Constants';

export const initGA = (userAddress, userStatus, winningsDAI, winningsMANA) => {
  console.log('user address (GA): ' + userAddress);
  console.log('user status (GA): ' + userStatus);
  console.log('winnings DAI: ' + winningsDAI);
  console.log('winnings MANA: ' + winningsMANA);

  ReactGA.initialize(Global.KEYS.GOOGLE_ANALYTICS, {
    debug: true,
    titleCase: false,
    gaOptions: {
      userAddress: userAddress,
      userStatus: userStatus,
      winningsDAI,
      winningsMANA,
    },
  });
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
