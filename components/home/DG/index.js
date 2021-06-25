import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Link from 'next/link';
import { Button, Divider, Image, Icon } from 'semantic-ui-react';
import { Parallax } from 'react-parallax';
import Aux from '../../_Aux';
import Footer from 'components/home/Footer';
import ModalLogin from 'components/modal/ModalLogin';
import styles from './DG.module.scss';


const DGHome = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [utm, setUtm] = useState('');

  const realm = 'fenrir-amber';
  let buttonPlay = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    buttonPlay = document.getElementById('play-now-button-home');
  }, []);

  useEffect(() => {
    if (buttonPlay) {
      analytics.trackLink(buttonPlay, 'Clicked PLAY NOW (home page)');
    }
  }, [buttonPlay]);

  useEffect(() => {
    if (typeof window.orientation !== 'undefined') {
      setVideoPlay(false);
    } else {
      setVideoPlay(true);
    }
  }, []);

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function homeVideo() {
    return (
      <div className="binance-video-container">
        <video
          id="my-video"
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1622134332/Full_Screen_Background_Animation_uo9h6b.webm"
          type="video/mp4"
          frameBorder="0"
          autoPlay={videoPlay}
          loop
          muted
        ></video>
      </div>
    );
  }

  function sectionOne() {
    return (
      <Aux>
        {homeVideo()}

        <div className="home-dashboard-content">
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1622387586/pokerPlayer_niowhw.jpg"
            className="home-gif"
          />
          <h1
            className="home-dashboard-main-h1"
            style={{ marginBottom: '-32px' }}
          >
            Play Games and Be the House
          </h1>
          <span className="home-button-span"></span>
          <p className="home-dashboard-p centered">
            Earn $DG by playing non-custodial slots, roulette, blackjack and poker in the Metaverse. Stake $DG to Be The House.
          </p>
          <Button
            color="blue"
            className="play-now-button-demo"
            href="https://www.youtube.com/embed/1NxYpUsxhC0"
            target="_blank"
          >
            Demo
          </Button>
          {state.userStatus === 0 ? (
            <span className="mobile-center-span">
              <Button
                color="blue"
                className="earn-dg-button"
                id="mobile-button-hide"
                href="https://www.youtube.com/embed/1NxYpUsxhC0"
                target="_blank"
              >
                Demo
              </Button>
              <ModalLogin />
            </span>
          ) : (
            <span className="mobile-center-span">
              <Button
                color="blue"
                className="earn-dg-button"
                href="https://docs.decentral.games/"
                target="_blank"
              >
                Learn More
              </Button>
              <Button
                color="blue"
                className="play-button"
                href="https://play.decentraland.org/?position=-118%2C135"
                target="_blank"
                id="mobile-button-hide"
                style={{ marginLeft: '16px' }}
              >
                Play Now
              </Button>
            </span>
          )}
          <p className="scroll-down-icon">
            <Icon name="chevron down" />
          </p>
        </div>
      </Aux>
    );
  }

  function sectionTwo() {
    return (
      <Aux>
        <div className={styles.section}>
          <span className={styles.image_span}>
            <div>
              <h1 className={styles.section_h1}>
                Play to Earn
              </h1>
              <p className={styles.section_p}>
                Play games in the metaverse and earn rewards of up to 50% of your expected losses back in the $DG token.
              </p>

              <span className="mobile-center-span">
                <Button
                  className={styles.grey_button}
                  href="https://docs.decentral.games/"
                  target="_blank"
                >
                  Learn More
                </Button>
                <Button
                  className={styles.blue_button}
                  href="https://play.decentraland.org/?position=-118%2C135"
                  target="_blank"
                >
                  See Games
                </Button>
              </span>
            </div>

            <img 
              className={styles.image}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651327/Coins_fmq0km.png"
            />
          </span>
        </div>

        <div className={styles.section_right}>
          <span className={styles.image_span}>
            <img 
              className={styles.image}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651335/Wallet_w5odv4.png"
            />
            <div>
              <h1 className={styles.section_h1}>
                Earn APY%
              </h1>
              <p className={styles.section_p}>
                Stake $DG in governance and earn up to 40% in yeild rewards.
              </p>

              <span className="mobile-center-span">
                <Button
                  className={styles.grey_button}
                  href="https://docs.decentral.games/"
                  target="_blank"
                >
                  Learn More
                </Button>
                <Button
                  className={styles.blue_button}
                  href="https://play.decentraland.org/?position=-118%2C135"
                  target="_blank"
                >
                  Earn APY%
                </Button>
              </span>
            </div>
          </span>
        </div>

        <div className={styles.section}>
          <span className={styles.image_span}>
            <div>
              <h1 className={styles.section_h1}>
                Vote in the DAO <br/> (Be The House)
              </h1>
              <p className={styles.section_p}>
                With the $DG DAO, you own the casino, You control the profits. You vote for new games and proposals.
              </p>

              <span className="mobile-center-span">
                <Button
                  className={styles.grey_button}
                  href="https://docs.decentral.games/"
                  target="_blank"
                >
                  Learn More
                </Button>
                <Button
                  className={styles.blue_button}
                  href="/dg/"
                >
                  Explore Treasury
                </Button>
              </span>
            </div>

            <img 
              className={styles.image_coins}
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1624651335/Yes_No_DAO_meuobj.png"
            />
          </span>
        </div>
      </Aux>
    );
  }

  return (
    <div className="home-dashboard">
      {sectionOne()}
      {sectionTwo()}
    </div>
  );
};

export default DGHome;

