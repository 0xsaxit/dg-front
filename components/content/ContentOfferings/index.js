import { Image, Button, Divider } from 'semantic-ui-react';
import { useState, useContext, useEffect } from 'react';
import styles from './ContentOfferings.module.scss';
import { GlobalContext } from '../../../store';
import ModalMintActivation from 'components/modal/ModalMintActivation';
import ModalMintWearable from 'components/modal/ModalMintWearable';
import ModalLoginICE from 'components/modal/ModalLoginICE'

const ContentOfferings = props => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [utm, setUtm] = useState('');
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

  let buttonGames1 = '';
  let buttonGames2 = '';
  let buttonGames3 = '';
  let buttonGames4 = '';
  let buttonCasinos1 = '';
  let buttonCasinos2 = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

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
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsGames).map((item, i) => (
          <a
            href={props.detailsGames[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <img
              src={props.detailsGames[item][0]}
              className={styles.nft_image}
            />
            <div className={styles.nft_description}>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className={styles.nft_info}>
                  {props.detailsGames[item][4]}
                </p>
                <p className={styles.nft_info}>
                  {props.detailsGames[item][5]}
                </p>
              </span>
              <h3 className={styles.nft_h3}>{props.detailsGames[item][2]}</h3>
              <p className={styles.nft_p}>{props.detailsGames[item][3]}</p>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsGames[item][6] + utm}
                >
                  Play Now
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
  function buyNFTs() {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsNFTs).map((item, i) => (
          <a
            href={props.detailsNFTs[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <img
              src={props.detailsNFTs[item][0]}
              className={styles.nft_image}
            />
            <div className={styles.nft_description}>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className={styles.nft_info}>
                  {props.detailsNFTs[item][4]}
                </p>
                {props.detailsNFTs[item][5] == 'Blackjack' ? (
                  <p className={styles.nft_info}>
                    {props.detailsNFTs[item][5]}
                  </p>
                ) : (
                  null
                )}
              </span>
              <p className={styles.nft_other_p}>{props.detailsNFTs[item][3]}</p>
              <h3 className={styles.nft_other_h3}>{props.detailsNFTs[item][2]}</h3>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsNFTs[item][6] + utm}
                >
                  Purchase Item
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
  function buyICE() {
    return (
      <section>
        <div className={styles.header}>
          <h1>ICE Wearables Marketplace</h1>
          <p className={styles.marketplace_p}>
            ICE Wearables give you table access to free to play, play-to-earn
            poker. Learn more by <a href="/">clicking here.</a>
          </p>
        </div>

        <div className={styles.outter_games_container}>
          {Object.keys(props.detailsICE).map((item, i) => (
            <div className={styles.games_container}>
              <div className={styles.p2e_enabled}>
                <div>
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640051/p2e_enabled_wgqui5.svg"
                    className={styles.p2e_enabled_img}
                  />
                  <Image
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg"
                    className={styles.p2e_info_img}
                  />
                </div>
              </div>
              <img
                className={styles.nft_image}
                src={props.detailsICE[item][0]}
              />
              <div className={styles.nft_description}>
                <span style={{ display: 'flex', justifyContent: 'center' }}>
                  <p className={styles.nft_info}>
                    {props.detailsICE[item][3]}
                  </p>
                  <p className={styles.nft_info}>
                    {props.detailsICE[item][4]}
                  </p>

                </span>
                <p className={styles.nft_other_p}>{props.detailsICE[item][2]}</p>
                <h3 className={styles.nft_other_h3}>{props.detailsICE[item][1]}</h3>

                {state.userStatus ? (
                  <ModalMintWearable
                    className={styles.right_button}
                    wearableImg={props.detailsICE[item][0]}
                    wearableBodyType={props.detailsICE[item][3]}
                    wearableBodyImg={props.detailsICE[item][5]}
                    wearableName={props.detailsICE[item][1]}
                  />
                ) : (
                  <ModalLoginICE />
                )}

                {/* <ModalMintActivation /> */}
                {/* <ActivateWearableModal /> */}
                {/* <ModalActivationSuccess setPending={false} /> */}

              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentCasinos() {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsCasinos).map((item, i) => (
          <a
            href={props.detailsCasinos[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <img
              src={props.detailsCasinos[item][0]}
              className={styles.nft_image}
            />
            <div className={styles.nft_description}>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className={styles.nft_info}>
                  {props.detailsCasinos[item][4]}
                </p>
                {props.detailsCasinos[item][5] == 'Blackjack' ? (
                  <p className={styles.nft_info}>
                    {props.detailsCasinos[item][5]}
                  </p>
                ) : (
                  null
                )}
                {props.detailsCasinos[item][7] ? (
                  <p className={styles.nft_info}>
                    {props.detailsCasinos[item][6]}
                  </p>
                ) : (
                  null
                )}
              </span>
              <h3 className={styles.nft_h3}>{props.detailsCasinos[item][2]}</h3>
              <p className={styles.nft_p}>{props.detailsCasinos[item][3]}</p>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsCasinos[item][6] + utm}
                >
                  Play Now
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
  function contentShop() {
    return (
      <div className={styles.outter_games_container}>
        {Object.keys(props.detailsShop).map((item, i) => (
          <a
            href={props.detailsShop[item][6] + utm}
            target="_blank"
            className={styles.games_container}
          >
            <img
              src={props.detailsShop[item][0]}
              className={styles.nft_image}
            />
            <div className={styles.nft_description}>
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <p className={styles.nft_info}>
                  {props.detailsShop[item][4]}
                </p>
                {props.detailsShop[item][5] == 'Blackjack' ? (
                  <p className={styles.nft_info}>
                    {props.detailsShop[item][5]}
                  </p>
                ) : (
                  null
                )}
              </span>
              <h3 className={styles.nft_h3}>{props.detailsShop[item][2]}</h3>
              <p className={styles.nft_p}>{props.detailsShop[item][3]}</p>

              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Button
                  id={`play-now-button-games-${i + 1}`}
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={props.detailsShop[item][5] + utm}
                >
                  Visit Store
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
  } else if (props.gameState === 'ice') {
    return buyICE();
  } else if (props.gameState === 'casinos') {
    return contentCasinos();
  } else if (props.gameState === 'shop') {
    return contentShop();
  }
};

export default ContentOfferings;
