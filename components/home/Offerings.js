import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Menu, Button, Divider, Dropdown, Icon } from 'semantic-ui-react';
import ContentOfferings from '../content/ContentOfferings';
import ContentLeaderboard from '../content/ContentLeaderboard';
import Spinner from '../Spinner';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import Aux from '../_Aux';

const detailsGames = {
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/blackjack_jcrtzp.png',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=-119%2C133&realm=fenrir-amber',
    'https://docs.decentral.games/games/blackjack',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/roulette_whagvm.png',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows.',
    '1-8 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=-119%2C133&realm=fenrir-amber',
    'https://docs.decentral.games/games/roulette',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/slots_ip2tqw.png',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring three spinning reels each with four icons. There are three separate clickable buttons facing the player that indicate different wager amounts.',
    '1 PLAYER',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=-119%2C133&realm=fenrir-amber',
    'https://docs.decentral.games/games/slots',
  ],
  Backgammon: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/backgammon_zttuej.png',
    'games-pic',
    'Backgammon',
    'Decentral Games backgammon is standard backgammon game. At the start of each game, the player agree upon and place a wager to be paid out to the winner minus a fee at the end of each game.',
    '2 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=85%2C-20&realm=fenrir-amber',
    'https://docs.decentral.games/games/backgammon',
  ],
};

const detailsCasinos = {
  Tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1608509838/2020-11-22_10-21-32_y3t9zp.png',
    'games-pic',
    'Tominoya',
    'Tominoya is decentral.games most recent and Japanese-themed casino located in the Vegas City district of Decentraland. The scene features two floors with three wings each, and a conference center upstairs where live video streams are held.',
    'ROULETTE, BLACKJACK, SLOTS',
    'https://play.decentraland.org/?position=-119%2C133&realm=fenrir-amber',
    'https://docs.decentral.games/casinos/tominoya',
  ],
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1608510345/Screen_Shot_2020-12-20_at_4.16.40_PM_zjxuia_nuotdx.png',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is located within the Vegas City district in Decentraland. The scene features an art deco inspired casino, theatre, nightclub, and stratosphere. The casino is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'ROULETTE, BLACKJACK',
    'https://play.decentraland.org/?position=-75%2C77&realm=fenrir-amber',
    'https://docs.decentral.games/casinos/chateau-satoshi',
  ],
};

const detailsShop = {
  shop_dcl: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741773/nftshop_yojy7q.png',
    'games-pic',
    'NFT Shop',
    'Our NFT shop is located Vegas City district in Decentraland right next door to Chateau Satoshi. The scene features a building inspired by modern architecture which houses all of Decentral Games NFTs. The scene is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'WEARABLES',
    'https://play.decentraland.org/?position=-75%2C79&realm=fenrir-amber',
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
};

