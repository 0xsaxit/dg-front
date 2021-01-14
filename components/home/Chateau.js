import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Image } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Mailchimp from '../Mailchimp';
import Aux from '../_Aux';
import Footer from './Footer';
import Fetch from '../../common/Fetch';
import { Chart } from "react-charts";
import Images from '../../common/Images';
import { Parallax } from 'react-parallax';


const Chateau = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [videoPlay, setVideoPlay] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(true);
  const [manaPrice, setManaPrice] = useState('');

  // fetch total bet from API
  useEffect(
    () => {
      (async function () {
        // calculate price of mana
        let response_2 = await Fetch.MANA_PRICE();
        let json_2 = await response_2.json();
        setManaPrice(json_2.market_data.current_price.usd);

      })();
    },
    [manaPrice]
  );

  // treasury stuff
  const treasury_dai = Number(state.DGBalances.balance_maticDai);
  const treasury_mana_tokens = Number(state.DGBalances.balance_maticMana);
  const treasury_mana = Number(state.DGBalances.balance_maticMana * manaPrice);
  const treasury = Number(treasury_dai) + Number(treasury_mana);

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
          id="my-video"
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

  function sectionOne() {
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
              Be the house in the first metaverse casino. Earn $DG through gameplay, liquidity provision, and governance rewards. 
            </p>
          </div>
        )}
      </Aux>
    );
  }

  function sectionTwo() {
    return (
      <Aux>
        {state.userStatus === 3 || isLoading ? (

        <div>
          <div className="section-4-header-loading">
            <div className="home-section-4-header">
              <h1 className="dg-powered-h1">
                Powered by $DG
              </h1>
              <span className="outter-dashboard-span">
                <span className="home-button-span">
                  <Button
                    color="blue"
                    className="our-blog-button"
                    href="/blog/presenting-dg-be-the-house-in-the-first-metaverse-casino"
                  >
                    READ ANNOUNCEMENT
                  </Button>
                  <Button
                    color="blue"
                    className="learn-more-button"
                    target="_blank"
                    href="https://docs.decentral.games/ecosystem"
                  >
                    LEARN MORE
                  </Button>
                </span>
                <a href="/dg">
                  <p className="home-more-nav-top">$DG Dashboard»</p>
                </a>
              </span>
            </div>
          </div>

          <div className="section-4-outter">
            <div className="home-section-4">

                <span className="outter-dg-powered-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
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
                      Mine $DG by playing games with MANA and DAI. Refer friends and enjoy up to 10% of the $DG they mine.
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
                      Earn $DG liquidity incentives by providing liquidity in Balancer or Uniswap AMM pools.
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
                      Stake $DG to govern the casino bankroll. The current treasury balance is {treasury.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
                    </p>
                  </div>
                </a>
              </span>
            </div>
          </div> 
        </div> 
        ) : (
        <div>
          <div className="section-4-header">
            <div className="home-section-4-header">
              <h1 className="dg-powered-h1">
                Powered by $DG
              </h1>
              <span className="outter-dashboard-span">
                <span className="home-button-span">
                  <Button
                    color="blue"
                    className="our-blog-button"
                    href="/blog/presenting-dg-be-the-house-in-the-first-metaverse-casino"
                  >
                    READ ANNOUNCEMENT
                  </Button>
                  <Button
                    color="blue"
                    className="learn-more-button"
                    target="_blank"
                    href="https://docs.decentral.games/ecosystem"
                  >
                    LEARN MORE
                  </Button>
                </span>
                <a href="/dg">
                  <p className="home-more-nav-top">$DG Dashboard»</p>
                </a>
              </span>
            </div>
          </div>

          <div className="section-4-outter">
            <div className="home-section-4">

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
                      Mine $DG by playing games with MANA and DAI. Refer friends and enjoy up to 10% of the $DG they mine.
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
                      Earn $DG liquidity incentives by providing liquidity in Balancer or Uniswap AMM pools.
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
                      Stake $DG to govern the casino bankroll. The current treasury balance is {treasury.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.
                    </p>
                  </div>
                </a>

              </span>
            </div>
          </div> 
        </div> 
        )}
      </Aux>
    );
  }

  function sectionThree() {
    return (
      <Aux>
        <Parallax 
          blur={0} 
          bgImage="https://res.cloudinary.com/dnzambf4m/image/upload/v1609542250/2020-11-23_18-54-31_dr9zme.png" 
          strength={100}
        >
          <div className="home-section-2-outter">
            <div className="home-section-2 inner">
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
                Play blackjack, roulette, slots, and backgammon with MANA or DAI. Enjoy $DG gameplay mining rewards on all bets.
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
        <div className="section-4-outter-header" style={{ marginBottom: '-210px', marginTop: '-90px' }}>
          <div className="home-section-4-header" style={{ paddingBottom: '30px' }}>

          <span style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ display: 'flex', minWidth: '48.5%' }}>
              <Image
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610653695/download_2_bdhk3t.png" 
                style={{ height: '630px', objectFit: 'scale-down', marginLeft: '-60px' }}
              />
              <Image 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610652923/download_1_l4dnha.png" 
                  style={{ height: '810px', objectFit: 'scale-down', marginLeft: '-160px', zIndex: '-1' }}               
                />
              <Image
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610652806/download_lb9h4u.png" 
                style={{ height: '540px', objectFit: 'scale-down', marginLeft: '-170px' }}
              />
            </span>

              <span style={{ display: 'flex', minWidth: '48.5%', flexDirection: 'column', marginTop: '150px' }}>
                <h1 className="home-footer-h1" style={{ marginBottom: '0px' }}>
                  Learn more about the Decentral Games ecosystem
                </h1>
                <span className="home-button-span">
                  <Button
                    color="blue"
                    className="play-button"
                    href="/account"
                    target="_blank"
                  >
                    PARTNERS
                  </Button>
                  <Button
                    color="blue"
                    className="roadmap-button"
                    href="/account"
                    target="_blank"
                  >
                    ROADMAP
                  </Button>
                </span>
                <p className="home-footer-p" style={{ marginTop: '27px' }}>
                  We've strategically partnered with projects that help bolster our offerings and make our user experience as seamless as possible. Check out our partnerships to learn more and our roadmap to see what's in store for the future of Decentral Games.
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
          bgImage="https://res.cloudinary.com/dnzambf4m/image/upload/v1609549765/2020-11-22_10-12-02_yjrf1v.png" 
          strength={100}
        >
          <div className="home-section-2-outter">
            <div className="home-section-2 inner">
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
                The metaverse is poised to explode in 2021. 3D virtual blackjack, roulette, and poker accessible from anywhere in the world will change online gaming forever. 
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
        <div className="section-4-header" >
          <div className="home-section-4-header">
            <span className="outter-dashboard-span">
              <h1 className="dg-powered-h1">
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

            <span className="outter-games-container" 
              style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}
            >
              <div
                href="/dg/mining"
                target="_blank"
                className="dg-video-container one"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <iframe style={{ borderRadius: '4px' }} width="100%" height="240px" src="https://www.youtube.com/embed/7kyDcfEK_jU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                  </iframe>
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
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <iframe style={{ borderRadius: '4px' }} width="100%" height="240px" src="https://www.youtube.com/embed/-7U3_YzO-ZU" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                  </iframe>
                </span>
                <span style={{ display: 'flex', marginTop: '15px' }}>
                  <p className="tutorial-info">TUTORIAL</p>
                  <p className="tutorial-info-2">GAMEPLAY</p>
                </span>
                <h3 className="tutorials-h3 two">How to Play Blackjack and Earn $DG</h3>
              </div>

              <div
                href="/dg/mining"
                target="_blank"
                className="dg-video-container four"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  <iframe style={{ borderRadius: '4px' }} width="100%" height="240px" src="https://www.youtube.com/embed/zSyx4Zq0VJ0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
                  </iframe>
                </span>
                <span style={{ display: 'flex', marginTop: '15px' }}>
                  <p className="tutorial-info">TUTORIAL</p>
                  <p className="tutorial-info-2">GAMEPLAY</p>
                </span>
                <h3 className="tutorials-h3 two">How to Play Roulette and Earn $DG</h3>
              </div>

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

  return <div className="home-dashboard">
    {sectionOne()}
    {sectionTwo()}
    {sectionThree()}
    {sectionFour()}
    {sectionFive()}
    {sectionSix()}
  </div>;
};

export default Chateau;