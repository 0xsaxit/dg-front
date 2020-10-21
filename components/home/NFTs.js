import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider } from 'semantic-ui-react';
import ContentNFTs from '../content/ContentNFTs';
import Aux from '../_Aux';
import Spinner from '../Spinner';

const detailsNFTs = {
  tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_9_yxm85s.png',
    'nft-pic',
    'Tominoya, Vegas City',
    'LOCATION: -120, 135',
    'Tominoya is a Japanese themed casino built by Decentral Games.',
    'https://opensea.io/assets/vegas-city-land-lease?search=%7B%22query%22%3A%22tominoya%22%7D',
    'https://decentral.games/blog/tominoya-casino-nft-sale',
  ],
  flamingos: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_n439sj.png',
    'nft-pic',
    'Flamingos, Vegas City',
    'LOCATION: -126, 118',
    'Flamingos is a classically inspired casino built by Vegas City.',
    'https://opensea.io/assets/vegas-city-land-lease?search=%7B%22query%22%3A%22flamingos%22%7D',
    'https://decentral.games/blog/the-flamingos-a-mega-casino-by-vegas-city-decentral-games',
  ],
  mink_coat: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_3_ywc2cq.png',
    'nft-pic',
    '$DG Mink',
    'LEGENDARY',
    'An opulent fur coat made and produced using only the finest of mink furs. #extrasaus',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/66',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_2_lu5fwe.png',
    'nft-pic',
    'Tracksuit Top',
    'LEGENDARY',
    'The top portion of the decadent and elegant Decentral Games tracksuit fit. #drip',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/67',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_4_meqpkq.png',
    'nft-pic',
    'Tracksuit Bottom',
    'LEGENDARY',
    'The bottom portion of the decadent and elegant Decentral Games tracksuit fit. #drip',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/65',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_7_hvlegg.png',
    'nft-pic',
    'Spectacles',
    'LEGENDARY',
    'Swaggy flip up shades designed to be wearable at any occassion. #ice',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/81',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_5_lijr1y.png',
    'nft-pic',
    'Deezys',
    'LEGENDARY',
    'street wear inspired comfy kicks inspired by the latest fashion. #ye',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/35Shoes',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_6_iujl4o.png',
    'nft-pic',
    '$DG Slides',
    'LEGENDARY',
    'Lazy day but designer slides complete with socks to keep your toes warm.',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/25Slides',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
};

const NFTs = () => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [NFTstate, setNFTState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [doneLoading, setDoneLoading] = useState(true);

  useEffect(() => {
    if (document.readyState === 'complete') {
      setDoneLoading(false);
    }
  });

  useEffect(() => {
    if (Object.keys(state.parcelDataUser).length) {
      setIsLoading(false);
    }
  }, [state.parcelDataUser]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
    return (
      <div className="outter-nft-container">
        {Object.keys(detailsNFTs).map((item, i) => (
          <a href={detailsNFTs[item][5]} className="nft-container">
            <div key={i}>
              <span
                style={{ display: 'flex', justifyContent: 'center' }}
                className="nft-image"
              >
                <Image
                  src={detailsNFTs[item][0]}
                  className={detailsNFTs[item][1]}
                  style={{ borderRadius: '2px' }}
                />
              </span>
              <div className="nft-description">
                <h3 className="nft-other-h3">{detailsNFTs[item][2]}</h3>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className="nfts-info">{detailsNFTs[item][3]}</p>
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
                  {detailsNFTs[item][4]}
                </p>

                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button
                    color="blue"
                    className="nft-button"
                    target="_blank"
                    href={detailsNFTs[item][5]}
                  >
                    PURCHASE NFT
                  </Button>
                  <Button
                    className="nft-read-button two"
                    target="_blank"
                    href={detailsNFTs[item][6]}
                  >
                    READ MORE
                  </Button>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  function myNFTs() {
    return (
      <Aux>
        {!state.networkID ? (
          <div className="account-other-inner-p">
            You must login to MetaMask to view your NFTs
          </div>
        ) : state.networkID !== 1 ? (
          <div className="account-other-inner-p">
            Please switch MetaMask to Ethereum Mainnet
          </div>
        ) : isLoading ? (
          <div className="account-other-inner-p">
            You do not own any Tominoya NFTs
          </div>
        ) : (
          <ContentNFTs parcelDataUser={state.parcelDataUser} />
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
        {NFTstate === 0 ? (
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
    <div className="main-container">
      {doneLoading ? (
        <Spinner background={3} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container ">
            {submenu()}

            <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />

            {NFTstate === 1 ? myNFTs() : buyNFTs()}
          </div>
        </div>
      )}
    </div>
  );
};

export default NFTs;
