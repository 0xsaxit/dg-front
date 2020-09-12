import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Image, Button, Divider, Grid, Breadcrumb } from 'semantic-ui-react';
import ContentNFTs from './ContentNFTs';
import Aux from '../_Aux';

const detailsNFTs = {
  tominoya: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-04-29_at_9.22.15_AM_xjm41j.png',
    'nft-pic',
    'Tominoya, Vegas City',
    'LOCATION: -120, 135',
    'Tominoya is a Japanese themed casino built by Decentral Games.',
    'https://opensea.io/assets?query=tominoya',
    'https://decentral.games/blog/tominoya-casino-nft-sale',
  ],
  flamingos: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1592519040/Screen_Shot_2020-06-18_at_12.27.19_PM_zoutwy.png',
    'nft-pic',
    'Flamingos, Vegas City',
    'LOCATION: -126, 118',
    'Flamingos is a casino built by the Vegas City team.',
    'https://opensea.io/assets/vegas-city-land-lease?query=flamingos',
    'https://decentral.games/blog/the-flamingos-a-mega-casino-by-vegas-city-decentral-games',
  ],
  mink_coat: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599685013/Screen_Shot_2020-09-09_at_1.53.25_PM_2_kyhwea.png',
    'nft-pic',
    'Mink Fur Coat',
    'LEGENDARY',
    'An opulent fur coat made from minks. #extrasaus',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/66',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599685111/Screen_Shot_2020-09-09_at_1.53.25_PM_2_2_tiipu1.png',
    'nft-pic',
    'Tracksuit Top',
    'LEGENDARY',
    'The top portion of the decadent and elegant Decentral Games tracksuit fit. #drip',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/67',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599684842/Screen_Shot_2020-09-09_at_1.53.25_PM_grwibw.png',
    'nft-pic',
    'Tracksuit Bottom',
    'LEGENDARY',
    'The bottom portion of the decadent and elegant Decentral Games tracksuit fit. #drip',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/65',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1599685234/Screen_Shot_2020-09-09_at_1.53.25_PM_2_3_e3lcg7.png',
    'nft-pic',
    'Shades Glasses',
    'LEGENDARY',
    'Swaggy flip up shades for any occasion, inside or outside, featuring a chain to keep them secure. #ice',
    'https://market.decentraland.org/contracts/0xbf53c33235cbfc22cef5a61a83484b86342679c5/tokens/81',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ]
};

const Tokens = () => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [NFTstate, setNFTState] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Object.keys(state.parcelData).length !== 0) {
      setIsLoading(false);
    }
  }, [state.parcelData]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
    return (
      <div className="outter-nft-container">
        {Object.keys(detailsNFTs).map((item, i) => (
          <div className="nft-container" key={i}>
            <span style={{ display: 'flex', justifyContent: 'center' }} className="nft-image">
              <Image
                src={detailsNFTs[item][0]}
                className={detailsNFTs[item][1]}
                style={{ borderRadius: '2px' }}
              />
            </span>
            <div className="nft-description">
              <h3
                className="nft-other-h3"
              >
                {detailsNFTs[item][2]}
              </h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{detailsNFTs[item][3]}</p>
              </span>

              <Divider style={{ margin: '9px 0px 12px 0px' }}/>

              <p
                className="nft-other-p"
                style={{ marginTop: '-12px', paddingTop: '15px', textAlign: 'center' }}
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
          <ContentNFTs parcelData={state.parcelData} />
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
        <div>
          <p className="page-header-text">NFTs</p>
        </div>
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
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />

          {NFTstate == 1 ? myNFTs() : buyNFTs()}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
