import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Divider, Icon } from 'semantic-ui-react';
import ContentOfferings from '../content/ContentOfferings';
import ContentLeaderboard from '../content/ContentLeaderboard';
// import Spinner from '../Spinner'; // ********** should we add the spinner to this page??? **********
import Images from '../../common/Images';
import Aux from '../_Aux';

const detailsGames = {
  Poker: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624919779/Poker_ekorsi.jpg',
    'games-pic',
    'Poker',
    'Decentral Games poker is in beta and currently only playable using FREE tokens. Visit our discord via the "Read More" button for info on pop up tournaments and updates.',
    '2-6 PLAYERS • ',
    'FREE',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
    'https://decentral.games/discord',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624919297/Blackjack_logt66.jpg',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
    'https://docs.decentral.games/games/blackjack',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624919296/Roulette_hptwtf.jpg',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows.',
    '1-8 PLAYERS • ',
    'FREE • CRYPTO',
    'https://play.decentraland.org/?position=-119%2C136&realm=dg-diamond',
    'https://docs.decentral.games/games/roulette',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624919947/SLOTS_hegzzk.jpg',
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
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624916730/Tominoya_Lapse_om9erf.gif',
    'games-pic',
    'Tominoya',
    'Tominoya is Japanese-themed casino located in the Vegas City district of Decentraland. The scene features two floors with three wings each, and a conference center upstairs.',
    'DECENTRAL GAMES',
    'https://play.decentraland.org/?position=-119%2C133&realm=dg-diamond',
    'https://docs.decentral.games/operators/tominoya',
  ],
  Atari: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1625022643/ATARI_TIMELAPSE_1_brvynj.gif',
    'games-pic',
    'Atari Casino',
    'The Atari Casino is located within the Vegas City district in Decentraland. The scene features an open-concept floor plan and building design modelled after the iconic Atari logo.',
    'PARTNER CASINO',
    'https://play.decentraland.org/?position=-94%2C110&realm=dg-diamond',
    'https://docs.decentral.games/operators/atari',
  ],
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1624916719/Chateau_Chatoshi_lapse_2_gbjrgn.gif',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is located within the Vegas City district in Decentraland. The scene features an art deco inspired casino, theatre, nightclub, and stratosphere.',
    'DECENTRAL GAMES',
    'https://play.decentraland.org/?position=-75%2C77&realm=dg-diamond',
    'https://docs.decentral.games/operators/chateau-satoshi',
  ],
  BAYC: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1628340721/cloudinary_zjohvr.gif',
    'games-pic',
    'BAYC Riverboat',
    'The Bored Ape Yacht club Riverboat Casino was created in partnership with BAYC. Located in Vegas City, the scene is modelled after an old-timey riverboat and features FREE play only games.',
    'PARTNER CASINO',
    'https://play.decentraland.org/?position=-110%2C121&realm=dg-diamond',
    'https://docs.decentral.games/operators/',
  ],
  Dext: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1627209301/Dext_Timelapse_1_oh5bnz.gif',
    'games-pic',
    'DEXT Poker Lounge',
    'The DEXT Poker Lounge is located within the Vegas City district in Decentraland. Eight Texas Holdem poker tables are located in the penthouse of the DEXT skyscraper.',
    'PARTNER CASINO',
    'https://play.decentraland.org/?position=-110%2C129&realm=dg-diamond',
    'https://docs.decentral.games/operators/dext',
  ],
  Aquarium: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1628340722/Aquarium_timelaps_2_lpqj2r.gif',
    'games-pic',
    'Aquarium Casino',
    'The Aquarium Casino is located within the Vegas City disctrict in Decentraland and features large glass-enclosed displays of sea creatures swimming throughout the build. ',
    'PARNTER CASINO',
    'https://play.decentraland.org/?position=-139%2C126&realm=dg-diamond',
    'https://docs.decentral.games/operators/',
  ],
};

const detailsShop = {
  shop_dcl: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1605741773/nftshop_yojy7q.png',
    'games-pic',
    'NFT Shop',
    'Our NFT shop is located Vegas City district in Decentraland right next door to Chateau Satoshi. The scene features a building inspired by modern architecture which houses all of Decentral Games NFTs. The scene is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'WEARABLES',
    'https://play.decentraland.org/?position=-75%2C79&realm=dg-diamond',
    'https://opensea.io/blog/guides/non-fungible-tokens/',
  ],
  shop_opensea: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1613266160/OpenSea_y26zkp.png',
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
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566940/unnamed_y8ozak.png',
    'nft-pic',
    'DG Fur Mink',
    'LEGENDARY',
    'An opulent fur coat made from minks #extrasaus',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/247',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566941/unnamed-1_anqn8z.png',
    'nft-pic',
    'DG Tracksuit Jacket',
    'LEGENDARY',
    'The jacket of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/248',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566939/unnamed-2_eiirjc.png',
    'nft-pic',
    'DG Tracksuit Pants',
    'LEGENDARY',
    'The pants of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/246',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566939/unnamed-3_ey4xpe.png',
    'nft-pic',
    'DG Flip Up Spectacles',
    'LEGENDARY',
    'Swaggy flip up shades designed to be wearable at any occassion. #ice',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/243',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566939/unnamed-4_ccrxbx.png',
    'nft-pic',
    'DG Deezys',
    'LEGENDARY',
    'Comfy and elegant sneekers #deezys',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/244',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1619566940/unnamed-5_pdvxqy.png',
    'nft-pic',
    'DG Slides',
    'LEGENDARY',
    'Lazy day designer slides complete with socks to keep your toes warm #cozyslides',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/245',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  headphones: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1628718435/Screen_Shot_2021-08-11_at_10.46.57_PM_wnwyvi.png',
    'nft-pic',
    'DG Headphones',
    'LEGENDARY',
    'Hitting the tables? Tune out the noise, get in the zone.',
    'https://market.decentraland.org/contracts/0xf16ff41128b298304b761b49c1c56580972ada32/items/0',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
};

