import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Button, Divider, Image, Icon } from 'semantic-ui-react';
import { Parallax } from 'react-parallax';
import Mailchimp from '../Mailchimp';
import Aux from '../_Aux';
import Footer from './Footer';
import ModalLogin from 'components/modal/ModalLogin';

const Chateau = () => {
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
        <div className="home-dashboard-content">
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1622387586/pokerPlayer_niowhw.jpg"
            className="home-gif"
          />
          <h1
            className="home-dashboard-main-h1"
            style={{ marginBottom: '-32px' }}
          >
            Play to Earn
          </h1>
          <span className="home-button-span"></span>
          <p className="home-dashboard-p centered">
            Play games in the metaverse and earn rewards of up to 50% of your expected losses back in the $DG token.
          </p>

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
              See Games
            </Button>
          </span>

        </div>
      </Aux>
    );
  }

  function sectionThree() {
    return (
      <Aux>
        <Parallax
          blur={0}
          bgImage="https://res.cloudinary.com/dnzambf4m/image/upload/v1610852861/roulette_zuawjl.jpg"
          strength={100}
          className="test"
        >
          <div className="home-section-2-outter">
            <div className="home-section-2 inner">
              <h1
                className="home-dashboard-h1"
                style={{ marginBottom: '-12px', fontSize: '48px' }}
              >
                Play games, earn $DG
              </h1>
              <span className="home-button-span">
                <Link href="/account">
                  <Button color="blue" className="deposit" href="/account">
                    Deposit
                  </Button>
                </Link>
                <Button
                  color="blue"
                  className="metamask"
                  href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
                  target="_blank"
                >
                  Metamask
                </Button>
              </span>
              <p className="home-dashboard-p" style={{ marginTop: '-8px' }}>
                Play blackjack, roulette, slots, and backgammon with MANA or
                DAI. Enjoy $DG gameplay mining rewards on all bets.
              </p>
            </div>
          </div>
        </Parallax>
      </Aux>
    );
  }

  function sectionFour() {
    return (
      <Aux>
        <div
          className="section-4-outter-header"
          style={{ marginBottom: '-210px', marginTop: '-90px' }}
        >
          <div
            className="home-section-4-header"
            style={{ paddingBottom: '30px' }}
          >
            <span className="learn-more-dg-outter">
              <span className="avatar-image-span">
                <Image
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610653695/download_2_bdhk3t.png"
                  className="home-avatar-1"
                  style={{
                    height: '630px',
                    objectFit: 'scale-down',
                    marginLeft: '-60px',
                  }}
                />
                <Image
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610652923/download_1_l4dnha.png"
                  className="home-avatar-2"
                  style={{
                    height: '810px',
                    objectFit: 'scale-down',
                    marginLeft: '-160px',
                    zIndex: '-1',
                  }}
                />
                <Image
                  className="home-avatar-3"
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610652806/download_lb9h4u.png"
                  style={{
                    height: '540px',
                    objectFit: 'scale-down',
                    marginLeft: '-170px',
                  }}
                />
              </span>

              <span className="learn-more-dg-span">
                <h1
                  className="home-footer-h1 avatars"
                  style={{ marginBottom: '0px', fontSize: '48px' }}
                >
                  Learn more about our ecosystem
                </h1>
                <span className="home-button-span avatars">
                  <Button
                    color="blue"
                    className="partners"
                    href="https://docs.decentral.games/info/partners"
                    target="_blank"
                  >
                    Partners
                  </Button>
                  <Button
                    color="blue"
                    className="roadmap"
                    href="https://docs.decentral.games/info/roadmap"
                    target="_blank"
                  >
                    Roadmap
                  </Button>
                </span>
                <p
                  className="home-footer-p avatars"
                  style={{ marginTop: '27px' }}
                >
                  We’ve strategically partnered with projects that help bolster
                  our offerings and make our user experience as seamless as
                  possible. Check out our partnerships to learn more and our
                  roadmap to see what’s in store for the future of Decentral
                  Games.
                </p>
              </span>
            </span>
          </div>
        </div>
      </Aux>
    );
  }

  function sectionFive() {
    return (
      <Aux>
        <Parallax
          blur={0}
          bgImage="https://res.cloudinary.com/dnzambf4m/image/upload/v1619567714/image_icgve3.png"
          strength={100}
        >
          <div className="home-section-2-outter">
            <div className="home-section-2 inner">
              <h1
                className="home-dashboard-h1"
                style={{
                  marginBottom: '-12px',
                  maxWidth: '600px',
                  fontSize: '48px',
                }}
              >
                The Metaverse is the next frontier
              </h1>
              <span className="home-button-span">
                <Button
                  color="blue"
                  className="hop"
                  href="https://play.decentraland.org/?position=-96%2C110"
                  target="_blank"
                >
                  Hop In
                </Button>
                <Link href="/games/casinos">
                  <Button
                    color="blue"
                    className="casinos"
                    href="/games/casinos"
                  >
                    Casinos
                  </Button>
                </Link>
              </span>
              <p className="home-dashboard-p" style={{ marginTop: '-8px' }}>
                The metaverse is poised to explode in 2021. 3D virtual
                blackjack, roulette, and poker accessible from anywhere in the
                world will change online gaming forever.
              </p>
            </div>
          </div>
        </Parallax>
      </Aux>
    );
  }

  function sectionSix() {
    return (
      <Aux>
        <div className="section-4-header" style={{ marginTop: '15px' }}>
          <div className="home-section-4-header">
            <span className="outter-dashboard-span">
              <h1 className="dg-powered-h1" style={{ fontSize: '48px' }}>
                Get Started
              </h1>
              <a href="https://docs.decentral.games" target="_blank">
                <p className="home-more-nav">Visit Our Docs »</p>
              </a>
            </span>
          </div>
        </div>

        <div className="section-4-outter">
          <div className="home-section-4">
            <span
              className="outter-games-container"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '30px',
              }}
            >
              <div
                href="/dg/mining"
                target="_blank"
                className="dg-video-container one"
              >
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <iframe
                    style={{ borderRadius: '4px' }}
                    width="100%"
                    height="240px"
                    src="https://www.youtube.com/embed/7kyDcfEK_jU"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </span>
                <span style={{ display: 'flex', marginTop: '15px' }}>
                  <p className="tutorial-info">TUTORIAL</p>
                </span>
                <h3 className="tutorials-h3">How to Deposit Crypto</h3>
              </div>

              <div
                href="/dg/mining"
                target="_blank"
                className="dg-video-container three"
              >
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <iframe
                    style={{ borderRadius: '4px' }}
                    width="100%"
                    height="240px"
                    src="https://www.youtube.com/embed/-7U3_YzO-ZU"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </span>
                <span style={{ display: 'flex', marginTop: '15px' }}>
                  <p className="tutorial-info">TUTORIAL</p>
                  <p className="tutorial-info-2">GAMEPLAY</p>
                </span>
                <h3 className="tutorials-h3 two">
                  How to Play Blackjack and Earn $DG
                </h3>
              </div>

              <div
                href="/dg/mining"
                target="_blank"
                className="dg-video-container four"
              >
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <iframe
                    style={{ borderRadius: '4px' }}
                    width="100%"
                    height="240px"
                    src="https://www.youtube.com/embed/zSyx4Zq0VJ0"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </span>
                <span style={{ display: 'flex', marginTop: '15px' }}>
                  <p className="tutorial-info">TUTORIAL</p>
                  <p className="tutorial-info-2">GAMEPLAY</p>
                </span>
                <h3 className="tutorials-h3 two">
                  How to Play Roulette and Earn $DG
                </h3>
              </div>
            </span>
          </div>
        </div>

        <div className="home-section-6">
          <span className="outter-footer-container">
            <span className="inner-footer-container top">
              <h1 className="home-footer-h1" style={{ fontSize: '48px' }}>
                Contact Us
              </h1>
              <p>
                {' '}
                You’ll find us at all hours on Discord. You can also reach us
                through the usual channels.{' '}
              </p>
              <Button
                color="blue"
                className="touch"
                href="https://decentral.games/discord"
                target="_blank"
                style={{ marginTop: '9px' }}
              >
                Contact
              </Button>
            </span>

            <span className="inner-footer-container bottom">
              <h1 className="home-footer-h1" style={{ fontSize: '48px' }}>
                Sign Up
              </h1>
              <p>
                {' '}
                Register here to receive the latest news and updates from
                Decentral Games.{' '}
              </p>
              <Mailchimp />
            </span>
          </span>
        </div>

        <Footer />
      </Aux>
    );
  }

  return (
    <div className="home-dashboard">
      {sectionOne()}
      {sectionTwo()}
      {sectionThree()}
      {sectionFour()}
      {sectionFive()}
      {sectionSix()}
    </div>
  );
};

export default Chateau;

