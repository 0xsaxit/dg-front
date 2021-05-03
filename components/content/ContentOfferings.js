import { Image, Button, Divider } from 'semantic-ui-react';
import { useState, useEffect } from 'react';


const ContentOfferings = (props) => {
  // define local variables
  const [utm, setUtm] = useState('');

  let buttonGames1 = '';
  let buttonGames2 = '';
  let buttonGames3 = '';
  let buttonGames4 = '';
  let buttonCasinos1 = '';
  let buttonCasinos2 = '';
  // let buttonCasinos3 = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  useEffect(() => {
    buttonGames1 = document.getElementById('play-now-button-games-1');
    buttonGames2 = document.getElementById('play-now-button-games-2');
    buttonGames3 = document.getElementById('play-now-button-games-3');
    buttonGames4 = document.getElementById('play-now-button-games-4');
    buttonCasinos1 = document.getElementById('play-now-button-casinos-1');
    buttonCasinos2 = document.getElementById('play-now-button-casinos-2');
    // buttonCasinos3 = document.getElementById('play-now-button-casinos-3');
  }, []);

  useEffect(() => {
    if (buttonGames1 || buttonGames2 || buttonGames3 || buttonGames4) {
      analytics.trackLink(
        [buttonGames1, buttonGames2, buttonGames3, buttonGames4],
        'Clicked PLAY NOW (games page)'
      );
    }
  }, [buttonGames1, buttonGames2, buttonGames3, buttonGames4]);

  useEffect(() => {
    if (buttonCasinos1 || buttonCasinos2) {
      analytics.trackLink(
        [buttonCasinos1, buttonCasinos2],
        'Clicked PLAY NOW (casinos page)'
      );
    }
  }, [buttonCasinos1, buttonCasinos2]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGames() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsGames).map((item, i) => (
          <a
            href={props.detailsGames[item][6] + utm}
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={props.detailsGames[item][0]}
                className={props.detailsGames[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <h3 className="nft-other-h3">{props.detailsGames[item][2]}</h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{props.detailsGames[item][4]}</p>
                <p className="nfts-info-2">{props.detailsGames[item][5]}</p>
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
                {props.detailsGames[item][3]}
              </p>

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsGames[item][6] + utm}
                >
                  Play Now
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsGames[item][7]}
                >
                  Read More
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  function buyNFTs() {
    return (
      <span>
        <div className="outter-nft-container">
          {Object.keys(props.detailsNFTs).map((item, i) => (
            <a href={props.detailsNFTs[item][5]} className="nft-container">
              <div key={i}>
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src={props.detailsNFTs[item][0]}
                    className={props.detailsNFTs[item][1]}
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">{props.detailsNFTs[item][2]}</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className="nfts-info">{props.detailsNFTs[item][3]}</p>
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
                    {props.detailsNFTs[item][4]}
                  </p>

                  <span
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      color="blue"
                      className="nft-button"
                      target="_blank"
                      href={props.detailsNFTs[item][5]}
                    >
                      Purchase
                    </Button>
                    <Button
                      className="nft-read-button"
                      target="_blank"
                      href={props.detailsNFTs[item][6]}
                    >
                      Read More
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentCasinos() {
    return (
      <div>
        <a
          href="https://play.decentraland.org/?position=-96%2C110"
          target="_blank"
          className="games-container"
          style={{ width: '100%', marginBottom: '30px' }}
        >
          <span
            style={{ display: 'flex', justifyContent: 'center' }}
            className="nft-image"
            style={{ height: '400px' }}
          >
            <Image
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620072433/render7_nakteh.png"
              className="games-pic"
              style={{ borderRadius: '4px', minHeight: '400px', objectPosition: 'bottom' }}
            />
          </span>
          <div className="nft-description">
            <h3 className="nft-other-h3">Atari Casino</h3>
            <span style={{ display: 'flex', justifyContent: 'center' }}>
              <p className="nfts-info">ROULETTE, BLACKJACK</p>
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
              Atari Casino, a 20 parcel casino estate, is found in the Casino Quarter of Vegas City, Decentraland. This partnership brings a host of benefits to Decentral Games’ community and $DG hodlers with 88% of the profit share contributing to DG DAO Treasury. Atari Casino features Atari-themed games and the addition of the Atari token (ATRI).
            </p>

            <span
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <Button
                id="play-now-button-casinos-3"
                color="blue"
                className="nft-button"
                target="_blank"
                href="https://play.decentraland.org/?position=-96%2C110"
              >
                Play Now
              </Button>
              <Button
                className="nft-read-button two"
                target="_blank"
                href="https://docs.decentral.games/operators/tominoya"
              >
                Read More
              </Button>
            </span>
          </div>
        </a>
        <div className="outter-games-container">
          {Object.keys(props.detailsCasinos).map((item, i) => (
            <a
              href={props.detailsCasinos[item][5] + utm}
              target="_blank"
              className="games-container"
            >
              <span
                style={{ display: 'flex', justifyContent: 'center' }}
                className="nft-image"
              >
                <Image
                  src={props.detailsCasinos[item][0]}
                  className={props.detailsCasinos[item][1]}
                  style={{ borderRadius: '4px' }}
                />
              </span>
              <div className="nft-description">
                <h3 className="nft-other-h3">{props.detailsCasinos[item][2]}</h3>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className="nfts-info">{props.detailsCasinos[item][4]}</p>
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
                  {props.detailsCasinos[item][3]}
                </p>

                <span
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <Button
                    id={`play-now-button-casinos-${i + 1}`}
                    color="blue"
                    className="nft-button"
                    target="_blank"
                    href={props.detailsCasinos[item][5] + utm}
                  >
                    Play Now
                  </Button>
                  <Button
                    className="nft-read-button two"
                    target="_blank"
                    href={props.detailsCasinos[item][6]}
                  >
                    Read More
                  </Button>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentShop() {
    return (
       <div className="outter-games-container">
        {Object.keys(props.detailsShop).map((item, i) => (
          <a
            href={props.detailsShop[item][6] + utm}
            target="_blank"
            className="games-container"
          >
            <span
              style={{ display: 'flex', justifyContent: 'center' }}
              className="nft-image"
            >
              <Image
                src={props.detailsShop[item][0]}
                className={props.detailsShop[item][1]}
                style={{ borderRadius: '4px' }}
              />
            </span>
            <div className="nft-description">
              <h3 className="nft-other-h3">{props.detailsShop[item][2]}</h3>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className="nfts-info">{props.detailsShop[item][4]}</p>
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
                {props.detailsShop[item][3]}
              </p>

              <span
                style={{ display: 'flex', justifyContent: 'space-between' }}
              >
                <Button
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsShop[item][5] + utm}
                >
                  Shop Now
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsShop[item][6]}
                >
                  Read More
                </Button>
              </span>
            </div>
          </a>
        ))}
      </div>
    );
  }

  if (props.gameState === 'games') {
    return contentGames();
  } else if (props.gameState === 'nfts') {
    return buyNFTs();
  } else if (props.gameState === 'casinos') {
    return contentCasinos();
  } else if (props.gameState === 'shop') {
    return contentShop();
  }
};

export default ContentOfferings;
