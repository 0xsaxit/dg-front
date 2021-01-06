import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Image } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Mailchimp from '../Mailchimp';
import Aux from '../_Aux';
import Footer from './Footer';

const Chateau = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [isLoading, setLoading] = useState(true);

  const realm = 'fenrir-amber';

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  });

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

        {state.userStatus === 3 || isLoading ? (
          null
        ) : (
          <div className="home-dashboard-content">
            <p className="featured-casino-text">DECENTRAL GAMES</p>
            <h1 className="home-dashboard-main-h1" style={{ marginBottom: '-12px' }}>
              The future of casinos is in the Metaverse
            </h1>
            <span className="home-button-span">
              {state.userStatus === 0 ? (
                <ModalVideo />
              ) : (
                <Button
                  color="blue"
                  className="play-button"
                  href={`https://play.decentraland.org/?position=-119%2C133&realm=${realm}`}
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
                EARN $DG
              </Button>
            </span>
            <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
              Stake $DG to be the house in the first metaverse casino. Earn $DG through gameplay, liquidity provision, and governance rewards. 
            </p>
          </div>
        )}

        <div className="section-2-outter" >
          <div className="home-section-2">
            <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
              Play games, earn $DG
            </h1>
            <span className="home-button-span">
              <Button
                color="blue"
                className="play-button"
                href="/account"
                target="_blank"
              >
                DEPOSIT CRYPTO
              </Button>
            </span>
            <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
              Play blackjack, roulette, slots, and backgammon with MANA or DAI in the first 3D metaverse casino. Enjoy $DG gameplay mining rewards distributed immediately based on wager amount. 
            </p>
          </div>
        </div>

        <div className="section-3-outter" >
          <div className="home-section-3">
            <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
              The Metaverse is the next frontier
            </h1>
            <span className="home-button-span">
              <Button
                color="blue"
                className="play-button"
                href={`https://play.decentraland.org/?position=-119%2C133&realm=${realm}`}
                target="_blank"
              >
                HOP IN
              </Button>
              <Button
                color="blue"
                className="how-to-button"
                target="_blank"
                href="/games/casinos"
              >
                OUR CASINOS
              </Button>
            </span>
            <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
              The metaverse is poised to explode in 2021. Blackjack, roulette, and poker in a 3D virtual social environment will change gaming forever.
            </p>
          </div>
        </div>

        <div className="section-4-outter" >
          <div className="home-section-4">
            <h1 className="dg-powered-h1">
              Powered by $DG
            </h1>

              <span className="outter-games-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <a
                  href="/dg/mining"
                  target="_blank"
                  className="dg-powered-container one"
                >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1609555540/1f3b0_2x_pvkxvc.png"
                    className="dg-powered-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">Gameplay</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />

                  <p
                    className="nft-other-p"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '15px',
                      textAlign: 'center',
                    }}
                  >
                    Players mine $DG for playing games with MANA and DAI.
                  </p>
                </div>
              </a>

              <a
                href="/dg/uniswap"
                target="_blank"
                className="dg-powered-container two"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1609555644/1f4b0_2x_s22ysr.png"
                    className="dg-powered-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">Liquidity</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />

                  <p
                    className="nft-other-p"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '15px',
                      textAlign: 'center',
                    }}
                  >
                    Earn $DG liquidity incentives by providing liquidity in AMM pools.
                  </p>
                </div>
              </a>

              <a
                href="/dg"
                target="_blank"
                className="dg-powered-container three"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1609555644/1f3db-fe0f_2x_muszls.png"
                    className="dg-powered-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">Governance</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />

                  <p
                    className="nft-other-p"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '15px',
                      textAlign: 'center',
                    }}
                  >
                    Stake $DG to govern the casino bankroll.
                  </p>
                </div>
              </a>

              <a
                href="/dg"
                target="_blank"
                className="dg-powered-container"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1609555644/1f465_2x_wn7k1w.png"
                    className="dg-powered-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">Affiliates</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />

                  <p
                    className="nft-other-p"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '15px',
                      textAlign: 'center',
                    }}
                  >
                    Refer friends and enjoy 10% of the $DG they mine.
                  </p>
                </div>
              </a>

            </span>
          </div>
        </div>    

        <div className="home-section-6">
          <span className="outter-footer-container">
            <span className="inner-footer-container top">
              <h1 className="home-footer-h1">
                Contact Us
              </h1>
              <p> You’ll find us at all hours on Discord. You can also reach us through the usual channels. </p>
              <Button
                color="blue"
                className="play-button"
                href="https://decentral.games/discord"
                target="_blank"
                style={{ marginTop: '9px' }}
              >
                GET IN TOUCH
              </Button>
            </span>

            <span className="inner-footer-container bottom">
              <h1 className="home-footer-h1">
                Sign Up
              </h1>
              <p> Register here to recieve the latest news and updates from Decentral Games. </p>
              <Mailchimp />
            </span>
          </span>
        </div>

        <Footer />

      </Aux>
    );
  }

  return <div className="home-dashboard">{mainContent()}</div>;
};

export default Chateau;
