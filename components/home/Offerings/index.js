import { useState, useContext } from 'react';
import { GlobalContext } from '../../../store';
import Link from 'next/link';
import { Divider, Icon } from 'semantic-ui-react';
import ContentOfferings from '../../content/ContentOfferings';
import ContentLeaderboard from '../../content/ContentLeaderboard';
import Spinner from '../../Spinner'; 
import Images from '../../../common/Images';
import Aux from '../../_Aux';
import { useMediaQuery } from 'hooks';
import styles from './Offerings.module.scss';


const detailsGames = {
  Poker: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919779/Poker_ekorsi.jpg',
    'games-pic',
    'Poker',
    'Decentral Games poker is in beta and currently only playable using FREE tokens.',
    '2-6 Players',
    'Free',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919297/Blackjack_logt66.jpg',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. ',
    '1-4 Players',
    'Crypto',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919296/Roulette_hptwtf.jpg',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette.',
    '1-8 Players',
    'Crypto',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919947/SLOTS_hegzzk.jpg',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring five spinning reels each with four icons.',
    '1 Player',
    'Coming Soon',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg',
  ],
};

const detailsCasinos = {
  Tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916730/Tominoya_Lapse_om9erf.gif',
    'games-pic',
    'Tominoya',
    'Tominoya is a Japanese-themed scene featuring two floors with three wings each and a conference center upstairs where live video streams are held.',
    'Roulette',
    'Blackjack',
    'Poker',
    'https://play.decentraland.org/?position=-118%2C135&realm=dg',
  ],
  Atari: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1625022643/ATARI_TIMELAPSE_1_brvynj.gif',
    'games-pic',
    'Atari',
    'Atari is situated on a 20-parcel estate. The scene features an open-concept floor plan and building design modelled after the iconic Atari logo.',
    'Roulette',
    'Blackjack',
    'https://play.decentraland.org/?position=-94%2C110&realm=dg',
  ],
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916719/Chateau_Chatoshi_lapse_2_gbjrgn.gif',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is an art deco inspired experience, theatre, nightclub, and stratosphere.',
    'Roulette',
    'Blackjack',
    'https://play.decentraland.org/?position=-75%2C77&realm=dg',
  ],
  Dext: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1627209301/Dext_Timelapse_1_oh5bnz.gif',
    'games-pic',
    'DEXT Poker Lounge',
    'The DEXT Poker Lounge features eight Texas Holdem poker tables located in a skyscraper penthouse, accessible via teleporter on the ground floor.',
    'Poker',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg',
  ],
  BAYC: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1628340721/cloudinary_zjohvr.gif',
    'games-pic',
    'Bored Ape Yacht Club',
    'The Bored Ape Yacht Club is a riverboat themed venue. The scene has Ape-themed croupiers stylized in the likeness of the immensely popular NFT series',
    'Roulette',
    'Blackjack',
    'Poker',
    'https://play.decentraland.org/?position=-110%2C121&realm=dg',
  ],
  Aquarium: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1628340722/Aquarium_timelaps_2_lpqj2r.gif',
    'games-pic',
    'The Aquarium',
    'The Aquarium is an underwater-themed venue featuring neon lights, aquatic artwork, and virtual fish navigating the scene floor.',
    'Roulette',
    'Blackjack',
    'https://play.decentraland.org/?position=-118%2C129&realm=dg',
  ],
};

const detailsShop = {
  shop_dcl: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741773/nftshop_yojy7q.png',
    'games-pic',
    'NFT Shop',
    'Our NFT shop is located right next door to Chateau Satoshi. The scene is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'Wearables',
    'https://play.decentraland.org/?position=-75%2C79&realm=dg',
    'https://opensea.io/blog/guides/non-fungible-tokens/',
  ],
  shop_opensea: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1613266160/OpenSea_y26zkp.png',
    'games-pic',
    'OpenSea',
    'Decentral Games wearables are also available on OpenSea. Here, users can smoothly buy and sell our wearables, get custom stats and analytics, and earn revenue by trading goods.',
    'Wearables',
    'https://opensea.io/accounts/DecentralGames',
    'https://opensea.io/blog/guides/non-fungible-tokens/',
  ],
};

const detailsNFTs = {
  mink_coat: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed_y8ozak.png',
    'nft-pic',
    'DG Fur Mink',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/247',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
    'nft-pic',
    'DG Tracksuit Jacket',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/248',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-2_eiirjc.png',
    'nft-pic',
    'DG Tracksuit Pants',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/246',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-3_ey4xpe.png',
    'nft-pic',
    'DG Flip Up Spectacles',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/243',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-4_ccrxbx.png',
    'nft-pic',
    'DG Deezys',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/244',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed-5_pdvxqy.png',
    'nft-pic',
    'DG Slides',
    'outfit name',
    'Legendary',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/245',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  headphones: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1626511651/unnamed_apacqs.png',
    'nft-pic',
    'DG Headphones',
    'outfit name',
    'Rare',
    'https://opensea.io/assets/dg-accessories',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
};

