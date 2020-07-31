import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider } from 'semantic-ui-react';
import ContentNFTs from './ContentNFTs';
import Spinner from '../Spinner';
import Aux from '../_Aux';

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

const Tokens = () => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [NFTstate, setNFTState] = useState(0);
  const [loading, setLoading] = useState(true);
  const [networkID, setNetworkID] = useState(0);

  useEffect(() => {
    if (state.userStatus) {
      window.web3.version.getNetwork((err, network) => {
        setNetworkID(parseInt(parseInt(network)));
      });

      setLoading(false);
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
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
  }

  function myNFTs() {
    return (
      <Aux>
        {networkID !== 1 ? (
          <div className="account-other-inner-p">
            Please switch MetaMask to Ethereum Mainnet
          </div>
        ) : Object.keys(state.parcelData).length === 0 &&
          state.parcelData.constructor === Object ? (
          <div className="account-other-inner-p">
            You do not own any Tominoya NFTs
          </div>
        ) : (
          <ContentNFTs parcelData={state.parcelData} loading={loading} />
        )}
      </Aux>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        {NFTstate == 0 ? (
          <p className="account-other-p">
            <b className="account-hover active">BUY NFTS</b>{' '}
            <abbr className="account-hover" onClick={() => setPage(1)}>
              MY NFTS
            </abbr>
          </p>
        ) : (
          <p className="account-other-p">
            <abbr className="account-hover" onClick={() => setPage(0)}>
              BUY NFTS
            </abbr>{' '}
            <b className="account-hover active">MY NFTS</b>
          </p>
        )}
      </div>
    );
  }

  function setPage(number) {
    setNFTState(number);
  }

  return (
    <div className="main-container" style={{ marginBottom: '60px' }}>
      <div className="page-container">
        <div className="account-other-inner-container">
          {submenu()}

          <Divider style={{ marginTop: '21px', paddingBottom: '21px' }} />

          {NFTstate == 1 ? myNFTs() : buyNFTs()}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
