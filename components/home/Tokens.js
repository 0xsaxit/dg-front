import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Link from 'next/link';
import { Menu, Image, Button, Divider } from 'semantic-ui-react';
import ContentNFTs from '../content/ContentNFTs';
import Aux from '../_Aux';


const detailsNFTs = {
  mink_coat: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_3_ywc2cq.png',
    'nft-pic',
    'DG Fur Mink',
    'LEGENDARY',
    'An opulent fur coat made from minks #extrasaus',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/247',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_top: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_2_lu5fwe.png',
    'nft-pic',
    'DG Tracksuit Jacket',
    'LEGENDARY',
    'The jacket of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/248',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  tracksuit_bottom: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_4_meqpkq.png',
    'nft-pic',
    'DG Tracksuit Pants',
    'LEGENDARY',
    'The pants of the decadent and elegant DG tracksuit #drip',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/246',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532141/x_7_hvlegg.png',
    'nft-pic',
    'DG Flip Up Spectacles',
    'LEGENDARY',
    'Swaggy flip up shades designed to be wearable at any occassion. #ice',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/243',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  yeezies: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_5_lijr1y.png',
    'nft-pic',
    'DG Deezys',
    'LEGENDARY',
    'Comfy and elegant sneekers #deezys',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/244',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
  slides: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1601532142/x_6_iujl4o.png',
    'nft-pic',
    'DG Slides',
    'LEGENDARY',
    'Lazy day designer slides complete with socks to keep your toes warm #cozyslides',
    'https://opensea.io/assets/0xbf53c33235cbfc22cef5a61a83484b86342679c5/245',
    'https://decentral.games/blog/decentral-games-dcl-wearables-have-arrived',
  ],
};

const Tokens = (props) => {
  // get user's NFT data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [NFTState, setNFTState] = useState(props.NFTState);
  const [isLoading, setIsLoading] = useState(true);

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
      <span>
        <div className="DG-liquidity-container top">
          <div
            className="DG-column top"
            style={{ marginBottom: '21px', marginTop: '6px' }}
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <p>
                {' '}
                Each Decentral Games Decentraland wearable NFT gives a +10% $DG
                mining bonus while equipped. A maximum of 4 wearables (+40%
                bonus) may be equipped at a single time. To read more about $DG
                wearable mining bonuses, see our docs.
              </p>
            </span>
          </div>
        </div>
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
                    style={{ borderRadius: '4px' }}
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

                  <span
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      color="blue"
                      className="nft-button"
                      target="_blank"
                      href={detailsNFTs[item][5]}
                    >
                      PURCHASE NFT
                    </Button>
                    <Button
                      className="nft-read-button"
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
      </span>
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
        {NFTState === 'buy' ? (
          <p className="account-other-p">
            <b className="account-hover active">BUY NFTS</b>
            <Link href="/nfts/my">
              <Menu.Item className="account-hover">MY NFTS</Menu.Item>
            </Link>
          </p>
        ) : (
          <p className="account-other-p">
            <Link href="/nfts">
              <Menu.Item className="account-hover">BUY NFTS</Menu.Item>
            </Link>
            <b className="account-hover active">MY NFTS</b>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider
            className="tab-divider"
            style={{ marginTop: '18px', paddingBottom: '21px' }}
          />

          {NFTState === 'my' ? myNFTs() : buyNFTs()}
        </div>
      </div>
    </div>
  );
};

export default Tokens;
