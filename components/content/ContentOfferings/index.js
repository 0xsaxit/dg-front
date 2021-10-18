import { Image, Button, Divider } from 'semantic-ui-react';
import { useState, useContext, useEffect } from 'react';
import styles from './ContentOfferings.module.scss';
import { GlobalContext } from '../../../store';
import ModalMintActivation from 'components/modal/ModalMintActivation';
import ModalMintWearable from 'components/modal/ModalMintWearable';
import ModalLoginICE from 'components/modal/ModalLoginICE';
import { Popup } from 'semantic-ui-react';
import cn from 'classnames';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";

const ContentOfferings = props => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [utm, setUtm] = useState('');
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [previewLevel, setPreviewLevel] = useState(0);

  let buttonGames1 = '';
  let buttonGames2 = '';
  let buttonGames3 = '';
  let buttonGames4 = '';
  let buttonCasinos1 = '';
  let buttonCasinos2 = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  useEffect(() => {
    buttonGames1 = document.getElementById('play-now-button-games-1');
    buttonGames2 = document.getElementById('play-now-button-games-2');
    buttonGames3 = document.getElementById('play-now-button-games-3');
    buttonGames4 = document.getElementById('play-now-button-games-4');
    buttonCasinos1 = document.getElementById('play-now-button-casinos-1');
    buttonCasinos2 = document.getElementById('play-now-button-casinos-2');
    // buttonCasinos3 = document.getElementById('play-now-button-casinos-3');
  }, []);

  useEffect(() => {
    if (buttonGames1 || buttonGames2 || buttonGames3 || buttonGames4) {
      analytics.trackLink(
        [buttonGames1, buttonGames2, buttonGames3, buttonGames4],
        'Clicked PLAY NOW (games page)'
      );
    }
  }, [buttonGames1, buttonGames2, buttonGames3, buttonGames4]);

  useEffect(() => {
    if (buttonCasinos1 || buttonCasinos2) {
      analytics.trackLink(
        [buttonCasinos1, buttonCasinos2],
        'Clicked PLAY NOW (casinos page)'
      );
    }
  }, [buttonCasinos1, buttonCasinos2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGames() {
    return (
      <span>
        <div className={styles.outter_games_container}>
          {Object.keys(props.detailsGames).map((item, i) => (
            <a
              key={i}
              href={props.detailsGames[item][6] + utm}
              target="_blank"
              className={styles.games_container}
            >
              <img
                src={props.detailsGames[item][0]}
                className={styles.nft_image}
              />

              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {props.detailsGames[item][4]}
                  </p>
                  <p className={styles.nft_info}>
                    {props.detailsGames[item][5]}
                  </p>
                </span>
                <h3 className={styles.nft_h3}>{props.detailsGames[item][2]}</h3>
                <p className={styles.nft_p}>{props.detailsGames[item][3]}</p>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsGames[item][6] + utm}
                >
                  Play Now
                </Button>
              </div>
            </a>
          ))}
        </div>
      </span>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
    return (
      <span>
        <div className={styles.outter_games_container}>
          {Object.keys(props.detailsNFTs).map((item, i) => (
            <a
              key={i}
              href={props.detailsNFTs[item][6] + utm}
              target="_blank"
              className={styles.games_container}
            >
              <img
                src={props.detailsNFTs[item][0]}
                className={styles.nft_image}
              />
              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {props.detailsNFTs[item][4]}
                  </p>
                  {props.detailsNFTs[item][5] == 'Blackjack' ? (
                    <p className={styles.nft_info}>
                      {props.detailsNFTs[item][5]}
                    </p>
                  ) : null}
                </span>
                <p className={styles.nft_other_p}>
                  {props.detailsNFTs[item][3]}
                </p>
                <h3 className={styles.nft_other_h3}>
                  {props.detailsNFTs[item][2]}
                </h3>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsNFTs[item][6] + utm}
                >
                  Purchase Item
                </Button>
              </div>
            </a>
          ))}
        </div>
      </span>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyICE() {
    const responsive = {
      largeDesktop: {
        breakpoint: { max: 3000, min: 1440 },
        items: 4,
        partialVisibilityGutter: 40
      },
      desktop: {
        breakpoint: { max: 1440, min: 1240 },
        items: 3,
        partialVisibilityGutter: 40
      },
      bigTablet: {
        breakpoint: { max: 1240, min: 900 },
        items: 2,
        partialVisibilityGutter: 125
      },
      mediumTablet: {
        breakpoint: { max: 900, min: 768 },
        items: 2,
        partialVisibilityGutter: 60
      },
      smallTablet: {
        breakpoint: { max: 768, min: 700 },
        items: 2,
        partialVisibilityGutter: 40
      },
      bigMobile: {
        breakpoint: { max: 700, min: 600 },
        items: 2,
        partialVisibilityGutter: 0
      },
      mediumMobile: {
        breakpoint: { max: 600, min: 420 },
        items: 1,
        partialVisibilityGutter: 120
      },
      smallMobile: {
        breakpoint: { max: 420, min: 0 },
        items: 1,
        partialVisibilityGutter: 45
      },
      smallest: {
        breakpoint: { max: 400, min: 0 },
        items: 1,
        partialVisibilityGutter: 0
      }
    };
    const previewImages = [
      "https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_1_h5zizs.png",
      "https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_2_y8onmu.png",
      "https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_4_uribpq.png",
      "https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_3_xhaxho.png",
      "https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_5_mmcqjy.png"
    ]

    return (
      <span className={styles.iceWearablesMarketplace}>
        <div className={styles.header}>
          <h1>ICE Wearables Marketplace</h1>
          <p className={styles.marketplace_p}>
            ICE Wearables give you table access to free to play, play-to-earn
            poker. Learn more by <a href="/">clicking here.</a>
          </p>
          <h3>DG Suit</h3>
        </div>

        <div className={styles.outter_games_container}>
          <Carousel
            arrows
            draggable
            swipeable
            partialVisible
            autoPlaySpeed={3000}
            focusOnSelect={false}
            infinite={false}
            keyBoardControl={true}
            minimumTouchDrag={80}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={responsive}
            showDots={false}
            slidesToSlide={1}
            containerClass="ice-wearables-carousel-container"
            itemClass="carousel-item"
          >
            <div className={styles.games_container} style={{ paddingBottom: '20px' }}>
              <img
                key={previewLevel}
                className={styles.preview_nft_image}
                src={previewImages[previewLevel]}
              />
              <div className={styles.preview_description}>
                <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                <div className={styles.preview_level_select_div}>
                  {previewImages.map((img, i) => (
                    <div
                      key={i}
                      className={previewLevel === i ? styles.selectActive : styles.select}
                      onClick={() => setPreviewLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(props.detailsICE).map((item, i) => (
              <div key={i} className={styles.games_container}>
                <div className={styles.wear_box_purple}>
                  <div className={styles.fullDiv}>
                    <div className={styles.imgDiv}>
                      <img
                        className={styles.img}
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640051/p2e_enabled_wgqui5.svg"
                      />
                      <Popup
                        trigger={
                          <img
                            className={styles.tooltip}
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
                          />
                        }
                        position="top left"
                        hideOnScroll={true}
                        className={cn('p2e_enabled_tooltip', styles.popup)}
                      >
                        <Popup.Content className={styles.tooltipContent}>
                          <img
                            className={styles.popup_info}
                            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
                          />
                          <p className={styles.popup_content}>
                            P2E Enabled (aka Play-to-Earn)
                            <br /> wearables allow you to earn real
                            <br /> cash value from free-to-play ICE
                            <br /> poker tables.
                          </p>
                        </Popup.Content>
                      </Popup>
                    </div>
                  </div>
                </div>

                <img
                  className={styles.nft_image}
                  src={props.detailsICE[item][0]}
                />

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>{props.detailsICE[item][3]}</p>
                    <p className={styles.nft_info}>{props.detailsICE[item][4]}</p>
                  </span>
                  <p className={styles.nft_other_p}>
                    {props.detailsICE[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {props.detailsICE[item][1]}
                  </h3>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  {state.userStatus && state.userLoggedIn ? (
                    <ModalMintWearable
                      index={i}
                      className={styles.right_button}
                      wearableImg={props.detailsICE[item][0]}
                      wearableBodyType={props.detailsICE[item][3]}
                      wearableBodyImg={props.detailsICE[item][5]}
                      wearableName={props.detailsICE[item][1]}
                    />
                  ) : (
                    <ModalLoginICE />
                  )}

                  {/* <ModalMintActivation /> */}
                  {/* <ActivateWearableModal /> */}
                  {/* <ModalActivationSuccess setPending={false} /> */}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </span >
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentCasinos() {
    return (
      <span>
        <div className={styles.outter_games_container}>
          {Object.keys(props.detailsCasinos).map((item, i) => (
            <a
              key={i}
              href={props.detailsCasinos[item][6] + utm}
              target="_blank"
              className={styles.games_container}
            >
              <img
                src={props.detailsCasinos[item][0]}
                className={styles.nft_image}
              />

              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {props.detailsCasinos[item][4]}
                  </p>
                  {props.detailsCasinos[item][5] == 'Blackjack' ? (
                    <p className={styles.nft_info}>
                      {props.detailsCasinos[item][5]}
                    </p>
                  ) : null}
                  {props.detailsCasinos[item][7] ? (
                    <p className={styles.nft_info}>
                      {props.detailsCasinos[item][6]}
                    </p>
                  ) : null}
                </span>
                <h3 className={styles.nft_h3}>
                  {props.detailsCasinos[item][2]}
                </h3>
                <p className={styles.nft_p}>{props.detailsCasinos[item][3]}</p>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsCasinos[item][6] + utm}
                >
                  Play Now
                </Button>
              </div>
            </a>
          ))}
        </div>
      </span>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentShop() {
    return (
      <span>
        <div className={styles.outter_games_container}>
          {Object.keys(props.detailsShop).map((item, i) => (
            <a
              key={i}
              href={props.detailsShop[item][6] + utm}
              target="_blank"
              className={styles.games_container}
            >
              <img
                src={props.detailsShop[item][0]}
                className={styles.nft_image}
              />

              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {props.detailsShop[item][4]}
                  </p>
                  {props.detailsShop[item][5] == 'Blackjack' ? (
                    <p className={styles.nft_info}>
                      {props.detailsShop[item][5]}
                    </p>
                  ) : null}
                </span>
                <h3 className={styles.nft_h3}>{props.detailsShop[item][2]}</h3>
                <p className={styles.nft_p}>{props.detailsShop[item][3]}</p>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsShop[item][5] + utm}
                >
                  Visit Store
                </Button>
              </div>
            </a>
          ))}
        </div>
      </span>
    );
  }

  if (props.gameState === 'games') {
    return contentGames();
  } else if (props.gameState === 'nfts') {
    return buyNFTs();
  } else if (props.gameState === 'ice') {
    return buyICE();
  } else if (props.gameState === 'casinos') {
    return contentCasinos();
  } else if (props.gameState === 'shop') {
    return contentShop();
  }
};

export default ContentOfferings;
