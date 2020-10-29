import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Spinner from '../Spinner';
import Aux from '../_Aux';
import Fetch from '../../common/Fetch';
import MessageBox from './MessageBox';

const Tominoya = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);
  const [realm, setRealm] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [total, setTotal] = useState('');
  const [visited, setVisited] = useState(false);
  const [videoPlay, setVideoPlay] = useState(true);

  // fetch user count from the server API
  useEffect(() => {
    setLoading(true);

    (async function () {
      let response = await Fetch.USER_NUMBERS();
      let json = await response.json();
      let temp = [];

      // setTotalPlayers(json.totalPlayers);
      setRealm(json.tominoya.topServerRealm.realm);
      setPlayerCount(json.tominoya.topServerRealm.playerCount);
      setOnlineUsers(json.tominoya.totalAddresses);
      setTotal(json.tominoya.totalPlayers);

      for (const [index, value] of json.tominoya.totalAddresses.entries()) {
        temp.push(json.tominoya.totalAddresses[index]);
      }

      setOnlineUsers(temp);
      setLoading(false);
    })();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getContent() {
    return (
      <div className="home-dashboard">
        {mainContent()}
      </div>
    );
  }

  function homeVideo() {
    return (
      <div className="home-video-container-two">
        <video
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1599166597/DG_site_asy69z.mp4"
          type="video/mp4"
          frameBorder="0"
          autoPlay={videoPlay}
          loop
          muted
        ></video>
      </div>
    );
  }

  function playerNumbers() {
    return (
      <Aux>
        <span className="user-numbers-container-1" style={{ display: 'flex' }}>
          <div className="online-dot"></div>

          {!isLoading ? (
            <span>
              {total === 1 ? (
                <p className="home-dashboard-p">
                  {total} player online in Tominoya
                </p>
              ) : (
                <p className="home-dashboard-p">
                  {total} players online in Tominoya
                </p>
              )}
            </span>
          ) : null}
        </span>

        {onlineUsers.length > 10 ? (
          <span style={{ display: 'flex' }}>
            {onlineUsers.slice(0, 10).map((onlineUser) => {
              return (
                <span style={{ display: 'flex' }}>
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${onlineUser}/face.png`}
                    style={{
                      marginTop: '15px',
                      marginRight: '12px',
                      width: '3rem',
                      height: '3rem',
                      display: 'flex',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                      backgroundColor: 'white',
                    }}
                  />
                  <p style={{ paddingTop: '21px' }}> + {onlineUsers.length - 10}</p>
                </span>
              );
            })}
          </span>
        ) : (
          <span style={{ display: 'flex' }}>
            {onlineUsers.map((onlineUser) => {
              return (
                <div>
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${onlineUser}/face.png`}
                    style={{
                      marginTop: '15px',
                      marginRight: '12px',
                      width: '3rem',
                      height: '3rem',
                      display: 'flex',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                      backgroundColor: 'white',
                    }}
                  />
                </div>
              );
            })}
          </span>
        )}
      </Aux>
    );
  }

  function mainContent() {
    return (
      <Aux>
        {homeVideo()}

        <div className="home-dashboard-content">

          <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
          <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
            Tominoya
          </h1>
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
            className="how-to-button"
            target="_blank"
            href="https://docs.decentral.games/getting-started"
          >
            HOW TO PLAY
          </Button>
          <p className="home-dashboard-p" style={{ marginTop: '18px' }}>
            Tominoya is a Japanese-themed metaverse casino built by Decentral Games in Decentraland. Enjoy non-custodial slots, roulette, and blackjack playable with crypto.
          </p>

          {playerNumbers()}
        </div>

      </Aux>
    );
  }

  if (isLoading) {
    return <Spinner background={2} />;
  } else {
    return getContent();
  }
};

export default Tominoya;
