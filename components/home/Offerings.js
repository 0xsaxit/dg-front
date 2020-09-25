import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider, Dropdown, Icon } from 'semantic-ui-react';
import ContentGames from './ContentGames';
import Spinner from '../Spinner';
import Global from '../Constants';

const options = [
  {
    key: 'ALL TIME',
    text: 'ALL TIME',
    value: 'ALL TIME',
    content: 'ALL TIME',
  },
  {
    key: 'WEEK',
    text: 'WEEK',
    value: 'WEEK',
    content: 'WEEK',
  },
  {
    key: 'DAY',
    text: 'DAY',
    value: 'DAY',
    content: 'DAY',
  },
  {
    key: 'COMPETITION',
    text: 'COMPETITION',
    value: 'COMPETITION',
    content: 'COMPETITION',
  },
];

const detailsGames = {
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058163/slots-1_qa9ced_a8rqpc_lcvhua.jpg',
    'nft-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring three spinning reels each with four icons. There are three separate clickable buttons facing the player that indicate different wager amounts.',
    '1 PLAYER',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/slots',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058162/roulette-1_rmgcgr_evcxkj_rwjlcw.jpg',
    'nft-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows. There is also a variant with a floating wheel that displays the spin and outcome in addition to the table wheel.',
    '1-8 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/roulette',
  ],
  Backgammon: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/dice_fheuwk_t8hjf6_ydjuva.jpg',
    'nft-pic',
    'Backgammon',
    'Decentral Games backgammon is standard backgammon game. At the start of each game, the player agree upon and place a wager to be paid out to the winner minus a fee at the end of each game.',
    '2 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentraland.org/?position=85%2C-20&realm=fenrir-gold',
    'https://docs.decentral.games/games/backgammon',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/blackjack_haiuyl_pnpdet_nolik4.jpg',
    'nft-pic',
    'Blackjack',
    'Decentral Games blackjack follows standard blackjack rules. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    '1-4 PLAYERS',
    'PLAY, MANA, DAI',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/blackjack',
  ],
};

const Offerings = () => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [gameSelect, setGameSelect] = useState('play');
  const [timePeriod, setTimePeriod] = useState('ALL TIME');
  const [isLoading, setIsLoading] = useState(true);
  const [doneLoading, setDoneLoading] = useState(true);

  useEffect(() => {
    if(document.readyState === 'complete') {
      setDoneLoading(false);
    }
  });

  const [gameState, setGameState] = useState('0');

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
          <div className="games-container">
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={detailsGames[item][0]}
                className={detailsGames[item][1]}
                style={{ borderRadius: '2px' }}
              />
            </span>
            <div className="nft-description">
              <h3 className="nft-other-h3">{detailsGames[item][2]}</h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{detailsGames[item][4]}</p>
                <p className="nfts-info-2">{detailsGames[item][5]}</p>
              </span>

              <Divider style={{ margin: '10px 0px 15px 0px', width: 'calc(100% + 60px)', marginLeft: '-30px' }}/>

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

              <span style={{ display: 'flex', justifyContent: 'center' }}>
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
          </div>
        ))}
      </div>
    );
  }

  function Leaderboard() {
    return (
      <div>
        <ContentGames gameSelect={gameSelect} timePeriod={timePeriod} />
      </div>
    );
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

        {gameState == 0 ? (
          <p className="account-other-p" style={{ width: '100%' }}>
            <b className="account-hover active">OUR GAMES</b>{' '}
            <abbr className="account-hover" onClick={() => setPage(1)}>
              LEADERBOARD
            </abbr>
            <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />
          </p>
        ) : (
          <div style={{ width: '100%' }}>
            <span style={{ display: 'flex', width: '100%' }}>
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => setPage(0)}>
                  OUR GAMES
                </abbr>{' '}
                <b className="account-hover active">LEADERBOARD</b>
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
                  src={Global.IMAGES.PLAY_CIRCLE}
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
                  src={Global.IMAGES.MANA_CIRCLE}
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
                  src={Global.IMAGES.DAI_CIRCLE}
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
                <Button disabled className="reload-button" icon>
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
                    src={Global.IMAGES.PLAY_CIRCLE}
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
                    src={Global.IMAGES.MANA_CIRCLE}
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
                    src={Global.IMAGES.DAI_CIRCLE}
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
                <Button disabled className="reload-button" icon>
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
              <Button disabled className="reload-button" icon>
                <Icon name="redo" />
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }

  function setPage(number) {
    setGameState(number);
  }

  return (
    <div className="main-container">

      {doneLoading ? <Spinner background={3} /> :
        <div className="page-container">
          <div className="account-other-inner-container">
            {submenu()}

            {gameState == 1 ? Leaderboard() : Games()}
          </div>
        </div>
      }
    </div>
  );
};

export default Offerings;
