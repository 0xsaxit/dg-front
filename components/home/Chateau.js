import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Aux from '../_Aux';

const Chateau = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [utm, setUtm] = useState('');

  const realm = 'fenrir-amber';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (window) {
      if (window.innerWidth > 499) {
        setVideoPlay(true);
      } else {
        setVideoPlay(false);
      }
    }
  }, [setVideoPlay]);

  useEffect(() => {
    const url = window.location.href;
    if (url.length > 23) {
      sessionStorage.setItem('utm', url.substring(23));
    } else {
      sessionStorage.setItem('utm', '');
    }

    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function homeVideo() {
    return (
      <div className="home-video-container">
        <video
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1603235036/chateau_site_vid_ozjakq.mp4"
          type="video/mp4"
          frameBorder="0"
          autoPlay={videoPlay}
          loop
          muted
        ></video>
      </div>
    );
  }

  function mainContent() {
    return (
      <Aux>
        {homeVideo()}

        {state.userStatus === 3 || isLoading ? (
          null
        ) : (
          <div className="home-dashboard-content">
            <p className="featured-casino-text">BETA v1.0</p>
            <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
              Decentral Games
            </h1>
            <span className="home-button-span">
              {state.userStatus === 0 ? (
                <ModalVideo />
              ) : (
                <Button
                  color="blue"
                  className="play-button"
                  href={`https://play.decentraland.org/?position=-119%2C133&realm=${realm}${utm}`}
                  target="_blank"
                >
                  PLAY NOW
                </Button>
              )}
              <Button
                color="blue"
                className="how-to-button"
                target="_blank"
                href="https://docs.decentral.games/getting-started"
              >
                MINE $DG
              </Button>
            </span>
            <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
              Be the house in the first metaverse casino featuring blackjack, roulette, slots, and backgammon playable with MANA and DAI. Mine $DG through gameplay and liquidity provision. Stake $DG to govern the casino treasury. 
            </p>
          </div>
        )}
      </Aux>
    );
  }

  return <div className="home-dashboard">{mainContent()}</div>;
};

export default Chateau;
