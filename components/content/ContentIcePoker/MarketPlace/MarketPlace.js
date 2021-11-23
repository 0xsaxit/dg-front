import React, {useContext, useState} from 'react';
import {GlobalContext} from '../../../../store';
import ModalMintWearable from 'components/modal/ModalMintWearable';
import ModalLoginICE from 'components/modal/ModalLoginICE';
import {Button, Popup} from 'semantic-ui-react';
import cn from 'classnames';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import styles from './MarketPlace.module.scss';

const MarketPlace = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [previewHughHefLevel, setPreviewHughHefLevel] = useState(0);
  const [previewDGLevel, setPreviewDGLevel] = useState(0);
  const [previewBomberLevel, setPreviewBomberLevel] = useState(0);
  const [previewLinenLevel, setPreviewLinenLevel] = useState(0);
  const detailsICEPartyHost = {
    Shoes: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Slippers_Level_1_pmeiq1.png',
      'Slippers',
      'Party Host',
      'Feet',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg',
    ],
    Pants: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Pants_Level_1_y4iyir.png',
      'Smoking Pants',
      'Party Host',
      'Legs',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg',
    ],
    SmokingJacket: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Smoking_Jacket_Level_1_h8khui.png',
      'Smoking Jacket',
      'Party Host',
      'Torso',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg',
    ],
    Hat: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Sailor-Hat-_Level-1_jq3fnn.png',
      'Captains Hat',
      'Party Host',
      'Head',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg',
    ],
    Glasses: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Shades_Level_1_x4axck.png',
      'Smoking Glasses',
      'Party Host',
      'Accessory',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg',
    ],
  };
  const detailsICESuit = {
    Pants: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
      'Trousers',
      'DG Suit',
      'Legs',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg',
    ],
    Top: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
      'Blazer',
      'DG Suit',
      'Torso',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg',
    ],
    Cigar: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
      'Cigar',
      'DG Suit',
      'Head',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg',
    ],
    Shoes: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
      'Loafers',
      'DG Suit',
      'Feet',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg',
    ],
    Glasses: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
      'Shades',
      'DG Suit',
      'Accessory',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg',
    ],
  };
  const detailsICELinen = {
    Hat: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png',
      'Boater Hat',
      'Linen',
      'Head',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png',
    ],
    Cigar: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png',
      'XL Pipe',
      'Linen',
      'Head',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png',
    ],
    Top: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png',
      'Linen Shirt',
      'Linen',
      'Torso',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png',
    ],
    Pants: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png',
      'Linen Pants',
      'Linen',
      'Legs',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png',
    ],
    Shoes: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png',
      'Boater Shoes',
      'Linen',
      'Feet',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png',
    ],
  };
  const detailsICEBomber = {
    Pants: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png',
      'Bomber Pants',
      'Bomber',
      'Legs',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png',
    ],
    Hat: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png',
      'Bomber Hat',
      'Bomber',
      'Head',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png',
    ],
    Top: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png',
      'Bomber Jacket',
      'Bomber',
      'Torso',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png',
    ],
    Glasses: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png',
      'Bomber Glasses',
      'Bomber',
      'Accessory',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png',
    ],
    Shoes: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png',
      'Bomber Shoes',
      'Bomber',
      'Feet',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png',
    ],
  };
  const responsive = {
    veryLargeDesktop: {
      breakpoint: { max: 6000, min: 2400 },
      items: 6,
      partialVisibilityGutter: 2,
    },
    largeDesktop: {
      breakpoint: { max: 2400, min: 1440 },
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
  const previewHughHefImages = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_1_Hugh_mwzapj.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054315/Level_2_Hugh_t2g9tc.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_3_Hugh_nhbkdo.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_4_Hugh_jwxah3.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_5_Hugh_ogwkwo.png',
  ];
  const previewDGSuitImages = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_1_h5zizs.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_2_y8onmu.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_4_uribpq.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_3_xhaxho.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_5_mmcqjy.png',
  ];
  const previewBomberImages = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_1_aqjlun.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_2_eg3o0c.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_3_sxwgci.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_4_ad2vxh.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_5_ixqifi.png',
  ];
  const previewLinenImages = [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_1_hqogna.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_2_s3wrak.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_3_qrbcbx.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_4_jgqlue.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_5_vplmii.png',
  ];

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // useEffect(() => {
  //   if (state.itemLimits.COLLECTION_1[0][0] === 0) {
  //     setItemLimitsArray1(state.itemLimits.COLLECTION_1);
  //     setItemLimitsArray2(state.itemLimits.COLLECTION_2);
  //   } else {
  //     setItemLimitsArray2(state.itemLimits.COLLECTION_1);
  //     setItemLimitsArray1(state.itemLimits.COLLECTION_2);
  //   }
  // }, [state.itemLimits]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getCarousel(row) {
    if (row === 'partyHost') {
      return (
        <section className={styles.wearable_section}>
          <h3>Party Host</h3>
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
              <div>
                {previewHughHefImages.map((img, i) => (
                  <img
                    key={i}
                    className={i === previewHughHefLevel ? styles.preview_nft_image : styles.preview_nft_image_none}
                    src={img}
                  />
                ))}
              </div>
              <div className={styles.preview_description}>
                <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                <div className={styles.preview_level_select_div}>
                  {previewHughHefImages.map((img, i) => (
                    <div
                      key={i}
                      className={
                        previewHughHefLevel === i
                          ? styles.selectActive
                          : styles.select
                      }
                      onClick={() => setPreviewHughHefLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(detailsICEPartyHost).map((item, i) => (
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
                  src={detailsICEPartyHost[item][0]}
                />

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>
                      {detailsICEPartyHost[item][3]}
                    </p>
                    <p className={styles.nft_info}>0 of 100 left</p>
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICEPartyHost[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICEPartyHost[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>
                  <a
                    className={styles.flex_50}
                    href="https://opensea.io/collection/decentral-games-ice"
                    target="_blank"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Button className={styles.wearable_button}>
                      Buy on Secondary
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      );
    }
    if (row === 'dgSuit') {
      return (
        <section className={styles.wearable_section}>
          <h3>DG Suit</h3>
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
              <div>
                {previewDGSuitImages.map((img, i) => (
                  <img
                    key={i}
                    className={i === previewDGLevel ? styles.preview_nft_image : styles.preview_nft_image_none}
                    src={img}
                  />
                ))}
              </div>
              <div className={styles.preview_description}>
                <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                <div className={styles.preview_level_select_div}>
                  {previewDGSuitImages.map((img, i) => (
                    <div
                      key={i}
                      className={
                        previewDGLevel === i
                          ? styles.selectActive
                          : styles.select
                      }
                      onClick={() => setPreviewDGLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(detailsICESuit).map((item, i) => (
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
                  src={detailsICESuit[item][0]}
                />

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>{detailsICESuit[item][3]}</p>
                    <p className={styles.nft_info}>0 of 100 left</p>
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICESuit[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICESuit[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>
                  <a
                    className={styles.flex_50}
                    href="https://opensea.io/collection/decentral-games-ice"
                    target="_blank"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Button className={styles.wearable_button}>
                      Buy on Secondary
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      );
    }
    if (row === 'bomber') {
      return (
        <section className={styles.wearable_section}>
          <h3>Bomber</h3>
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
              <div>
                {previewBomberImages.map((img, i) => (
                  <img
                    key={i}
                    className={i === previewBomberLevel ? styles.preview_nft_image : styles.preview_nft_image_none}
                    src={img}
                  />
                ))}
              </div>
              <div className={styles.preview_description}>
                <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                <div className={styles.preview_level_select_div}>
                  {previewBomberImages.map((img, i) => (
                    <div
                      key={i}
                      className={
                        previewBomberLevel === i
                          ? styles.selectActive
                          : styles.select
                      }
                      onClick={() => setPreviewBomberLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(detailsICEBomber).map((item, i) => (
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
                  src={detailsICEBomber[item][0]}
                />

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>
                      {detailsICEBomber[item][3]}
                    </p>
                    {state.appConfig?.isPrivateWebsiteMintingEnabled &&
                      state.userStatus >= 4 && 
                      state.userLoggedIn ? (
                      <p className={styles.nft_info}>
                        {state.itemLimits4[i][0]} of 100 left
                      </p>
                    ) : (
                      <p className={styles.nft_info}>- of 100 left</p>
                    )}
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICEBomber[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICEBomber[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>

                  <div className={styles.flex_50}>
                    <ModalMintWearable
                      index={i}
                      numberLeft={state.itemLimits4[i][0]}
                      itemID={state.itemLimits4[i][1]}
                      address={state.itemLimits4[5]}
                      wearableImg={detailsICEBomber[item][0]}
                      wearableBodyType={detailsICEBomber[item][3]}
                      wearableBodyImg={detailsICEBomber[item][4]}
                      wearableName={detailsICEBomber[item][1]}
                    />
                  </div>
 
                </div>
                {/*<div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>
                      {detailsICEBomber[item][3]}
                    </p>
                    <p className={styles.nft_info}>0 of 100 left</p>
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICEBomber[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICEBomber[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>
                  <a
                    className={styles.flex_50}
                    href="https://opensea.io/collection/decentral-games-ice"
                    target="_blank"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Button className={styles.wearable_button}>
                      Buy on Secondary
                    </Button>
                  </a>
                </div>*/}
              </div>
            ))}
          </Carousel>
        </section>
      );
    }
    if (row === 'linen') {
      return (
        <section className={styles.wearable_section}>
          <h3>Linen</h3>
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
              <div>
                {previewLinenImages.map((img, i) => (
                  <img
                    key={i}
                    className={i === previewLinenLevel ? styles.preview_nft_image : styles.preview_nft_image_none}
                    src={img}
                  />
                ))}
              </div>
              <div className={styles.preview_description}>
                <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                <div className={styles.preview_level_select_div}>
                  {previewLinenImages.map((img, i) => (
                    <div
                      key={i}
                      className={
                        previewLinenLevel === i
                          ? styles.selectActive
                          : styles.select
                      }
                      onClick={() => setPreviewLinenLevel(i)}
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {Object.keys(detailsICELinen).map((item, i) => (
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
                  src={detailsICELinen[item][0]}
                />

                {/*<div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>
                      {detailsICELinen[item][3]}
                    </p>
                    {state.appConfig?.isPrivateWebsiteMintingEnabled &&
                      state.userStatus >= 4 && 
                      state.userLoggedIn ? (
                      <p className={styles.nft_info}>
                        {state.itemLimits3[i][0]} of 100 left
                      </p>
                    ) : (
                      <p className={styles.nft_info}>- of 100 left</p>
                    )}
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICELinen[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICELinen[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>
                  {(() => {
                    // Minting Enabled State
                    if ((state.appConfig?.isPublicWebsiteMintingEnabled
                        || (state.appConfig?.isPrivateWebsiteMintingEnabled && state.userStatus > 20)) &&
                      state.userLoggedIn &&
                      state.itemLimits3[i][0] > 0
                    ) {
                      return (
                        <div className={styles.flex_50}>
                          <ModalMintWearable
                            index={i}
                            numberLeft={state.itemLimits3[i][0]}
                            itemID={state.itemLimits3[i][1]}
                            address={state.itemLimits3[5]}
                            wearableImg={detailsICELinen[item][0]}
                            wearableBodyType={detailsICELinen[item][3]}
                            wearableBodyImg={detailsICELinen[item][4]}
                            wearableName={detailsICELinen[item][1]}
                          />
                        </div>
                      );
                      // Minting Disabled States
                    } else {
                      // Logged Out State
                      if (!state.userLoggedIn) {
                        return (
                          <div className={styles.flex_50}>
                            <ModalLoginICE />
                          </div>
                        );
                      }
                      // Sold Out State
                      else if (
                        state.itemLimits3[i][0] < 1 &&
                        state.userStatus >= 4
                      ) {
                        return (
                          <Button disabled className={styles.sold_button}>
                            Sold Out!
                          </Button>
                        );
                      } else {
                        // Coming Soon State
                        if (state.itemLimits3[i][0] > 0) {
                          return (
                            <Button disabled className={styles.sold_button}>
                              Coming Soon!
                            </Button>
                          );
                        }
                      }
                    }
                  })()}
                </div>*/}

                <div className={styles.nft_description}>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className={styles.nft_info}>
                      {detailsICELinen[item][3]}
                    </p>
                    <p className={styles.nft_info}>0 of 100 left</p>
                  </span>
                  <p className={styles.nft_other_p}>
                    {detailsICELinen[item][2]}
                  </p>
                  <h3 className={styles.nft_other_h3}>
                    {detailsICELinen[item][1]}
                  </h3>
                </div>

                <div className={styles.button_container}>
                  <a
                    className={styles.flex_50}
                    href="https://opensea.io/collection/decentral-games-ice"
                    target="_blank"
                    style={{
                      width: '100%',
                    }}
                  >
                    <Button className={styles.wearable_button}>
                      Buy on Secondary
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      );
    }
  }

  return (
    <div className={styles.main_wrapper}>
      <span className={styles.iceWearablesMarketplace}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <h1>ICE Wearables Marketplace</h1>
            {state.userStatus > 20 && (
              <span className={styles.white_listed_address}>
                Whitelisted Address &nbsp;
                <svg
                  width="7"
                  height="6"
                  viewBox="0 0 7 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.06563 5.68435C3.28438 5.68435 3.45625 5.59998 3.575 5.42498L6.48438 0.990601C6.56875 0.862476 6.60313 0.740601 6.60313 0.628101C6.60313 0.324976 6.37188 0.0999755 6.05938 0.0999755C5.84688 0.0999755 5.7125 0.178101 5.58125 0.381226L3.05313 4.36873L1.77188 2.79685C1.65313 2.6531 1.52188 2.5906 1.34063 2.5906C1.025 2.5906 0.796875 2.8156 0.796875 3.12185C0.796875 3.25935 0.8375 3.3781 0.95625 3.51248L2.56875 5.44998C2.70313 5.60935 2.85938 5.68435 3.06563 5.68435Z"
                    fill="#1F1F1F"
                  />
                </svg>
              </span>
            )}
          </div>

          <p className={styles.marketplace_p}>
            ICE Wearables give you table access to free to play, play-to-earn
            poker. Learn more by{' '}
            <a href="https://ice.decentral.games/" target="_blank">
              clicking here.
            </a>
          </p>
        </div>

        <div className={styles.outter_games_container}>
          {getCarousel('bomber')}
          {getCarousel('linen')}
          {getCarousel('partyHost')}
          {getCarousel('dgSuit')}
        </div>
      </span>
    </div>
  );
};

export default MarketPlace;
