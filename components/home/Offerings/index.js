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
    'Decentral Games poker is in beta and currently only playable using FREE tokens. Visit our discord via the "Read More" button for info on pop up tournaments and updates.',
    '2-6 PLAYERS • ',
    'FREE',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
    'https://decentral.games/discord',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919297/Blackjack_logt66.jpg',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
    'https://docs.decentral.games/games/blackjack',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919296/Roulette_hptwtf.jpg',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows.',
    '1-8 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
    'https://docs.decentral.games/games/roulette',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624919947/SLOTS_hegzzk.jpg',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring five spinning reels each with four icons. There are two clickable buttons facing the player to set the bet amount and spin.',
    '1 PLAYER • ',
    'COMING SOON',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
    'https://docs.decentral.games/games/slots',
  ],
};

const detailsCasinos = {
  Tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916730/Tominoya_Lapse_om9erf.gif',
    'games-pic',
    'Tominoya',
    'Tominoya is Japanese-themed casino located in the Vegas City district of Decentraland. The scene features two floors with three wings each, and a conference center upstairs where live video streams are held.',
    'ROULETTE • BLACKJACK • POKER',
    'https://play.decentraland.org/?position=-119%2C133&realm=dg-diamond',
    'https://docs.decentral.games/operators/tominoya',
  ],
  Atari: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1625022643/ATARI_TIMELAPSE_1_brvynj.gif',
    'games-pic',
    'Atari Casino',
    'The Atari Casino is located within the Vegas City district in Decentraland. Situated on a 20-parcel estate, the scene features an open-concept floor plan and building design modelled after the iconic Atari logo.',
    'ROULETTE • BLACKJACK',
    'https://play.decentraland.org/?position=-94%2C110&realm=dg-diamond',
    'https://docs.decentral.games/operators/atari',
  ],
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1624916719/Chateau_Chatoshi_lapse_2_gbjrgn.gif',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is located within the Vegas City district in Decentraland. The scene features an art deco inspired casino, theatre, nightclub, and stratosphere. The casino is accessible from the most northwestern Decentraland Genesis Plaza.',
    'ROULETTE • BLACKJACK',
    'https://play.decentraland.org/?position=-75%2C77&realm=dg-diamond',
    'https://docs.decentral.games/operators/chateau-satoshi',
  ],
  Dext: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1627209301/Dext_Timelapse_1_oh5bnz.gif',
    'games-pic',
    'DEXT Poker Lounge',
    'The DEXT Poker Lounge is located within the Vegas City district in Decentraland. Eight Texas Holdem poker tables are located in the penthouse, accessible by entering a teleporter on the ground floor of the DEXT skyscraper.',
    'POKER',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
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
    'https://play.decentraland.org/?position=-75%2C79&realm=dg-diamond',
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
    'nft-pic',
    'DG Fur Mink',
    'LEGENDARY',
    'An opulent fur coat made from minks #extrasaus',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/247',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566941/unnamed-1_anqn8z.png',
    'nft-pic',
    'DG Tracksuit Jacket',
    'LEGENDARY',
    'The jacket of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/248',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-2_eiirjc.png',
    'nft-pic',
    'DG Tracksuit Pants',
    'LEGENDARY',
    'The pants of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/246',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-3_ey4xpe.png',
    'nft-pic',
    'DG Flip Up Spectacles',
    'LEGENDARY',
    'Swaggy flip up shades designed to be wearable at any occassion. #ice',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/243',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566939/unnamed-4_ccrxbx.png',
    'nft-pic',
    'DG Deezys',
    'LEGENDARY',
    'Comfy and elegant sneekers #deezys',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/244',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed-5_pdvxqy.png',
    'nft-pic',
    'DG Slides',
    'LEGENDARY',
    'Lazy day designer slides complete with socks to keep your toes warm #cozyslides',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/245',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  headphones: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1619566940/unnamed-5_pdvxqy.png',
    'nft-pic',
    'DG Headphones',
    'LEGENDARY',
    '',
    'https://opensea.io/assets/matic/0xf16ff41128b298304b761b49c1c56580972ada32/13',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  headphones: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1626511651/unnamed_apacqs.png',
    'nft-pic',
    'DG Headphones',
    'LEGENDARY',
    '',
    'https://opensea.io/assets/dg-accessories',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
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
    if (j < 5) {
      j = 5;
      setGameSelect(coins[j]);
    } else {
      setGameSelect(coins[j - 1]);
    }
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
                  stroke-width="1.7"
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
                    >
                      <path
                        d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="19.9954"
                        cy="4.20027"
                        r="1.9222"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.9243 3.12012H7.65655C4.64511 3.12012 2.77783 5.25284 2.77783 8.26428V16.3467C2.77783 19.3581 4.6085 21.4817 7.65655 21.4817H16.2607C19.2721 21.4817 21.1394 19.3581 21.1394 16.3467V9.30776"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </Link>

                <Link href="/games/casinos">
                  <div className={styles.menu_item}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21.2099 15.8901C20.5737 17.3946 19.5787 18.7203 18.3118 19.7514C17.0449 20.7825 15.5447 21.4875 13.9424 21.8049C12.34 22.1222 10.6843 22.0422 9.12006 21.5719C7.55578 21.1015 6.13054 20.2551 4.96893 19.1067C3.80733 17.9583 2.94473 16.5428 2.45655 14.984C1.96837 13.4252 1.86948 11.7706 2.16851 10.1647C2.46755 8.55886 3.15541 7.05071 4.17196 5.77211C5.18851 4.49351 6.5028 3.4834 7.99992 2.83008"
                        stroke="white"
                        stroke-opacity={gameState === 'casinos' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
                        stroke="white"
                        stroke-opacity={gameState === 'casinos' ? 1 : 0.5}
                        stroke-width="2"
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
                      <path
                        d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                        stroke="white"
                        stroke-opacity={gameState === 'governance' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                        stroke-opacity={gameState === 'governance' ? 1 : 0.5}
                        stroke="white"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="9"
                        y1="16"
                        x2="15"
                        y2="16"
                        stroke="white"
                        stroke-opacity={gameState === 'governance' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="9"
                        y1="12"
                        x2="15"
                        y2="12"
                        stroke="white"
                        stroke-opacity={gameState === 'governance' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                    >
                      <path
                        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                        stroke="white"
                        stroke-opacity={gameState === 'mining' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.21 13.8899L7 22.9999L12 19.9999L17 22.9999L15.79 13.8799"
                        stroke="white"
                        stroke-opacity={gameState === 'mining' ? 1 : 0.5}
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
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 1V23"
                        stroke="white"
                        stroke-opacity={gameState === 'uniswap' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                        stroke="white"
                        stroke-opacity={gameState === 'uniswap' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                    >
                      <path
                        d="M7.24463 14.7815L10.2378 10.8914L13.652 13.5733L16.581 9.79297"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <circle
                        cx="19.9954"
                        cy="4.20027"
                        r="1.9222"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M14.9243 3.12012H7.65655C4.64511 3.12012 2.77783 5.25284 2.77783 8.26428V16.3467C2.77783 19.3581 4.6085 21.4817 7.65655 21.4817H16.2607C19.2721 21.4817 21.1394 19.3581 21.1394 16.3467V9.30776"
                        stroke="white"
                        stroke-opacity={gameState === 'games' ? 1 : 0.5}
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Games</div>
                  </div>
                </Link>

                <Link href="/games/casinos">
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
                      <path
                        d="M21.2099 15.8901C20.5737 17.3946 19.5787 18.7203 18.3118 19.7514C17.0449 20.7825 15.5447 21.4875 13.9424 21.8049C12.34 22.1222 10.6843 22.0422 9.12006 21.5719C7.55578 21.1015 6.13054 20.2551 4.96893 19.1067C3.80733 17.9583 2.94473 16.5428 2.45655 14.984C1.96837 13.4252 1.86948 11.7706 2.16851 10.1647C2.46755 8.55886 3.15541 7.05071 4.17196 5.77211C5.18851 4.49351 6.5028 3.4834 7.99992 2.83008"
                        stroke="white"
                        stroke-opacity={gameState === 'casinos' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M22 12C22 10.6868 21.7413 9.38642 21.2388 8.17317C20.7362 6.95991 19.9997 5.85752 19.0711 4.92893C18.1425 4.00035 17.0401 3.26375 15.8268 2.7612C14.6136 2.25866 13.3132 2 12 2V12H22Z"
                        stroke="white"
                        stroke-opacity={gameState === 'casinos' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>Casinos</div>
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
                      <path
                        d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                        stroke="white"
                        stroke-opacity={gameState === 'nfts' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                        stroke="white"
                        stroke-opacity={gameState === 'nfts' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="9"
                        y1="16"
                        x2="15"
                        y2="16"
                        stroke="white"
                        stroke-opacity={gameState === 'nfts' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="9"
                        y1="12"
                        x2="15"
                        y2="12"
                        stroke="white"
                        stroke-opacity={gameState === 'nfts' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className={styles.menu_title}>NFTs</div>
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
                    >
                      <path
                        d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
                        stroke="white"
                        stroke-opacity={gameState === 'shop' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.21 13.8899L7 22.9999L12 19.9999L17 22.9999L15.79 13.8799"
                        stroke="white"
                        stroke-opacity={gameState === 'shop' ? 1 : 0.5}
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
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 1V23"
                        stroke="white"
                        stroke-opacity={gameState === 'leaderboard' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M17 5H9.5C8.57174 5 7.6815 5.36875 7.02513 6.02513C6.36875 6.6815 6 7.57174 6 8.5C6 9.42826 6.36875 10.3185 7.02513 10.9749C7.6815 11.6313 8.57174 12 9.5 12H14.5C15.4283 12 16.3185 12.3687 16.9749 13.0251C17.6313 13.6815 18 14.5717 18 15.5C18 16.4283 17.6313 17.3185 16.9749 17.9749C16.3185 18.6313 15.4283 19 14.5 19H6"
                        stroke="white"
                        stroke-opacity={gameState === 'leaderboard' ? 1 : 0.5}
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
            {timePeriod}
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
            {coinSelect()}
            <ContentLeaderboard
              gameRecords={state.gameRecords}
              gameSelect={gameSelect}
              timePeriod={timePeriod}
            />
          </span>
        ) : (
          <ContentOfferings
            gameState={gameState}
            detailsGames={detailsGames}
            detailsCasinos={detailsCasinos}
            detailsNFTs={detailsNFTs}
            detailsShop={detailsShop}
          />
        )}
      </div>
    </div>
  );
};

export default Offerings;
