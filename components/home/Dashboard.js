import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Modal } from 'semantic-ui-react';
import Spinner from '../Spinner';
import Aux from '../_Aux';
import Global from '../Constants';

const Dashboard = (props) => {
  // get user's onboard status and usser countfrom the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);
  const [totalPlayers, setTotalPlayers] = useState('');
  const [realm, setRealm] = useState('');
  const [playerCount, setPlayerCount] = useState('');

  useEffect(() => {
    setLoading(false);
    (async function () {
      let response = await Global.FETCH.USER_NUMBERS();
      let json = await response.json();

      setRealm(json.topServerRealm.realm);
      setPlayerCount(json.topServerRealm.playerCount);
      setTotalPlayers(json.totalPlayers);

      console.log('Total players: ' + json.totalPlayers);
    })();
  }, []);

  useEffect(() => {
    if (state.userStatus) {
      console.log('User status: ' + state.userStatus);
    }
  }, [state.userStatus]);

  function getContent() {
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
          <div className="home-dashboard-content">
            <div>
              <div className="home-dashboard-description">
                <h3
                  className="home-dashboard-mission"
                  style={{ marginBottom: '-12px' }}
                >
                  Non-custodial casino games in virtual worlds
                </h3>
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
                <h3
                  className="home-dashboard-h3"
                  style={{ marginBottom: '-12px' }}
                >
                  Tominoya
                </h3>
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

  return (
    <Aux>
      {isLoading ? <Spinner background={2} /> : null}
      <div className="home-dashboard">{getContent()}</div>;
    </Aux>
  );
};

export default Dashboard;
