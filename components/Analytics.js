import ReactGA from 'react-ga';
import Global from './Constants';

export const initGA = (userAddress, userStatus, winningsDAI, winningsMANA) => {
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

  const existingScript = document.getElementById('google_analytics');

  const callback = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag(args) {
      window.dataLayer.push(...args);
    }
    gtag(['js', new Date()]);
    gtag(['config', 'G-V2YT3FT17V']);
  };

  if (!existingScript) {
    const script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-V2YT3FT17V';
    script.id = 'google_analytics';
    document.body.appendChild(script);
    script.onload = () => {
      callback();
    };
  }
  if (existingScript) {
    callback();
  }
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
