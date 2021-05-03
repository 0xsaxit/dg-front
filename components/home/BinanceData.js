import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Button, Divider, Image, Icon } from 'semantic-ui-react';
import Aux from '../_Aux';
import ButtonPlayNowBinance from '../button/ButtonPlayNow';

const BinanceData = () => {
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

  function sectionOne() {
    return (
      <Aux>
        {homeVideo()}

        <div className="home-dashboard-content" style={{ marginTop: '-63px' }}>
          <img 
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1619577485/-Option_1_Play_sparkles_coins_high_res__1_a3qcxc_hswc38.gif"
            className="home-gif"
          />
          <h1
            className="home-dashboard-main-h1"
            style={{ marginBottom: '-32px' }}
          >
            Play at the Binance Casino with zero fees
          </h1>
          <span className="home-button-span">
          </span>
          <p className="home-dashboard-p centered">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis cursus placerat augue hendrerit nunc. Turpis et lorem aliquet amet senectus. 
          </p>
            <Button
              color="blue"
              className="demo-button-binance"
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
                  style={{ marginRight: '16px' }}
                >
                  Demo
                </Button>
                <ButtonPlayNowBinance />
              </span>
            ) : (
              <span className="mobile-center-span">
                <Button
                  color="blue"
                  className="earn-dg-button"
                  href="https://docs.decentral.games/getting-started/play-to-mine"
                  target="_blank"
                >
                  Learn More
                </Button>
                <Button
                  color="blue"
                  className="play-button-binance"
                  href="https://play.decentraland.org/?position=-96%2C110"
                  target="_blank"
                  id="mobile-button-hide"
                  style={{ marginLeft: '16px' }}
                >
                  Play Now
                </Button>
              </span>
            )}
        </div>
      </Aux>
    );
  }

  return (
    <div className="home-dashboard">
      {sectionOne()}
    </div>
  );
};

export default BinanceData;