const Offerings = (props) => {
  // get leaderboard data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [timePeriod, setTimePeriod] = useState('ALL TIME');

  const gameState = props.gameState;

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

  // tab select and coin select area
  function submenu() {
    return (
      <div>
        <div className="account-other-tabs" style={{ padding: '240px 0px 60px 0px' }}>
          {/* ////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////  tab select area   //////////////////////////////// */}

          {gameState === 'games' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <span className="account-hover active">
                <b>Games</b>
              </span>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>Casinos</b>
                </span>
              </Link>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTs</b>
                </span>
              </Link>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>Shop</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState === 'casinos' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>Games</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>Casinos</b>
              </span>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTs</b>
                </span>
              </Link>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>Shop</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState == 'nfts' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>Games</b>
                </span>
              </Link>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>Casinos</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>NFTs</b>
              </span>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>Shop</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState == 'shop' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>Games</b>
                </span>
              </Link>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>Casinos</b>
                </span>
              </Link>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTs</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>Shop</b>
              </span>

              {leaderboardLink(true)}
            </p>
          ) : (
            <div>
              <p className="account-other-p" style={{ width: '100%' }}>
                <Link href="/games">
                  <span className="account-hover">
                    <b>Games</b>
                  </span>
                </Link>
                <Link href="/games/casinos">
                  <span className="account-hover">
                    <b>Casinos</b>
                  </span>
                </Link>
                <Link href="/games/nfts">
                  <span className="account-hover">
                    <b>NFTs</b>
                  </span>
                </Link>
                <Link href="/games/shop">
                  <span className="account-hover">
                    <b>Shop</b>
                  </span>
                </Link>

                {leaderboardLink(false)}
              </p>

              {coinSelect()}
            </div>
          )}
        </div>
      </div>
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
        <span style={{ display: 'flex', width: '100%', minWidth: '861px' }}>
          <span
            style={{
              display: 'flex',
              marginBottom: '9px',
            }}
            className="leaderboard-coin-select-mobile"
          >
            <span
              className={
                gameSelect === 'play' ? 'account-hover-time active' : 'account-hover-time'
              }
              id="account-select-play"
              onClick={() => handleChange('play')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.PLAY_CIRCLE}
              />
              FREE
            </span>
            <span
              className={
                gameSelect === 'eth' ? 'account-hover-time active' : 'account-hover-time'
              }
              style={{ fontFamily: 'Larsseit-Bold' }}
              onClick={() => handleChange('eth')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.ETH_CIRCLE}
              />
              ETH
            </span>
            <span
              className={
                gameSelect === 'mana' ? 'account-hover-time active' : 'account-hover-time'
              }
              onClick={() => handleChange('mana')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.MANA_CIRCLE}
              />
              MANA
            </span>
            <span
              className={
                gameSelect === 'usdt' ? 'account-hover-time active' : 'account-hover-time'
              }
              style={{ fontFamily: 'Larsseit-Bold' }}
              onClick={() => handleChange('usdt')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.USDT_CIRCLE}
              />
              USDT
            </span>
            <span
              className={
                gameSelect === 'dai' ? 'account-hover-time active' : 'account-hover-time'
              }
              style={{ fontFamily: 'Larsseit-Bold' }}
              onClick={() => handleChange('dai')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.DAI_CIRCLE}
              />
              DAI
            </span>
            <span
              className={
                gameSelect === 'atri' ? 'account-hover-time active' : 'account-hover-time'
              }
              style={{ fontFamily: 'Larsseit-Bold' }}
              onClick={() => handleChange('atri')}
            >
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-3px',
                }}
                className="image inline"
                width="21px"
                height="21px"
                src={Images.ATRI_CIRCLE}
              />
              ATRI
            </span>
          </span>

          <span className="account-hover-time-tablet">
            <Icon
              className="time-select-icon"
              name="angle left"
              onClick={timeChangeBackward}
            />
            {timePeriod}
            <Icon
              className="time-select-icon"
              name="angle right"
              style={{ marginLeft: '4px' }}
              onClick={timeChangeForward}
            />
          </span>
        </span>
      </Aux>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container">
          {submenu()}

          {gameState === 'leaderboard' ? (
            <ContentLeaderboard
              gameRecords={state.gameRecords}
              gameSelect={gameSelect}
              timePeriod={timePeriod}
            />
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
    </div>
  );
};

export default Offerings;
