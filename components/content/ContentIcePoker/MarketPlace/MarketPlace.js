import React, {useContext, useState} from 'react'
import {GlobalContext} from '../../../../store';
import ModalMintWearable from 'components/modal/ModalMintWearable';
import ModalLoginICE from 'components/modal/ModalLoginICE';
import {Button, Popup} from 'semantic-ui-react';
import cn from 'classnames';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import styles from './MarketPlace.module.scss'
import getConfig from "next/config";
import {appOptions} from "../../../../appOptions";

// This imports NODE_ENV from next.config.js
const { publicRuntimeConfig } = getConfig()
const { APP_ENV } = publicRuntimeConfig;
// let renderCount = 1;

const MarketPlace = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // console.log('render count: ', renderCount);  renderCount++;

  // define local variables
  const [previewLevel, setPreviewLevel] = useState(0);

  const detailsICE = {
    Pants: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
      'Trousers',
      'DG Suit',
      'Legs',
      '0 of 100 left',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg',
    ],
    Top: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
      'Blazer',
      'DG Suit',
      'Torso',
      '0 of 100 left',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg',
    ],
    Cigar: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
      'Cigar',
      'DG Suit',
      'Head',
      '0 of 100 left',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg',
    ],
    Shoes: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
      'Loafers',
      'DG Suit',
      'Feet',
      '0 of 100 left',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg',
    ],
    Glasses: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
      'Shades',
      'DG Suit',
      'Accessory',
      '0 of 100 left',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg',
    ],
  };

  const responsive = {
    largeDesktop: {
      breakpoint: { max: 3000, min: 1440 },
      items: 4,
      partialVisibilityGutter: 40,
    },
    desktop: {
      breakpoint: { max: 1440, min: 1240 },
      items: 3,
      partialVisibilityGutter: 40,
    },
    bigTablet: {
      breakpoint: { max: 1240, min: 900 },
      items: 2,
      partialVisibilityGutter: 125,
    },
    mediumTablet: {
      breakpoint: { max: 900, min: 768 },
      items: 2,
      partialVisibilityGutter: 60,
    },
    smallTablet: {
      breakpoint: { max: 768, min: 700 },
      items: 2,
      partialVisibilityGutter: 40,
    },
    bigMobile: {
      breakpoint: { max: 700, min: 600 },
      items: 2,
      partialVisibilityGutter: 0,
    },
    mediumMobile: {
      breakpoint: { max: 600, min: 420 },
      items: 1,
      partialVisibilityGutter: 120,
    },
    smallMobile: {
      breakpoint: { max: 420, min: 0 },
      items: 1,
      partialVisibilityGutter: 45,
    },
    smallest: {
      breakpoint: { max: 400, min: 0 },
      items: 1,
      partialVisibilityGutter: 0,
    },
  };

  const previewImages = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_1_h5zizs.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_2_y8onmu.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_4_uribpq.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_3_xhaxho.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_5_mmcqjy.png',
  ];

  return (
    <div className={styles.main_wrapper}>
      <span className={styles.iceWearablesMarketplace}>
        <div className={styles.header}>
          <h1>ICE Wearables Marketplace</h1>
          <p className={styles.marketplace_p}>
            ICE Wearables give you table access to free to play, play-to-earn
            poker. Learn more by{' '}
            <a href="https://ice.decentral.games/" target="_blank">
              clicking here.
            </a>
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
            <div
              className={styles.games_container}
              style={{ paddingBottom: '20px' }}
            >
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
                      className={
                        previewLevel === i ? styles.selectActive : styles.select
                      }
                      onClick={() => setPreviewLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(detailsICE).map((item, i) => (
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

                <img className={styles.nft_image} src={detailsICE[item][0]} />

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>{detailsICE[item][3]}</p>
                    <p className={styles.nft_info}>{detailsICE[item][4]}</p>
                  </span>
                  <p className={styles.nft_other_p}>{detailsICE[item][2]}</p>
                  <h3 className={styles.nft_other_h3}>{detailsICE[item][1]}</h3>
                </div>

                <div
                    style={{
                        marginTop: '24px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >

                  {(() => {
                    // Always show in non-production env, only show in production env if flag is enabled
                        if (appOptions.isMintWearableEnabled || APP_ENV !== 'production') {
                          if (state.userStatus && state.userLoggedIn) {
                            return <ModalMintWearable
                                index={i}
                                className={styles.right_button}
                                wearableImg={detailsICE[item][0]}
                                wearableBodyType={detailsICE[item][3]}
                                wearableBodyImg={detailsICE[item][5]}
                                wearableName={detailsICE[item][1]}
                            />
                          } else {
                            return <ModalLoginICE/>
                          }
                        } else {
                          return 
                            <a
                              href="https://opensea.io/collection/decentral-games-ice"
                              target="_blank"
                              style={{
                                width: '100%',
                              }}
                            >
                              <Button 
                                className={styles.opensea}
                              >
                                Buy on Opensea
                              </Button>
                            </a>
                        }
                      }
                  )()}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </span>
    </div>
  );
};

export default MarketPlace;
