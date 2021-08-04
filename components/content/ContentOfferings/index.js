import { Image, Button } from 'semantic-ui-react';
import { useState, useEffect } from 'react';

import styles from './ContentOfferings.module.scss';

const ContentOfferings = props => {
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

  const contentGames = () => {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsGames).map((item, i) => (
          <a
            href={props.detailsGames[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <span className={styles.image_wrapper}>
              <Image
                src={props.detailsGames[item][0]}
                className={styles.game_pic}
              />
            </span>
            <div className={styles.nft_description}>
              <span>
                <p className={styles.nfts_info}>{props.detailsGames[item][4]} {props.detailsGames[item][5]}</p>
              </span>
              <h3 className={styles.nft_other_h3}>{props.detailsGames[item][2]}</h3>
              <p className={styles.nft_other_p}>
                {props.detailsGames[item][3]}
              </p>

              <div style={{"position": "relative", "display": "flex", "justify-content": "space-between"}}>
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_blue_button}
                  target="_blank"
                  href={props.detailsGames[item][6] + utm}
                >
                  Play
                </Button>
                <Button
                  className={styles.nft_read_button}
                  target="_blank"
                  href={props.detailsGames[item][7]}
                >
                  Info
                </Button>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // loop through the NFT details object
  const buyNFTs = () => {
    return (
      <span>
        <div className={styles.outter_nft_container}>
          {Object.keys(props.detailsNFTs).map((item, i) => (
            <a href={props.detailsNFTs[item][5]} className={styles.nft_container}>
                <span key={i} styles={styles.image_wrapper}>
                  <Image
                    src={props.detailsNFTs[item][0]}
                    className={styles.nft_pic}
                  />
                </span>
                <div className={styles.nft_description}>
                  <span>
                    <p className={styles.nfts_info}>{props.detailsNFTs[item][3]}</p>
                  </span>
                  <h3 className={styles.nft_other_h3}>{props.detailsNFTs[item][2]}</h3>

                  <p className={styles.nft_other_p}>
                    {props.detailsNFTs[item][4]}
                  </p>

                  <div style={{"position": "relative", "display": "flex", "justify-content": "space-between"}}>
                    <Button
                      className={styles.nft_blue_button}
                      color="blue"
                      target="_blank"
                      href={props.detailsNFTs[item][5]}
                    >
                      Buy
                    </Button>
                    <Button
                      className={styles.nft_read_button}
                      target="_blank"
                      href={props.detailsNFTs[item][6]}
                    >
                      Info
                    </Button>
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
  const contentCasinos = () => {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsCasinos).map((item, i) => (
          <a
            href={props.detailsCasinos[item][5] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <span className={styles.image_wrapper}>
              <Image
                src={props.detailsCasinos[item][0]}
                className={styles.game_pic}
              />
            </span>
            <div className={styles.nft_description}>
              <span>
                <p className={styles.nfts_info}>{props.detailsCasinos[item][4]}</p>
              </span>
              <h3 className={styles.nft_other_h3}>{props.detailsCasinos[item][2]}</h3>
              <p className={styles.nft_other_p}>
                {props.detailsCasinos[item][3]}
              </p>

              <div style={{"position": "relative", "display": "flex", "justify-content": "space-between"}}>
                <Button
                  id={`play-now-button-casinos-${i + 1}`}
                  color="blue"
                  className={styles.nft_blue_button}
                  target="_blank"
                  href={props.detailsCasinos[item][5] + utm}
                >
                  Play
                </Button>
                <Button
                  className={styles.nft_read_button}
                  target="_blank"
                  href={props.detailsCasinos[item][6]}
                >
                  Info
                </Button>
              </div>
            </div>
          </a>
        ))}
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  const contentShop = () => {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsShop).map((item, i) => (
          <a
            href={props.detailsShop[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <span className={styles.image_wrapper}>
              <Image
                src={props.detailsShop[item][0]}
                className={styles.game_pic}
              />
            </span>
            <div className={styles.nft_description}>
              <span>
                <p className={styles.nfts_info}>{props.detailsShop[item][4]}</p>
              </span>
              <h3 className={styles.nft_other_h3}>{props.detailsShop[item][2]}</h3>

              <p className={styles.nft_other_p}>
                {props.detailsShop[item][3]}
              </p>

              <div style={{"position": "relative", "display": "flex", "justify-content": "space-between"}}>
                <Button
                  className={styles.nft_blue_button}
                  color="blue"
                  target="_blank"
                  href={props.detailsShop[item][5] + utm}
                >
                  Shop
                </Button>
                <Button
                  className={styles.nft_read_button}
                  target="_blank"
                  href={props.detailsShop[item][6]}
                >
                  Info
                </Button>
              </div>
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
