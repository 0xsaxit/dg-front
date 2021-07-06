import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { Button } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import ModalLoginBinance from 'components/modal/ModalLoginBinance';
import ModalDepositBinance from 'components/modal/ModalDepositBinance';

import styles from './Binance.module.scss';

const BinanceHome = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [utm, setUtm] = useState('');

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
  const homeVideo = () => {
    return (
      <div className={styles.binance_video_container}>
        <video
          id="my-video"
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1619719236/-Full_Screen_BG_nq4suo.mp4"
          type="video/mp4"
          frameBorder="0"
          autoPlay={videoPlay}
          loop
          muted
        ></video>
      </div>
    );
  }

  const sectionOne = () => {
    return (
      <Aux>
        {homeVideo()}

        <div className={styles.home_dashboard_content}>
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1619577485/-Option_1_Play_sparkles_coins_high_res__1_a3qcxc_hswc38.gif"
            className={styles.home_gif}
          />
          <h1 className={styles.home_dashboard_main_h1}>
            Play at the Binance Casino with zero fees
          </h1>
          <span className={styles.home_button_span} />
          <p className={styles.home_dashboard_p_centered}>
            Non-custodial, provably fair slots, roulette, blackjack and poker
            playable with crypto in Decentraland.
          </p>
          <Button
            className={styles.play_now_button_demo}
            color="blue"
            href="https://www.youtube.com/embed/1NxYpUsxhC0"
            target="_blank"
          >
            Demo
          </Button>
          {state.userStatus === 0 ? (
            <span className={styles.mobile_center_span}>
              <Button
                color="blue"
                className={styles.earn_dg_button}
                id="mobile-button-hide"
                href="https://www.youtube.com/embed/1NxYpUsxhC0"
                target="_blank"
              >
                Demo
              </Button>
              <ModalLoginBinance />
            </span>
          ) : (
            <span className={styles.mobile_center_span}>
              <Button
                color="blue"
                className={styles.earn_dg_button}
                href="https://docs.decentral.games/getting-started/play-to-mine"
                target="_blank"
              >
                Learn More
              </Button>
              <ModalDepositBinance />
            </span>
          )}
        </div>
      </Aux>
    );
  }

  return <div>{sectionOne()}</div>;
};

export default BinanceHome;
