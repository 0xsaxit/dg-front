import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Spinner from '../Spinner';
import Global from '../Constants';

const Dashboard = (props) => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);
  const [isZooming, setZooming] = useState(true);
  // const [totalPlayers, setTotalPlayers] = useState('');
  const [realm, setRealm] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    if (window) {
      let visited = window.sessionStorage.getItem('visited');

      if (visited) {
        setVisited(true);
      } else {
        window.sessionStorage.setItem('visited', true);
      }
    }
  }, []);

  // fetch user count from the server API
  useEffect(() => {
    setLoading(true);

    (async function () {
      let response = await Global.FETCH.USER_NUMBERS();
      let json = await response.json();

      // setTotalPlayers(json.totalPlayers);
      setRealm(json.topServerRealm.realm);
      setPlayerCount(json.topServerRealm.playerCount);
      console.log('Total players: ' + json.totalPlayers);

      setLoading(false);

      const timer = setTimeout(() => {
        setZooming(false);
      }, 800);

      return () => clearTimeout(timer);
    })();
  }, []);

  useEffect(() => {
    if (state.userStatus) {
      console.log('User status: ' + state.userStatus);
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getContent() {
    return (
      <div className="home-dashboard">
        {isZooming === true ? (
          visited === false ? (
            <span id="zoom-overlay" className="zoom-animation" />
          ) : null
        ) : null}

        {mainContent()}
      </div>
    );
  }

  function mainContent() {
    return (
      <div>
        <div className="home-video-container">
          <video
            id="myVideo"
            src="https://res.cloudinary.com/dnzambf4m/video/upload/v1590041720/dg_site_vid_1_ytcfka.mp4"
            type="video/mp4"
            frameBorder="0"
            autoPlay={true}
            loop
            muted
            className="home-dashboard-video"
          ></video>
        </div>

        {!state.userStatus ? (
          <div className="home-mission-content">
            <div>
              <div className="home-dashboard-description">
                <h1
                  className="home-dashboard-mission"
                  style={{ marginBottom: '-12px' }}
                >
                  Hit the tables in a virtual casino
                </h1>
                <h2 className="home-dashboard-h2">
                  Non-custodial slots, roulette, blackjack, and backgammon
                  playable with crypto in Decentraland
                </h2>
                <div>
                  <Button
                    color="blue"
                    className="how-to-button"
                    target="_blank"
                    href="https://docs.decentral.games/getting-started"
                  >
                    HOW TO PLAY
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {state.userStatus ? (
          <div className="home-dashboard-content">
            <div>
              <div>
                <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
                <h1
                  className="home-dashboard-h1"
                  style={{ marginBottom: '-12px' }}
                >
                  Tominoya
                </h1>
                <div>
                  <Button
                    color="blue"
                    className="play-button"
                    href={`https://play.decentraland.org/?position=-120%2C135&realm=${realm}`}
                    target="_blank"
                    style={{ marginRight: '30px' }}
                  >
                    PLAY NOW
                  </Button>
                  <Button
                    color="blue"
                    className="play-shimmer"
                    target="_blank"
                    href="https://docs.decentral.games/getting-started"
                  >
                    HOW TO PLAY
                  </Button>
                </div>
                <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
                  Tominoya is a virtual casino built by Decentral Games in
                  Decentraland. Enjoy non-custodial slots, roulette, and
                  blackjack playable with crypto.
                </p>

                <span
                  className="user-numbers-container-1"
                  style={{ display: 'flex' }}
                >
                  <p className="online-dot">•</p>
                  <p className="home-dashboard-p">
                    {' '}
                    {playerCount} online in {realm}{' '}
                  </p>
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  if (isLoading === true && visited === false) {
    return <Spinner background={2} />;
  } else {
    return getContent();
  }
};

export default Dashboard;