const Offerings = (props) => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [timePeriod, setTimePeriod] = useState('ALL TIME');
  const [gameState, setGameState] = useState(props.gameState);
  const [gameRecordsRefresh, setGameRecordsRefresh] = useState(false);

  function handleChange(value) {
    var gameSelect = '';
    if (value === 'play') {
      gameSelect = 'play';
    } else if (value === 'mana') {
      gameSelect = 'mana';
    } else {
      gameSelect = 'dai';
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

  function Leaderboard() {
    if (gameRecordsRefresh) {
      return <Spinner background={1} />;
    } else {
      return (
        <ContentLeaderboard
          gameRecords={state.gameRecords}
          gameSelect={gameSelect}
          timePeriod={timePeriod}
        />
      );
    }
  }

  // async function refreshLeaderboard() {
  //   console.log('Re-fetching game records');
  //   setGameRecordsRefresh(true);

  //   const response = await Fetch.GAME_RECORDS(state.userAddress);
  //   const jsonRecords = await response.json();

  //   setGameRecordsRefresh(false);

  //   dispatch({
  //     type: 'update_records',
  //     data: jsonRecords,
  //   });
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // tab select and coin select area
  function submenu() {
    return (
      <div>
        <div className="account-other-tabs" style={{ paddingBottom: '9px' }}>
          {/* ////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////////////////////////////////////////////////////////
              ////////////////////////////  tab select area   //////////////////////////////// */}

          {gameState === 'games' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <span className="account-hover active">
                <b>GAMES</b>
              </span>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>CASINOS</b>
                </span>
              </Link>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTS</b>
                </span>
              </Link>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>SHOP</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState === 'casinos' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>GAMES</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>CASINOS</b>
              </span>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTS</b>
                </span>
              </Link>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>SHOP</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState == 'nfts' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>GAMES</b>
                </span>
              </Link>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>CASINOS</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>NFTS</b>
              </span>
              <Link href="/games/shop">
                <span className="account-hover">
                  <b>SHOP</b>
                </span>
              </Link>

              {leaderboardLink(true)}
            </p>
          ) : gameState == 'shop' ? (
            <p className="account-other-p" style={{ width: '100%' }}>
              <Link href="/games">
                <span className="account-hover">
                  <b>GAMES</b>
                </span>
              </Link>
              <Link href="/games/casinos">
                <span className="account-hover">
                  <b>CASINOS</b>
                </span>
              </Link>
              <Link href="/games/nfts">
                <span className="account-hover">
                  <b>NFTS</b>
                </span>
              </Link>
              <span className="account-hover active">
                <b>SHOP</b>
              </span>

              {leaderboardLink(true)}
            </p>
          ) : (
            <div style={{ width: '100%' }}>
              <span style={{ display: 'flex', width: '100%' }}>
                <p className="account-other-p">
                  <Link href="/games">
                    <span className="account-hover">
                      <b>GAMES</b>
                    </span>
                  </Link>
                  <Link href="/games/casinos">
                    <span className="account-hover">
                      <b>CASINOS</b>
                    </span>
                  </Link>
                  <Link href="/games/nfts">
                    <span className="account-hover">
                      <b>NFTS</b>
                    </span>
                  </Link>
                  <Link href="/games/shop">
                    <span className="account-hover">
                      <b>SHOP</b>
                    </span>
                  </Link>

                  {leaderboardLink(false)}
                </p>
              </span>

              {coinSelect()}
            </div>
          )}
        </div>

        <Divider className="tab-divider" style={{ paddingTop: '21px' }} />
      </div>
    );
  }

  function leaderboardLink(link) {
    if (state.userStatus >= 4) {
      if (link) {
        return (
          <Link href="/games/leaderboard">
            <span className="account-hover">
              <b>LEADERBOARD</b>
            </span>
          </Link>
        );
      } else {
        return (
          <span className="account-hover active">
            <b>LEADERBOARD</b>
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
        {/* ////////////////////////////////////////////////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////
      ///////////////////////////  desktop coin select  ////////////////////////////// */}

        <span
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: '-15px',
          }}
          className="leaderboard-coin-select"
        >
          <span
            className={
              gameSelect === 'play' ? 'account-hover active' : 'account-hover'
            }
            onClick={() => handleChange('play')}
          >
            <img
              style={{
                verticalAlign: 'middle',
                marginRight: '6px',
                marginTop: '-3px',
                borderRadius: '100%',
              }}
              className="image inline"
              width="21px"
              height="21px"
              src={Images.PLAY_CIRCLE}
            />
            PLAY
          </span>

          <span
            className={
              gameSelect === 'mana' ? 'account-hover active' : 'account-hover'
            }
            onClick={() => handleChange('mana')}
          >
            <img
              style={{
                verticalAlign: 'middle',
                marginRight: '6px',
                marginTop: '-3px',
                borderRadius: '100%',
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
              gameSelect === 'dai' ? 'account-hover active' : 'account-hover'
            }
            onClick={() => handleChange('dai')}
          >
            <img
              style={{
                verticalAlign: 'middle',
                marginRight: '6px',
                marginTop: '-3px',
                borderRadius: '100%',
              }}
              className="image inline"
              width="21px"
              height="21px"
              src={Images.DAI_CIRCLE}
            />
            DAI
          </span>
          <span className="account-hover-time" style={{ marginRight: '-6px' }}>
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

        <Divider className="coin-select-divider" />

        {/* ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////////////// mobile coin select //////////////////////////////// */}

        <span style={{ display: 'flex', width: '100%' }}>
          <span
            style={{
              display: 'flex',
              marginBottom: '9px',
            }}
            className="leaderboard-coin-select-mobile"
          >
            <span
              className={
                gameSelect === 'play' ? 'account-hover active' : 'account-hover'
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
              PLAY
            </span>
            <span
              className={
                gameSelect === 'mana' ? 'account-hover active' : 'account-hover'
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
                gameSelect === 'dai' ? 'account-hover active' : 'account-hover'
              }
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
          </span>

          {/* ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////
                ////////////////////////  send time select to own row  ///////////////////////// */}

          <span className="account-hover-time tablet">
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
            Leaderboard()
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
