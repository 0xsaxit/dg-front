import React from 'react';
import { Image, Button, Divider } from 'semantic-ui-react';
import Spinner from '../Spinner';

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
    this.state = { isLoading: true };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details objects
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
            <p className="nft-other-p">
              {detailsGames[item][3]}
            </p>
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

  render() {
    if (this.state.isLoading) return <Spinner background={0} />;

    return (
      <div className="main-container" style={{ marginBottom: '60px', paddingTop: '120px' }}>
        <div className="page-container">
          <div className="account-other-inner-container">
            {this.Games()}
          </div>
        </div>
      </div>
    );
  }
}

export default Offerings;