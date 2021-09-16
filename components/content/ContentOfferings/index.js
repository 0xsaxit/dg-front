import { Image, Button, Divider } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import styles from './ContentOfferings.module.scss';
import ModalMintActivation from 'components/modal/ModalMintActivation';
import ModalMintWearable from 'components/modal/ModalMintWearable';

const WEARABLES = [
  {
    product:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
    name: 'Suit Top',
    type: 'Torso',
    bodyPartType: 'Torso',
    bodyPartImg: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg',
    status: 'Sold Out!',
  },
  {
    product:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
    name: 'Suit Pants',
    type: 'Pants',
    bodyPartType: 'Legs',
    bodyPartImg: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg',
    status: 'Mint New Wearable',
  },
  {
    product:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
    name: 'Money Shoes',
    type: 'Shoes',
    bodyPartType: 'Feet',
    bodyPartImg: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg',
    status: 'Coming Soon!',
  },
  {
    product:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
    name: 'Money Shades',
    type: 'Accessory',
    bodyPartType: 'Accessory',
    bodyPartImg: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg',
    status: 'Mint New Wearable',
  },
  {
    product:
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
    name: 'Cigar',
    type: 'Accessory',
    bodyPartType: 'Head',
    bodyPartImg: 'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg',
    status: 'Mint New Wearable',
  },
];

const ContentOfferings = props => {
  // define local variables
  const [utm, setUtm] = useState('');

  let buttonGames1 = '';
  let buttonGames2 = '';
  let buttonGames3 = '';
  let buttonGames4 = '';
  let buttonCasinos1 = '';
  let buttonCasinos2 = '';
  // let buttonCasinos3 = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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
      <div className="outter-games-container">
        {Object.keys(props.detailsGames).map((item, i) => (
          <a
            href={props.detailsGames[item][6] + utm}
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={props.detailsGames[item][0]}
                className={props.detailsGames[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <span>
                <p className="nfts-info">
                  {props.detailsGames[item][4]} {props.detailsGames[item][5]}
                </p>
              </span>
              <h3 className="nft-other-h3">{props.detailsGames[item][2]}</h3>
              <p className="nft-other-p">{props.detailsGames[item][3]}</p>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsGames[item][6] + utm}
                >
                  Play
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsGames[item][7]}
                >
                  Info
                </Button>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsNFTs).map((item, i) => (
          <a href={props.detailsNFTs[item][5]} className="games-container">
            <div key={i}>
              <span className="nft-image">
                <Image
                  src={props.detailsNFTs[item][0]}
                  className={props.detailsNFTs[item][1]}
                  style={{ borderRadius: '4px' }}
                />
              </span>
              <div className="nft-description">
                <span>
                  <p className="nfts-info">{props.detailsNFTs[item][3]}</p>
                </span>
                <h3 className="nft-other-h3">{props.detailsNFTs[item][2]}</h3>

                <p className="nft-other-p">{props.detailsNFTs[item][4]}</p>

                <span
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button
                    color="blue"
                    className="nft-button"
                    target="_blank"
                    href={props.detailsNFTs[item][5]}
                  >
                    Buy
                  </Button>
                  <Button
                    className="nft-read-button"
                    target="_blank"
                    href={props.detailsNFTs[item][6]}
                  >
                    Info
                  </Button>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyICE() {
    return (
      <div className={styles.ice_container}>
        <h1>ICE Wearables Marketplace</h1>
        <p className={styles.marketplace_p}>
          ICE Wearables give you table access to free to play, play-to-earn
          poker. Learn more by clicking here.
        </p>

        <h2>Mintable Hugh Hef Fit</h2>

        <div className={styles.outter_games_container}>
          {new Array(5).fill().map((item, i) => (
            <a className={styles.games_container}>
              <div key={i} style={{ position: 'relative' }}>
                <div className={styles.p2e_enabled}>
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640051/p2e_enabled_wgqui5.svg"
                    className={styles.p2e_enabled_img}
                  />
                </div>
                <span className={styles.nft_image}>
                  <Image
                    src={WEARABLES[i % 5].product}
                    className={styles.product_image}
                  />
                </span>
                <div className={styles.nft_description}>
                  <span className="d-flex justify-content-center">
                    <p className={styles.nfts_info}>{WEARABLES[i % 5].type}</p>
                    <p className={styles.nfts_info}>1 of 100</p>
                  </span>
                  <h3 className={styles.nft_other_h3}>OUTFIT NAME</h3>

                  <p className={styles.nft_other_p}>{WEARABLES[i % 5].name}</p>
                  <ModalMintWearable
                    className={styles.right_button}
                    wearableImg={WEARABLES[i % 5].product}
                    wearableBodyType={WEARABLES[i % 5].bodyPartType}
                    wearableBodyImg={WEARABLES[i % 5].bodyPartImg}
                  />
                  {/* <ModalMintActivation /> */}
                  {/* <ActivateWearableModal /> */}
                  {/* <ModalLogin /> */}
                  {/* <ModalActivationSuccess setPending={false} /> */}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentCasinos() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsCasinos).map((item, i) => (
          <a
            href={props.detailsCasinos[item][5] + utm}
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={props.detailsCasinos[item][0]}
                className={props.detailsCasinos[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <span>
                <p className="nfts-info">{props.detailsCasinos[item][4]}</p>
              </span>
              <h3 className="nft-other-h3">{props.detailsCasinos[item][2]}</h3>
              <p className="nft-other-p">{props.detailsCasinos[item][3]}</p>

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  id={`play-now-button-casinos-${i + 1}`}
                  color="blue"
                  className="casino-button"
                  target="_blank"
                  href={props.detailsCasinos[item][5] + utm}
                >
                  Play
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentShop() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsShop).map((item, i) => (
          <a
            href={props.detailsShop[item][6] + utm}
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={props.detailsShop[item][0]}
                className={props.detailsShop[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <span>
                <p className="nfts-info">{props.detailsShop[item][4]}</p>
              </span>
              <h3 className="nft-other-h3">{props.detailsShop[item][2]}</h3>

              <p className="nft-other-p">{props.detailsShop[item][3]}</p>

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsShop[item][5] + utm}
                >
                  Shop
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsShop[item][6]}
                >
                  Info
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
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
