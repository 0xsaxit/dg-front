import React from 'react';
import { Image, Button, Divider } from 'semantic-ui-react';
import ContentNFTs from './ContentNFTs';
import Spinner from '../Spinner';

const detailsNFTs = {
  tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-04-29_at_9.22.15_AM_xjm41j.png',
    'tominoya-pic',
    'Tominoya, Vegas City',
    '-120, 135',
    'Tominoya is a Japanese themed casino built by Decentral Games. Own a physical section of the virtual casino through an NFT that generates passive rent from the games. Decentral Games provides non-custodial slots, roulette, and blackjack games playable with crypto.',
    'https://opensea.io/assets?query=tominoya',
    'https://decentral.games/blog/tominoya-casino-nft-sale',
  ],
  flamingos: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-06-18_at_12.27.19_PM_zoutwy.png',
    'flamingos-pic',
    'Flamingos, Vegas City',
    '-126, 118',
    'Flamingos is a casino built by Vegas City. Own a physical section of the virtual casino through an NFT that generates passive rent from the games. Decentral Games provides non-custodial slots, roulette, and blackjack games playable with crypto.',
    'https://opensea.io/assets/vegas-city-land-lease?query=flamingos',
    'https://decentral.games/blog/the-flamingos-a-mega-casino-by-vegas-city-decentral-games',
  ],
};

class Tokens extends React.Component {
  constructor(props) {
    super(props);

    this.state = { NFTstate: 0, isLoading: true };
  }

  async componentDidMount() {
    this.setState({ isLoading: false });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  buyNFTs = () => {
    return Object.keys(detailsNFTs).map((item, i) => {
      return (
        <div className="nft-container" key={i}>
          <div className="nft-image">
            <Image
              src={detailsNFTs[item][0]}
              className={detailsNFTs[item][1]}
              style={{ borderRadius: '3px' }}
            />
          </div>
          <div className="nft-description">
            <h3
              className="nft-other-h3"
              style={{ textAlign: 'left', marginTop: '0px' }}
            >
              {detailsNFTs[item][2]}
            </h3>
            <p className="nft-other-p">
              <b>Location:</b> {detailsNFTs[item][3]}
            </p>
            <p className="nft-other-p" style={{ marginTop: '-12px' }}>
              {detailsNFTs[item][4]}
            </p>
            <Button
              color="blue"
              className="nft-button"
              target="_blank"
              href={detailsNFTs[item][5]}
            >
              BUY ON OPENSEA
            </Button>
            <Button
              className="nft-read-button"
              target="_blank"
              href={detailsNFTs[item][6]}
            >
              READ MORE
            </Button>
          </div>
        </div>
      );
    });
  };

  myNFTs = () => {
    return (
      <div className="nft-container">
        <div className="nft-image">
          <Image
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-04-29_at_9.22.15_AM_xjm41j.png"
            className="tominoya-pic"
            style={{ borderRadius: '3px' }}
          />
        </div>
        <div className="nft-description">
          <ContentNFTs />
        </div>
      </div>
    );
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  submenu = () => {
    return (
      <div className="account-other-tabs">
        {this.state.NFTstate == 0 ? (
          <p className="account-other-p">
            <b className="account-hover active">BUY NFTS</b>{' '}
            <abbr className="account-hover" onClick={() => this.setPage(1)}>
              MY NFTS
            </abbr>
          </p>
        ) : (
          <p className="account-other-p">
            <abbr className="account-hover" onClick={() => this.setPage(0)}>
              BUY NFTS
            </abbr>{' '}
            <b className="account-hover active">MY NFTS</b>
          </p>
        )}
      </div>
    );
  };

  setPage = (number) => {
    this.setState({ NFTstate: number });
  };

  render() {
    if (this.state.isLoading) return <Spinner background={0} />;

    return (
      <div className="main-container" style={{ marginBottom: '60px' }}>
        <div className="page-container">
          <div className="account-other-inner-container">
            {this.submenu()}

            <Divider style={{ marginTop: '21px', paddingBottom: '21px' }} />

            {this.state.NFTstate == 1 ? this.myNFTs() : this.buyNFTs()}
          </div>
        </div>
      </div>
    );
  }
}

export default Tokens;
