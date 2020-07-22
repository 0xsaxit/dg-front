import React from 'react';
import { Image, Button, Divider, Grid, Dropdown } from 'semantic-ui-react';
import ContentGames from './ContentGames';
import Spinner from '../Spinner';
import Global from '../Constants';

const options = [
  { key: 1, text: 'Month', value: 1 },
  { key: 2, text: 'Week', value: 2 },
  { key: 3, text: 'Day', value: 3 },
]

const detailsGames = {
  Slots: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058163/slots-1_qa9ced_a8rqpc_lcvhua.jpg',
    'games-pic',
    'Slots',
    'Decentral Games slots are skin-able machines featuring three spinning reels each with four icons. There are three separate clickable buttons facing the player that indicate different wager amounts.',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/slots',
  ],
  Roulette: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058162/roulette-1_rmgcgr_evcxkj_rwjlcw.jpg',
    'games-pic',
    'Roulette',
    'Decentral Games roulette is standard European Roulette, featuring single bet numbers 1-36, black/red, odd/even, high/low, columns and rows. There is also a variant with a floating wheel that displays the spin and outcome in addition to the table wheel.',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/roulette',
  ],
  Backgammon: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/dice_fheuwk_t8hjf6_ydjuva.jpg',
    'games-pic',
    'Backgammon',
    'Decentral Games backgammon is standard backgammon game featuring two players. At the start of each game, the player agree upon and place a wager that capitalizes a pot to be paid out to the winner minus a fee at the end of the game. The current minimum bet is 10 MANA, and the wager may be raised by clicking on the doubling cube throughout the game.',
    'https://play.decentraland.org/?position=85%2C-20&realm=fenrir-gold',
    'https://docs.decentral.games/games/backgammon',
  ],
  BlackJack: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1589058160/blackjack_haiuyl_pnpdet_nolik4.jpg',
    'games-pic',
    'Blackjack',
    'Decentral Games blackjack accommodates 1-4 players. At the start of each game, each player places a bet, which initiates a countdown timer to deal the cards out.',
    'https://play.decentral.games',
    'https://docs.decentral.games/games/blackjack',
  ],
};

class Offerings extends React.Component {
  constructor(props) {
    super(props);
    this.state = { GameState: 0, isLoading: true };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the game offerings details object
  Games = () => {
    return Object.keys(detailsGames).map((item, i) => {
      return (
        <div className="nft-container" key={i}>
          <div className="nft-image">
            <Image
              src={detailsGames[item][0]}
              className={detailsGames[item][1]}
              style={{ borderRadius: '3px' }}
            />
          </div>
          <div className="nft-description">
            <h3
              className="nft-other-h3"
              style={{ textAlign: 'left', marginTop: '0px' }}
            >
              {detailsGames[item][2]}
            </h3>
            <p className="nft-other-p">{detailsGames[item][3]}</p>
            <Button
              color="blue"
              className="games-button"
              target="_blank"
              href={detailsGames[item][4]}
            >
              PLAY NOW
            </Button>
            <Button
              className="nft-read-button"
              target="_blank"
              href={detailsGames[item][5]}
            >
              READ MORE
            </Button>
          </div>
        </div>
      );
    });
  };

  Leaderboard = () => {
    return (
      <div>
        <ContentGames />
      </div>
    );
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  submenu = () => {
    return (
      <div className="account-other-tabs">
        {this.state.GameState == 0 ? (
          <p className="account-other-p" style={{ width: '100%' }}>
            <b className="account-hover active">OUR GAMES</b>{' '}
            <abbr className="account-hover" onClick={() => this.setPage(1)}>
              LEADERBOARD
            </abbr>
            <Divider style={{ marginTop: '21px', paddingBottom: '21px' }} />
          </p>
        ) : (
          <div style={{ width: '100%' }}> 
            <span style={{ display: 'flex', width: '100%' }}>
              <p className="account-other-p">
                <abbr className="account-hover" onClick={() => this.setPage(0)}>
                  OUR GAMES
                </abbr>{' '}
                <b className="account-hover active">LEADERBOARD</b>
              </p>
              <span style={{ display: 'flex', justifyContent: 'flex-end', width: 'calc(100% - 281px)', marginTop: '27px' }}>
                <span className="account-hover">
                  <img
                    style={{
                      verticalAlign: 'middle',
                      marginRight: '6px',
                      marginTop: '-1px',
                    }}
                    className="image inline"
                    width="18px"
                    height="18px"
                    src={Global.IMAGES.LOGO}
                  />
                  PLAY
                </span>
                <span className="account-hover">
                  <img
                    style={{
                      verticalAlign: 'middle',
                      marginRight: '6px',
                      marginTop: '-1px',
                    }}
                    className="image inline"
                    width="18px"
                    height="18px"
                    src={Global.IMAGES.MANA_CIRCLE}
                  />
                  MANA
                </span>
                <span className="account-hover">
                  <img
                    style={{
                      verticalAlign: 'middle',
                      marginRight: '6px',
                      marginTop: '-1px',
                    }}
                    className="image inline"
                    width="18px"
                    height="18px"
                    src={Global.IMAGES.DAI_CIRCLE}
                  />
                  DAI
                </span>
                <span className="account-hover" style={{ marginLeft: '30px', marginRight: '0px', fontWeight: '400' }}>
                  <Dropdown text='All Time' options={options}/>
                </span>                       
              </span>
            </span>

            <Divider style={{ marginTop: '0px', paddingBottom: '21px' }} />
          </div>
        )}
      </div>
    );
  };

  setPage = (number) => {
    this.setState({ GameState: number });
  };

  render() {
    if (this.state.isLoading) return <Spinner background={0} />;

    return (
      <div className="main-container" style={{ marginBottom: '60px' }}>
        <div className="page-container">
          <div className="account-other-inner-container">
            {this.submenu()}

            {this.state.GameState == 1 ? this.Leaderboard() : this.Games()}
          </div>
        </div>
      </div>
    );
  }
}

export default Offerings;
