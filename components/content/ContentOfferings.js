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
              <span>
                <p className="nfts-info">{props.detailsGames[item][4]} {props.detailsGames[item][5]}</p>
              </span>
              <h3 className="nft-other-h3">{props.detailsGames[item][2]}</h3>
              <p className="nft-other-p">
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
            <a href={props.detailsNFTs[item][5]} className="games-container">
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
                  <span>
                    <p className="nfts-info">{props.detailsNFTs[item][3]}</p>
                  </span>
                  <h3 className="nft-other-h3">{props.detailsNFTs[item][2]}</h3>

                  <p className="nft-other-p">
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
              <span>
                <p className="nfts-info">{props.detailsCasinos[item][4]}</p>
              </span>
              <h3 className="nft-other-h3">{props.detailsCasinos[item][2]}</h3>
              <p className="nft-other-p">
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
              <span>
                <p className="nfts-info">{props.detailsShop[item][4]}</p>
              </span>
              <h3 className="nft-other-h3">{props.detailsShop[item][2]}</h3>

              <p className="nft-other-p">
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
