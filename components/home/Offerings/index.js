import { useState, useContext } from 'react';
import { GlobalContext } from 'store';
import Link from 'next/link';
import { Icon } from 'semantic-ui-react';
import ContentOfferings from 'components/content/ContentOfferings';
import ContentLeaderboard from 'components/content/ContentLeaderboard';
// import Spinner from '../Spinner'; // ********** should we add the spinner to this page??? **********
import Images from 'common/Images';
import Aux from 'components/_Aux';
import { useMediaQuery } from 'hooks';
import cn from 'classnames';

import styles from './Offerings.module.scss';

const detailsGames = {
  Poker: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919779/Poker_ekorsi.jpg',
    'games-pic',
    'Poker',
    'Decentral Games poker is in beta and currently only playable using FREE tokens. Visit our discord via the "Read More" button for info on pop up tournaments and updates.',
    '2-6 PLAYERS • ',
    'FREE',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg',
    'https://decentral.games/discord',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919297/Blackjack_logt66.jpg',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
    'https://docs.decentral.games/games/blackjack',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919296/Roulette_hptwtf.jpg',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows.',
    '1-8 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
    'https://docs.decentral.games/games/roulette',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919947/SLOTS_hegzzk.jpg',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring five spinning reels each with four icons. There are two clickable buttons facing the player to set the bet amount and spin.',
    '1 PLAYER • ',
    'COMING SOON',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
    'https://docs.decentral.games/games/slots',
  ],
};

const detailsCasinos = {
  Tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916730/Tominoya_Lapse_om9erf.gif',
    'games-pic',
    'Tominoya',
    'Tominoya is a Japanese-themed scene located in the Vegas City district of Decentraland. The scene features two floors with three wings each, and a conference center upstairs where live video streams are held.',
    'ROULETTE • BLACKJACK • POKER',
    'https://play.decentraland.org/?position=-119%2C133&realm=dg',
    'https://docs.decentral.games/operators/tominoya',
  ],
  Atari: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1625022643/ATARI_TIMELAPSE_1_brvynj.gif',
    'games-pic',
    'Atari',
    'Atari is located within the Vegas City district in Decentraland. Situated on a 20-parcel estate, the scene features an open-concept floor plan and building design modelled after the iconic Atari logo.',
    'ROULETTE • BLACKJACK',
    'https://play.decentraland.org/?position=-94%2C110&realm=dg',
    'https://docs.decentral.games/operators/atari',
  ],
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916719/Chateau_Chatoshi_lapse_2_gbjrgn.gif',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is located within the Vegas City district in Decentraland. The scene features an art deco inspired experience, theatre, nightclub, and stratosphere. Chateau is accessible from the most northwestern Decentraland Genesis Plaza.',
    'ROULETTE • BLACKJACK',
    'https://play.decentraland.org/?position=-75%2C77&realm=dg',
    'https://docs.decentral.games/operators/chateau-satoshi',
  ],
  Dext: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1627209301/Dext_Timelapse_1_oh5bnz.gif',
    'games-pic',
    'DEXT Poker Lounge',
    'The DEXT Poker Lounge is located within the Vegas City district in Decentraland. Eight Texas Holdem poker tables are located in the penthouse, accessible by entering a teleporter on the ground floor of the DEXT skyscraper.',
    'POKER',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg',
    'https://docs.decentral.games/operators/dext',
  ],
  BAYC: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1628340721/cloudinary_zjohvr.gif',
    'games-pic',
    'Bored Ape Yacht Club',
    'The Bored Ape Yacht Club is a riverboat themed venue located within the Vegas City district in Decentraland. The scene has Ape-themed croupiers stylized in the likeness of the immensely popular NFT series',
    'ROULETTE • BLACKJACK • POKER',
    'https://play.decentraland.org/?position=-118%2C135&realm=dg',
    'https://docs.decentral.games/operators/dext',
  ],
  Aquarium: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1628340722/Aquarium_timelaps_2_lpqj2r.gif',
    'games-pic',
    'The Aquarium',
    'The Aquarium is located within the Vegas City district in Decentraland. The underwater-themed venue features neon lights, aquatic artwork, and virtual fish navigating the scene floor.',
    'ROULETTE • BLACKJACK',
    'https://play.decentraland.org/?position=-118%2C129&realm=dg',
    'https://docs.decentral.games/operators/dext',
  ],
};

