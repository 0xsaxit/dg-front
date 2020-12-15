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

  const realm = 'fenrir-amber';

  useEffect(() => {
    if (window) {
      if (window.innerWidth < 500) {
        setVideoPlay(false);
      } else {
        setVideoPlay(true);
      }
    }
  }, []);

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

        {state.userStatus === 3 ? (
          null
        ) : state.userStatus === 0 ? (
          <div className="home-mission-content">
            <div className="home-dashboard-description">
              <h1
                className="home-dashboard-mission"
                style={{ marginBottom: '-15px' }}
              >
                Be the house in the first metaverse casino
              </h1>
              <h2
                className="home-dashboard-h2"
                style={{ marginBottom: '12px' }}
              >
                $DG is rewarded for gameplay, liquidity provision, and
                governance.
              </h2>
              <span className="logged-out-button-span">
                <ModalVideo />

                <Button
                  color="blue"
                  className="how-to-button"
                  target="_blank"
                  href="https://docs.decentral.games/getting-started"
                >
                  EARN $DG
                </Button>
              </span>
            </div>
          </div>
        ) : (
          <div className="home-dashboard-content">
            <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
            <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
              Chateau Satoshi
            </h1>
            <Button
              color="blue"
              className="play-button"
              href={`https://play.decentraland.org/?position=-75%2C77&realm=${realm}`}
              target="_blank"
              style={{ marginRight: '30px' }}
            >
              PLAY NOW
            </Button>
            <Button
              color="blue"
              className="how-to-button"
              target="_blank"
              href="https://docs.decentral.games/getting-started"
            >
              EARN $DG
            </Button>
            <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
              Chateau Satoshi is an art deco themed metaverse casino built by
              Decentral Games in Decentraland. Enjoy non-custodial slots,
              roulette, and blackjack playable with crypto.
            </p>
          </div>
        )}
      </Aux>
    );
  }

  return <div className="home-dashboard">{mainContent()}</div>;
};

export default Chateau;
