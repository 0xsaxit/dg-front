import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider, Dropdown, Icon } from 'semantic-ui-react';
import ContentGames from '../content/ContentGames';
import Spinner from '../Spinner';
import Images from '../../common/Images';
import Fetch from '../../common/Fetch';
import { useRouter } from 'next/router';


const options = [
  {
    key: 'ALL TIME',
    text: 'ALL TIME',
    value: 'ALL TIME',
    content: 'ALL TIME',
  },
  {
    key: 'WEEKLY',
    text: 'WEEKLY',
    value: 'WEEKLY',
    content: 'WEEKLY',
  },
  {
    key: 'DAILY',
    text: 'DAILY',
    value: 'DAILY',
    content: 'DAILY',
  },
  {
    key: 'COMPETITION',
    text: 'COMPETITION',
    value: 'COMPETITION',
    content: 'COMPETITION',
  },
];

const detailsGames = {
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/blackjack_jcrtzp.png',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/blackjack',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/roulette_whagvm.png',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows. There is also a variant with a floating wheel that displays the spin and outcome in addition to the table wheel.',
    '1-8 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/roulette',
  ],
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/slots_ip2tqw.png',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring three spinning reels each with four icons. There are three separate clickable buttons facing the player that indicate different wager amounts.',
    '1 PLAYER',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/slots',
  ],
  Backgammon: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605209871/backgammon_zttuej.png',
    'games-pic',
    'Backgammon',
    'Decentral Games backgammon is standard backgammon game. At the start of each game, the player agree upon and place a wager to be paid out to the winner minus a fee at the end of each game.',
    '2 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=85%2C-20&realm=fenrir-gold',
    'https://docs.decentral.games/games/backgammon',
  ],
};

const detailsCasinos = {
  Chateau: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741771/chateau_j1g5m7.png',
    'games-pic',
    'Chateau Satoshi',
    'Chateau Satoshi is located within the Vegas City district in Decentraland. The scene features an art deco inspired casino, theatre, nightclub, and stratosphere. The casino is accessible from the most northwestern Decentraland Genesis Plaza and is adjacent to the Vegas City Welcome Plaza.',
    'ROULETTE, BLACKJACK',
    'https://play.decentraland.org/?position=-75%2C77&realm=fenrir-amber',
    'https://docs.decentral.games/casinos/chateau-satoshi',
  ],
  Tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741770/tominoya_ataapu.png',
    'games-pic',
    'Tominoya',
    'Tominoya is decentral.games most recent and Japanese-themed casino located in the Vegas City district of Decentraland. The scene features two floors with three wings each, and a conference center upstairs where live video streams are held.',
    'ROULETTE, BLACKJACK, SLOTS',
    'https://play.decentraland.org/?position=-119%2C133&realm=fenrir-amber',
    'https://docs.decentral.games/casinos/tominoya',
  ],
  Serenity: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1605741775/serenity_sqez7j.png',
    'games-pic',
    'Serenity Island',
    'Serenity Island is located in the Vegas City district in Decentraland. The scene features a massive island that players must climb up to enter, and the structure sports a Monte Carlo-inspired architecture. The building is three stories total featuring two levels of games and a basement club.',
    'ROULETTE, BLACKJACK',
    'https://play.decentraland.org/?position=-145%2C115&realm=fenrir-amber',
    'https://docs.decentral.games/casinos/serenity-island',
  ],
};