const detailsShop = {
  shop_dcl: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741773/nftshop_yojy7q.png',
    'games-pic',
    'NFT Shop',
    'Our NFT shop is located Vegas City district in Decentraland right next door to Chateau Satoshi. The scene features a building inspired by modern architecture which houses all of Decentral Games NFTs. The scene is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'WEARABLES',
    'https://play.decentraland.org/?position=-75%2C79&realm=dg',
    'https://opensea.io/blog/guides/non-fungible-tokens/',
  ],
  shop_opensea: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1613266160/OpenSea_y26zkp.png',
    'games-pic',
    'OpenSea',
    'Decentral Games wearables are also available on OpenSea. OpenSea provides a one-stop shop for creating a customizable marketplace for non-fungible tokens, like our Decentral Games wearables. Here, users can smoothly buy and sell our wearables, get custom stats and analytics, and earn revenue by trading goods.',
    'WEARABLES',
    'https://opensea.io/accounts/DecentralGames',
    'https://opensea.io/blog/guides/non-fungible-tokens/',
  ],
};

const detailsNFTs = {
  mink_coat: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed_y8ozak.png',
    'nft_pic',
    'DG Fur Mink',
    'LEGENDARY',
    'An opulent fur coat made from minks #extrasaus',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/247',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
    'nft_pic',
    'DG Tracksuit Jacket',
    'LEGENDARY',
    'The jacket of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/248',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-2_eiirjc.png',
    'nft_pic',
    'DG Tracksuit Pants',
    'LEGENDARY',
    'The pants of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/246',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-3_ey4xpe.png',
    'nft_pic',
    'DG Flip Up Spectacles',
    'LEGENDARY',
    'Swaggy flip up shades designed to be wearable at any occassion. #ice',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/243',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-4_ccrxbx.png',
    'nft_pic',
    'DG Deezys',
    'LEGENDARY',
    'Comfy and elegant sneekers #deezys',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/244',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed-5_pdvxqy.png',
    'nft_pic',
    'DG Slides',
    'LEGENDARY',
    'Lazy day designer slides complete with socks to keep your toes warm #cozyslides',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/245',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  headphones: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1626511651/unnamed_apacqs.png',
    'nft-pic',
    'DG Headphones',
    'LEGENDARY',
    'Hitting the tables? Tune out the noise, get in the zone.',
    'https://market.decentraland.org/contracts/0xf16ff41128b298304b761b49c1c56580972ada32/items/0',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
};

const detailsICE = {
  suit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1629803803/Group_209_tsgkuy.png',
    'nft-pic',
    'Suit Jacket',
    'RANK 1',
    'Description will live here',
    'https://decentral.games/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout',
  ],
  suit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1629803803/Group_209_tsgkuy.png',
    'nft-pic',
    'Suit Pants',
    'RANK 1',
    'Description will live here',
    'https://decentral.games/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout',
  ],
  shoes: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1629803803/Group_209_tsgkuy.png',
    'nft-pic',
    'Dress Shoes',
    'RANK 1',
    'Description will live here',
    'https://decentral.games/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout',
  ],
  glasses: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1629803803/Group_209_tsgkuy.png',
    'nft-pic',
    'Glasses',
    'RANK 1',
    'Description will live here',
    'https://decentral.games/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout',
  ],
  cigar: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1629803803/Group_209_tsgkuy.png',
    'nft-pic',
    'Cigar',
    'RANK 1',
    'Description will live here',
    'https://decentral.games/blog/decentral-games-announces-play-to-earn-metaverse-poker-ice-token-rollout',
  ],
};

