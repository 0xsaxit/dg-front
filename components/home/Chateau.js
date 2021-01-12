import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Divider, Image } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Mailchimp from '../Mailchimp';
import Aux from '../_Aux';
import Footer from './Footer';
import Fetch from '../../common/Fetch';
import Images from '../../common/Images';

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
  const total_gov_staked = Number(
    state.stakingBalances.contractBalanceStakingGov
  );

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
              Be the house in the first metaverse casino. Earn $DG through gameplay, liquidity provision, and governance rewards. 
            </p>
          </div>
        )}

        {state.userStatus === 3 || isLoading ? (

          <div>
          <div className="section-4-header-loading">
            <div className="home-section-4-header">
              <h1 className="dg-powered-h1">
                Powered by $DG
              </h1>
              <span className="dashboard-span">
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
                      Mine $DG by playing games with MANA and DAI.
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
        </div> 
        ) : (
        <div>
          <div className="section-4-header">
            <div className="home-section-4-header">
              <h1 className="dg-powered-h1">
                Powered by $DG
              </h1>
              <span className="dashboard-span">
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
                      Mine $DG by playing games with MANA and DAI.
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
        </div>
        )}

        <div className="section-2-outter">
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
              Play blackjack, roulette, slots, and backgammon with MANA or DAI. Enjoy $DG gameplay mining rewards on all bets.
            </p>
          </div>
        </div>

        <div className="section-4-outter-header">
          <div className="home-section-4-header">
            <h1 className="dg-powered-h1">
              Community Governed Treasury
            </h1>

            <span className="dashboard-span">
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
                <p className="home-more-nav-top">$DG Dashboard »</p>
              </a>
            </span>
          </div>
        </div>

          <div className="section-4-outter">
            <div className="home-section-4">
              <span className="outter-games-container" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
                <span
                  className="dg-powered-container one"
                >
                  <span
                    style={{ display: 'flex', justifyContent: 'center' }}
                    className="nft-image"
                  >
                  <Image
                    src={Images.MANA_CIRCLE}
                    className="dg-powered-pic"
                    style={{ height: '90px', marginBottom: '3px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">Mana</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />
                  <h1
                    className="dg-powered-h1"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '6px',
                      marginBottom: '-21px',
                      textAlign: 'center',
                    }}
                  >
                    {treasury_mana_tokens.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </h1>
                </div>
              </span>

              <span
                className="dg-powered-container two"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src={Images.DAI_CIRCLE}
                    className="dg-powered-pic"
                    style={{ height: '90px', marginBottom: '3px' }}
                  />
                </span>
                <div className="nft-description">
                 <h3 className="nft-other-h3">Dai</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />
                  <h1
                    className="dg-powered-h1"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '6px',
                      marginBottom: '-21px',
                      textAlign: 'center',
                    }}
                  >
                    {treasury_dai.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </h1>
                </div>
              </span>

              <span
                className="dg-powered-container three"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1610421682/rwugnpwexjpfzfaiwdv1.png"
                    className="dg-powered-pic"
                    style={{ height: '90px', marginBottom: '3px' }}
                  />
                </span>
                <div className="nft-description">
                 <h3 className="nft-other-h3">USD</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />
                  <h1
                    className="dg-powered-h1"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '6px',
                      marginBottom: '-21px',
                      textAlign: 'center',
                    }}
                  >
                    {treasury.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </h1>
                </div>
              </span>

              <span
                className="dg-powered-container four"
              >
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src={Images.DG_COIN_LOGO}
                    className="dg-powered-pic"
                    style={{ height: '90px', marginBottom: '3px' }}
                  />
                </span>
                <div className="nft-description">
                 <h3 className="nft-other-h3">Staked</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                  </span>

                  <Divider
                    style={{
                      margin: '10px 0px 15px 0px',
                      width: 'calc(100% + 60px)',
                      marginLeft: '-30px',
                    }}
                  />
                  <h1
                    className="dg-powered-h1"
                    style={{
                      marginTop: '-12px',
                      paddingTop: '6px',
                      marginBottom: '-21px',
                      textAlign: 'center',
                    }}
                  >
                    {total_gov_staked.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </h1>
                </div>
              </span>


            </span>
          </div>
        </div>

        <div className="section-3-outter">
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
              The metaverse is poised to explode in 2021. 3D virtual blackjack, roulette, and poker accessible from anywhere in the world will change online gaming forever. 
            </p>
          </div>
        </div>

        <div className="section-4-header" >
          <div className="home-section-4-header">
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
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

  return <div className="home-dashboard">{mainContent()}</div>;
};

export default Chateau;