const Offerings = () => {
  const router = useRouter()
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [timePeriod, setTimePeriod] = useState('ALL TIME');
  const [gameState, setGameState] = useState('');
  const [gameRecordsRefresh, setGameRecordsRefresh] = useState(false);

  useEffect(() => {
    const urlParam = ((window.location.href).split('?=')[1]);
    if (urlParam === undefined) {
      router.push('?=games');
      setGameState('games');
    } else if (urlParam === 'games' || urlParam === 'casinos' || urlParam === 'leaderboard') {
      router.push(`?=${urlParam}`);
      setGameState(urlParam);
    } else {
      router.push('?=games');
      setNFTState('games');
    }
  }, []);

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

  function timeChange(event, data) {
    setTimePeriod(data.value);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the game offerings details object
  function Games() {
    return (
      <div className="outter-games-container">
        {Object.keys(detailsGames).map((item, i) => (
          <a
            href="https://play.decentraland.org/?position=-120%2C135"
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={detailsGames[item][0]}
                className={detailsGames[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <h3 className="nft-other-h3">{detailsGames[item][2]}</h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{detailsGames[item][4]}</p>
                <p className="nfts-info-2">{detailsGames[item][5]}</p>
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
                {detailsGames[item][3]}
              </p>

              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={detailsGames[item][6]}
                >
                  PLAY NOW
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={detailsGames[item][7]}
                >
                  READ MORE
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  function Leaderboard() {

    if (gameRecordsRefresh) {
      return <Spinner background={1} />;
    } else {
      return (
        <ContentGames
          gameRecords={state.gameRecords}
          gameSelect={gameSelect}
          timePeriod={timePeriod}
        />
      );
    }
  }

  function Casinos() {
    return (
      <div className="outter-games-container">
        {Object.keys(detailsCasinos).map((item, i) => (
          <a
            href="https://play.decentraland.org/?position=-120%2C135"
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={detailsCasinos[item][0]}
                className={detailsCasinos[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <h3 className="nft-other-h3">{detailsCasinos[item][2]}</h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{detailsCasinos[item][4]}</p>
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
                {detailsCasinos[item][3]}
              </p>

              <span style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={detailsCasinos[item][5]}
                >
                  PLAY NOW
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={detailsCasinos[item][6]}
                >
                  READ MORE
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  async function refreshLeaderboard() {

    console.log('Re-fetching game records');
    setGameRecordsRefresh(true);

    const response = await Fetch.GAME_RECORDS();
    const jsonRecords = await response.json();

    setGameRecordsRefresh(false);

    dispatch({
      type: 'update_records',
      data: jsonRecords,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // tab select and coin select area
  function submenu() {
    return (
      <div className="account-other-tabs">
        {/* ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////  tab select area   //////////////////////////////// */}

        {gameState === 'games' ? (
          <p className="account-other-p" style={{ width: '100%' }}>
            <b className="account-hover active">OUR GAMES</b>{' '}
            <abbr 
              className="account-hover" 
              onClick={() => {
                setGameState('casinos')
                router.push('?=casinos')
              }}
            >
              OUR CASINOS
            </abbr>{' '}
            <abbr 
              className="account-hover" 
              onClick={() => {
                setGameState('leaderboard')
                router.push('?=leaderboard')
              }}
            >
              LEADERBOARD
            </abbr>
            <Divider className="tab-divider" style={{ marginTop: '18px', paddingBottom: '21px' }} />
          </p>
        ) : gameState === 'casinos' ? (
          <p className="account-other-p" style={{ width: '100%' }}>
            <abbr 
              className="account-hover" 
              onClick={() => {
                setGameState('games')
                router.push('?=games')
              }}
            >
              OUR GAMES
            </abbr>{' '}
            <b className="account-hover active">OUR CASINOS</b>{' '}
            <abbr 
              className="account-hover" 
              onClick={() => {
                setGameState('leaderboard')
                router.push('?=leaderboard')
              }}
            >
              LEADERBOARD
            </abbr>{' '}
            <Divider className="tab-divider" style={{ marginTop: '18px', paddingBottom: '21px' }} />
          </p>  
        ) : (
          <div style={{ width: '100%' }}>
            <span style={{ display: 'flex', width: '100%' }}>
              <p className="account-other-p">
                <abbr 
                  className="account-hover" 
                  onClick={() => {
                    setGameState('games')
                    router.push('?=games')
                  }}
                >
                  OUR GAMES
                </abbr>{' '}
                <abbr 
                  className="account-hover" 
                  onClick={() => {
                    setGameState('casinos')
                    router.push('?=casinos')
                  }}
                >
                  OUR CASINOS
                </abbr>{' '}
                <b className="account-hover active">LEADERBOARD</b>{' '}
              </p>
            </span>

            {/* ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////
            ///////////////////////////  desktop coin select  ////////////////////////////// */}

            <span
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
              }}
              className="leaderboard-coin-select"
            >
              <span
                className={
                  gameSelect === 'play'
                    ? 'account-select play'
                    : 'account-select'
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
                  gameSelect === 'mana'
                    ? 'account-select mana'
                    : 'account-select'
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
                  gameSelect === 'dai' ? 'account-select dai' : 'account-select'
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
              <span
                className="account-select dropdown"
                style={{
                  marginRight: '0px',
                  fontWeight: '400',
                }}
              >
                <Dropdown
                  options={options}
                  defaultValue={options[0].value}
                  onChange={timeChange}
                />

                <Button
                  onClick={() => refreshLeaderboard()}
                  className="reload-button"
                  icon
                >
                  <Icon name="redo" />
                </Button>
              </span>
            </span>

            <Divider className="coin-select-divider" />

            {/* ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////////////////////////////////////////////////////////
            ////////////////////////////  mobile coin select  ////////////////////////////// */}

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
                    gameSelect === 'play'
                      ? 'account-select play'
                      : 'account-select play2'
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
                    gameSelect === 'mana'
                      ? 'account-select mana'
                      : 'account-select'
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
                    gameSelect === 'dai'
                      ? 'account-select dai'
                      : 'account-select'
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

              <span
                className="account-select dropdown"
                id="intermediate-time-select"
                style={{
                  marginRight: '0px',
                  fontWeight: '400',
                }}
              >
                <Dropdown
                  options={options}
                  defaultValue={options[0].value}
                  onChange={timeChange}
                />

                <Button
                  onClick={() => refreshLeaderboard()}
                  className="reload-button"
                  icon
                >
                  <Icon name="redo" />
                </Button>
              </span>
            </span>
            <span
              className="account-select dropdown"
              id="mobile-time-select"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                left: '0px',
                fontWeight: '400',
              }}
            >
              <Dropdown
                style={{ marginTop: '6px' }}
                options={options}
                defaultValue={options[0].value}
                onChange={timeChange}
              />

              <Button
                onClick={() => refreshLeaderboard()}
                className="reload-button"
                icon
              >
                <Icon name="redo" />
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container">
          {submenu()}

          {gameState === 'games' ? 
            Games() 
          : gameState === 'casinos' ?
            Casinos()
          :  
            Leaderboard()
          }

        </div>
      </div>
    </div>
  );
};

export default Offerings;