const Offerings = props => {
  // get leaderboard data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [timePeriod, setTimePeriod] = useState('ALL TIME');

  const gameState = props.gameState;

  // Responsive
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1040px)');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function handleChange(value) {
    var gameSelect = '';
    if (value === 'play') {
      gameSelect = 'play';
    } else if (value === 'mana') {
      gameSelect = 'mana';
    } else if (value === 'dai') {
      gameSelect = 'dai';
    } else if (value === 'eth') {
      gameSelect = 'eth';
    } else if (value === 'usdt') {
      gameSelect = 'usdt';
    } else {
      gameSelect = 'atri';
    }
    setGameSelect(gameSelect);
  }

  const timePeriods = ['ALL TIME', 'WEEKLY', 'DAILY', 'COMPETITION'];
  const coins = ['play', 'mana', 'dai', 'eth', 'usdt', 'atri'];

  function coinChangeForward() {
    var i = gameSelect;
    var j = coins.indexOf(i);
    if (j < 5) {
      setGameSelect(coins[j + 1]);
    } else {
      j = 0;
      setGameSelect(coins[j]);
    }
  }

  function coinChangeBackward() {
    var i = gameSelect;
    var j = coins.indexOf(i);
    if (j === 0) {
      j = coins.length;
    }
    setGameSelect(coins[j - 1]);
  }

  function timeChangeForward() {
    var i = timePeriod;
    var j = timePeriods.indexOf(i);
    if (j < 3) {
      setTimePeriod(timePeriods[j + 1]);
    } else {
      j = 0;
      setTimePeriod(timePeriods[j]);
    }
  }

  function timeChangeBackward() {
    var i = timePeriod;
    var j = timePeriods.indexOf(i);
    if (j < 1) {
      j = 3;
      setTimePeriod(timePeriods[j]);
    } else {
      setTimePeriod(timePeriods[j - 1]);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <>
        {isMobile && !mobileOpen ? (
          <div className={styles.tablet_menu_container}>
            <div
              className={styles.burger_icon}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <svg
                width="9"
                height="15"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                  stroke="white"
                  stroke-width="1"
                  stroke-opacity="0.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>

            <div className={styles.menu_list}>
              <div>
                <Link href="/games">
                  <div
                    className={styles.menu_item}
                    style={{ marginTop: '2px' }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '2px -1px -2px 1px' }}
                    >
                      <rect
                        x="1"
                        y="1"
                        width="17"
                        height="17"
                        rx="2.83333"
                        fill="black"
                        stroke={gameState === 'games' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="13.0888"
                        cy="6.28904"
                        r="1.88889"
                        fill={gameState === 'games' ? 'white' : '#808080'}
                      />
                      <circle
                        cx="6.28904"
                        cy="13.0888"
                        r="1.88889"
                        fill={gameState === 'games' ? 'white' : '#808080'}
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/scenes">
                  <div className={styles.menu_item}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10.5"
                        cy="5.5"
                        r="4.5"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="1"
                        y="8"
                        width="19"
                        height="13"
                        rx="1.57678"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="6.86035"
                        y="12.6313"
                        width="7.27977"
                        height="9.54253"
                        rx="1.57678"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="3.1"
                        y="5.6"
                        width="14.8"
                        height="3.8"
                        rx="1.9"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/nfts">
                  <div className={styles.menu_item}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="20"
                        height="20"
                        rx="2.83333"
                        stroke={gameState === 'nfts' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.1678 7.66675V14.3334H7.67634L5.58141 10.8763L5.34863 10.4096V14.3334H3.85718V7.66675H5.34863L7.43495 11.162L7.67634 11.6382V7.66675H9.1678Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                      <path
                        d="M13.362 7.66675V9.20008H11.2929V10.2382H13.043V11.7715H11.2929V14.3334H9.80148V7.66675H13.362Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                      <path
                        d="M19.0953 7.66675V9.20008H17.2676V14.3334H15.7761V9.20008H13.9485V7.66675H19.0953Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/ice">
                  <div className={styles.menu_item}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="20"
                        height="20"
                        rx="2.83333"
                        stroke={gameState === 'ice' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.1678 7.66675V14.3334H7.67634L5.58141 10.8763L5.34863 10.4096V14.3334H3.85718V7.66675H5.34863L7.43495 11.162L7.67634 11.6382V7.66675H9.1678Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                      <path
                        d="M13.362 7.66675V9.20008H11.2929V10.2382H13.043V11.7715H11.2929V14.3334H9.80148V7.66675H13.362Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                      <path
                        d="M19.0953 7.66675V9.20008H17.2676V14.3334H15.7761V9.20008H13.9485V7.66675H19.0953Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/shop">
                  <div className={styles.menu_item}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '0px -1px 0px 1px' }}
                    >
                      <path
                        d="M4 1L1 5V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5L16 1H4Z"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 5H19"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13C8.93913 13 7.92172 12.5786 7.17157 11.8284C6.42143 11.0783 6 10.0609 6 9"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/leaderboard">
                  <div className={styles.menu_item}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-2px 0px 2px 0px' }}
                    >
                      <rect
                        x="1"
                        y="8"
                        width="6"
                        height="9"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                      <rect
                        x="7.75"
                        y="1"
                        width="7"
                        height="16"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                      <rect
                        x="15"
                        y="4"
                        width="7"
                        height="13"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.menu_container}>
            {isMobile && (
              <div
                className={styles.burger_icon}
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                <svg
                  width="9"
                  height="15"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                    stroke="white"
                    stroke-width="1"
                    stroke-opacity="0.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className={styles.menu_list}>
              <div className={styles.menu_header}>Navigation</div>

              <div>
                <Link href="/games">
                  <div
                    className={
                      gameState === 'games'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                    id={gameState === 'games' ? styles.active_padding : ''}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '2px -1px -2px 1px' }}
                    >
                      <rect
                        x="1"
                        y="1"
                        width="17"
                        height="17"
                        rx="2.83333"
                        fill="black"
                        stroke={gameState === 'games' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="13.0888"
                        cy="6.28904"
                        r="1.88889"
                        fill={gameState === 'games' ? 'white' : '#808080'}
                      />
                      <circle
                        cx="6.28904"
                        cy="13.0888"
                        r="1.88889"
                        fill={gameState === 'games' ? 'white' : '#808080'}
                      />
                    </svg>
                    <div className={styles.menu_title}>Games</div>
                  </div>
                </Link>

                <Link href="/games/scenes">
                  <div
                    className={
                      gameState === 'casinos'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="10.5"
                        cy="5.5"
                        r="4.5"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="1"
                        y="8"
                        width="19"
                        height="13"
                        rx="1.57678"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="6.86035"
                        y="12.6313"
                        width="7.27977"
                        height="9.54253"
                        rx="1.57678"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <rect
                        x="3.1"
                        y="5.6"
                        width="14.8"
                        height="3.8"
                        rx="1.9"
                        fill="black"
                        stroke={gameState === 'casinos' ? 'white' : '#808080'}
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Scenes</div>
                  </div>
                </Link>

                <Link href="/games/nfts">
                  <div
                    className={
                      gameState === 'nfts'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="20"
                        height="20"
                        rx="2.83333"
                        stroke={gameState === 'nfts' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.1678 7.66675V14.3334H7.67634L5.58141 10.8763L5.34863 10.4096V14.3334H3.85718V7.66675H5.34863L7.43495 11.162L7.67634 11.6382V7.66675H9.1678Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                      <path
                        d="M13.362 7.66675V9.20008H11.2929V10.2382H13.043V11.7715H11.2929V14.3334H9.80148V7.66675H13.362Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                      <path
                        d="M19.0953 7.66675V9.20008H17.2676V14.3334H15.7761V9.20008H13.9485V7.66675H19.0953Z"
                        fill={gameState === 'nfts' ? 'white' : '#808080'}
                      />
                    </svg>
                    <div className={styles.menu_title}>NFTs</div>
                  </div>
                </Link>

                <Link href="/games/ice">
                  <div
                    className={
                      gameState === 'ice'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="1"
                        y="1"
                        width="20"
                        height="20"
                        rx="2.83333"
                        stroke={gameState === 'ice' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.1678 7.66675V14.3334H7.67634L5.58141 10.8763L5.34863 10.4096V14.3334H3.85718V7.66675H5.34863L7.43495 11.162L7.67634 11.6382V7.66675H9.1678Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                      <path
                        d="M13.362 7.66675V9.20008H11.2929V10.2382H13.043V11.7715H11.2929V14.3334H9.80148V7.66675H13.362Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                      <path
                        d="M19.0953 7.66675V9.20008H17.2676V14.3334H15.7761V9.20008H13.9485V7.66675H19.0953Z"
                        fill={gameState === 'ice' ? 'white' : '#808080'}
                      />
                    </svg>
                    <div className={styles.menu_title}>ICE</div>
                  </div>
                </Link>

                <Link href="/games/shop">
                  <div
                    className={
                      gameState === 'shop'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '0px -1px 0px 1px' }}
                    >
                      <path
                        d="M4 1L1 5V19C1 19.5304 1.21071 20.0391 1.58579 20.4142C1.96086 20.7893 2.46957 21 3 21H17C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19V5L16 1H4Z"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M1 5H19"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14 9C14 10.0609 13.5786 11.0783 12.8284 11.8284C12.0783 12.5786 11.0609 13 10 13C8.93913 13 7.92172 12.5786 7.17157 11.8284C6.42143 11.0783 6 10.0609 6 9"
                        stroke={gameState === 'shop' ? 'white' : '#808080'}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Shop</div>
                  </div>
                </Link>

                <Link href="/games/leaderboard">
                  <div
                    className={
                      gameState === 'leaderboard'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-2px 0px 2px 0px' }}
                    >
                      <rect
                        x="1"
                        y="8"
                        width="6"
                        height="9"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                      <rect
                        x="7.75"
                        y="1"
                        width="7"
                        height="16"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                      <rect
                        x="15"
                        y="4"
                        width="7"
                        height="13"
                        rx="1"
                        stroke={
                          gameState === 'leaderboard' ? 'white' : '#808080'
                        }
                        stroke-width="2"
                      />
                    </svg>
                    <div className={styles.menu_title}>Leaderboard</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  const leaderboardLink = link => {
    if (state.userStatus >= 4) {
      if (link) {
        return (
          <Link href="/games/leaderboard">
            <span className={styles.account_hover}>
              <b>Leaderboard</b>
            </span>
          </Link>
        );
      } else {
        return (
          <span className={styles.account_hover_active}>
            <b>Leaderboard</b>
          </span>
        );
      }
    } else {
      return null;
    }
  };

  function coinSelect() {
    return (
      <Aux>
        <div
          style={{
            marginTop: '150px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
          className={styles.coin_select}
        >
          <div className={styles.account_hover_time_tablet}>
            <svg
              width="9"
              height="15"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={coinChangeBackward}
              style={{ transform: 'rotate(180deg)', margin: '2px 8px 0px 8px' }}
            >
              <path
                d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                stroke="white"
                stroke-width="1.7"
                stroke-opacity="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {gameSelect}
            <svg
              width="9"
              height="15"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={coinChangeForward}
              style={{ margin: '2px 8px 0px 8px' }}
            >
              <path
                d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                stroke="white"
                stroke-width="1.7"
                stroke-opacity="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <div
            className={styles.account_hover_time_tablet}
            style={{ marginLeft: '24px' }}
          >
            <svg
              width="9"
              height="15"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={timeChangeBackward}
              style={{ transform: 'rotate(180deg)', margin: '2px 8px 0px 8px' }}
            >
              <path
                d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                stroke="white"
                stroke-width="1.7"
                stroke-opacity="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {timePeriod.toLowerCase()}
            <svg
              width="9"
              height="15"
              viewBox="0 0 6 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={timeChangeForward}
              style={{ margin: '2px 8px 0px 8px' }}
            >
              <path
                d="M1.60352 1.81812L4.60858 5.30395L1.60352 8.78977"
                stroke="white"
                stroke-width="1.7"
                stroke-opacity="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
        </div>
      </Aux>
    );
  }

  return (
    <div>
      <div className="d-flex flex-row">
        {submenu()}

        {gameState === 'leaderboard' ? (
          <span>
            <ContentLeaderboard
              gameRecords={state.gameRecords}
              gameSelect={gameSelect}
              timePeriod={timePeriod}
              coinSelector={coinSelect}
            />
          </span>
        ) : (
          <ContentOfferings
            gameState={gameState}
            detailsGames={detailsGames}
            detailsCasinos={detailsCasinos}
            detailsNFTs={detailsNFTs}
            detailsICE={detailsICE}
            detailsShop={detailsShop}
          />
        )}
      </div>
    </div>
  );
};

export default Offerings;
