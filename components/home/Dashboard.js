import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Modal } from 'semantic-ui-react';
import Spinner from '../Spinner';
// import Fade from 'react-reveal/Fade';
import Aux from '../_Aux';
import Global from '../Constants';

const Dashboard = () => {
  // get user's onboard status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  });

  function getContent() {
    return (
      <div>
        <div className="mobile-menu">
          <img className="mobile-menu-image" src={Global.IMAGES.LOGO} />
        </div>
        <div className="mobile-menu-words">
          <a className="mobile-menu-item-1" href="/blog">
            {' '}
            BLOG{' '}
          </a>
          <a
            className="mobile-menu-item-2"
            href="https://docs.decentral.games"
            target="_blank"
          >
            {' '}
            DOCS{' '}
          </a>
          <Modal
            trigger={<a className="mobile-menu-item-2"> DEMO </a>}
            closeIcon
            basic
            size="small"
          >
            <Modal.Content>
              <iframe
                className="mobile-demo-video"
                src="https://www.youtube.com/embed/qklQZBooM-8?&autoplay=1"
                frameborder="0"
                allowfullscreen
              ></iframe>
            </Modal.Content>
          </Modal>
        </div>

        <div className="home-video-container">
          <video
            id="myVideo"
            src="https://res.cloudinary.com/dnzambf4m/video/upload/v1590041720/dg_site_vid_1_ytcfka.mp4"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
            className="home-dashboard-video"
          ></video>
        </div>
        <div className="home-dashboard-content">
          <div>
            <div className="home-dashboard-description">
              {/* <Fade bottom distance="20px" duration={600}> */}
              <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
              <h3
                className="home-dashboard-h3"
                style={{ marginBottom: '-12px' }}
              >
                Tominoya
              </h3>
              <div>
                {state.dashboard ? (
                  <Button
                    color="blue"
                    className="play-button"
                    href="https://play.decentral.games"
                    target="_blank"
                    style={{ marginRight: '30px' }}
                  >
                    PLAY NOW
                  </Button>
                ) : null}
                <Button
                  color="blue"
                  className="play-shimmer"
                  target="_blank"
                  href="https://docs.decentral.games/getting-started"
                >
                  HOW TO PLAY
                </Button>
              </div>
              <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
                Tominoya is a virtual casino built by Decentral Games in
                Decentraland. Enjoy non-custodial slots, roulette, and blackjack
                playable with crypto.
              </p>
              {/* </Fade> */}
            </div>
          </div>
          <p className="mobile-footer">Use a Chrome desktop browser to play.</p>
        </div>
      </div>
    );
  }

  return (
    <Aux>
      {isLoading ? <Spinner background={2} /> : null}
      <div className="home-dashboard">{getContent()}</div>;
    </Aux>
  );
};

export default Dashboard;
