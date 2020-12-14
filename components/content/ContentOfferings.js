import { Image, Button, Divider } from 'semantic-ui-react';

const ContentOfferings = (props) => {
  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentGames() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsGames).map((item, i) => (
          <a
            href="https://play.decentraland.org/?position=-120%2C135"
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
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsGames[item][6]}
                >
                  PLAY NOW
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsGames[item][7]}
                >
                  READ MORE
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
  function contentCasinos() {
    return (
      <div className="outter-games-container">
        {Object.keys(props.detailsCasinos).map((item, i) => (
          <a
            href="https://play.decentraland.org/?position=-120%2C135"
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
                  color="blue"
                  className="nft-button"
                  target="_blank"
                  href={props.detailsCasinos[item][5]}
                >
                  PLAY NOW
                </Button>
                <Button
                  className="nft-read-button two"
                  target="_blank"
                  href={props.detailsCasinos[item][6]}
                >
                  READ MORE
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
  } else if (props.gameState === 'casinos') {
    return contentCasinos();
  }
};

export default ContentOfferings;