const detailsICE = {
  Shoes: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
    'Dress Shoes',
    'outfit name',
    'Feet',
    '1 of 100',
  ],
  Top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
    'Suit Top',
    'outfit name',
    'Torso',
    '1 of 100',
  ],
  Pants: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
    'Suit Pants',
    'outfit name',
    'Legs',
    '1 of 100',
  ],
  Glasses: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
    'Money Shades',
    'outfit name',
    'Accessory',
    '1 of 100',
  ],
  Cigar: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
    'Cigar',
    'outfit name',
    'Head',
    '1 of 100',
  ],
};




const Offerings = (props) => {
  // get leaderboard data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [imageSelect, setImageSelect] = useState('');
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
      gameSelect = 'eth'
    } else if (value === 'usdt') {
      gameSelect = 'usdt'
    } else {
      gameSelect = 'atri'
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
                  <div className={styles.menu_item} style={{ marginTop: '2px' }}>
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
                  <div className={styles.menu_item}
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
                    <svg width="24" height="24" viewBox="0 0 22 20" style={{ margin: '0px 1px 0px -1px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M17.9167 0.666667H5.08333C4.9375 0.666667 4.79167 0.739584 4.71875 0.885417L1.07292 6.24479C0.963542 6.39063 0.963542 6.60938 1.07292 6.75521L11.1354 19.1875C11.3177 19.4062 11.6458 19.4062 11.8281 19.1875L21.8906 6.75521C22 6.60938 22 6.39063 21.9271 6.24479L18.2812 0.885417C18.1719 0.739584 18.0625 0.666667 17.9167 0.666667ZM17.1875 2.41667L19.5208 5.91667H17.0052L15.1094 2.41667H17.1875ZM9.82292 2.41667H13.1406L15.0365 5.91667H7.96354L9.82292 2.41667ZM5.77604 2.41667H7.85417L5.95833 5.91667H3.47917L5.77604 2.41667ZM4.20833 7.66667H6.06771L8.58333 13.5L4.20833 7.66667ZM7.96354 7.66667H15L11.5 16.5625L7.96354 7.66667ZM14.4167 13.5L16.8958 7.66667H18.7552L14.4167 13.5Z" 
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
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
                        stroke-width="2"
                      />
                      <rect 
                        x="7.75" 
                        y="1" 
                        width="7" 
                        height="16" 
                        rx="1"
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
                        stroke-width="2"
                      />
                      <rect 
                        x="15" 
                        y="4" 
                        width="7" 
                        height="13" 
                        rx="1" 
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
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
              <div className={styles.menu_header}>Offerings</div>

              <div>
                <Link href="/games">
                  <div
                    className={
                      gameState === 'games'
                        ? styles.menu_item_active
                        : styles.menu_item
                    }
                    id={
                      gameState === 'games'
                        ? styles.active_padding
                        : ''
                    }
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
                    <svg width="24" height="24" viewBox="0 0 22 20" style={{ margin: '0px 1px 0px -1px' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M17.9167 0.666667H5.08333C4.9375 0.666667 4.79167 0.739584 4.71875 0.885417L1.07292 6.24479C0.963542 6.39063 0.963542 6.60938 1.07292 6.75521L11.1354 19.1875C11.3177 19.4062 11.6458 19.4062 11.8281 19.1875L21.8906 6.75521C22 6.60938 22 6.39063 21.9271 6.24479L18.2812 0.885417C18.1719 0.739584 18.0625 0.666667 17.9167 0.666667ZM17.1875 2.41667L19.5208 5.91667H17.0052L15.1094 2.41667H17.1875ZM9.82292 2.41667H13.1406L15.0365 5.91667H7.96354L9.82292 2.41667ZM5.77604 2.41667H7.85417L5.95833 5.91667H3.47917L5.77604 2.41667ZM4.20833 7.66667H6.06771L8.58333 13.5L4.20833 7.66667ZM7.96354 7.66667H15L11.5 16.5625L7.96354 7.66667ZM14.4167 13.5L16.8958 7.66667H18.7552L14.4167 13.5Z" 
                        fill={gameState === 'ice' ? 'white' : '#808080'} 
                      />
                    </svg>
                    <div className={styles.menu_title}>ICE Wearables</div>
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
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
                        stroke-width="2"
                      />
                      <rect 
                        x="7.75" 
                        y="1" 
                        width="7" 
                        height="16" 
                        rx="1"
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
                        stroke-width="2"
                      />
                      <rect 
                        x="15" 
                        y="4" 
                        width="7" 
                        height="13" 
                        rx="1" 
                        stroke={gameState === 'leaderboard' ? 'white' : '#808080'}
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

  function leaderboardLink(link) {
    if (state.userStatus >= 4) {
      if (link) {
        return (
          <Link href="/games/leaderboard">
            <span className="account-hover">
              <b>Leaderboard</b>
            </span>
          </Link>
        );
      } else {
        return (
          <span className="account-hover active">
            <b>Leaderboard</b>
          </span>
        );
      }
    } else {
      return null;
    }
  }

  function coinSelect() {
    return (
      <Aux>
        <div style={{ marginTop: '120px', display: 'flex', justifyContent: 'flex-end' }}>

          <div className="account-hover-time-tablet">
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

          <div className="account-hover-time-tablet" style={{ marginLeft: '24px' }}>
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
