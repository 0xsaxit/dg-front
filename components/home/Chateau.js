import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Spinner from '../Spinner';
import Aux from '../_Aux';
import Fetch from '../../common/Fetch';
import MessageBox from './MessageBox';

const Chateau = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);
  const [isZooming, setZooming] = useState(true);
  const [realm, setRealm] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [total, setTotal] = useState('');
  const [visited, setVisited] = useState(false);
  const [videoPlay, setVideoPlay] = useState(true);

  useEffect(() => {
    if (window) {
      let visited = window.sessionStorage.getItem('visited');

      if (visited) {
        setVisited(true);
      } else {
        window.sessionStorage.setItem('visited', true);
      }

      if (window.innerWidth < 500) {
        setVideoPlay(false);
      } else {
        setVideoPlay(true);
      }
    }
  }, []);

  // fetch user count from the server API
  useEffect(() => {
    setLoading(true);

    (async function () {
      let response = await Fetch.USER_NUMBERS();
      let json = await response.json();
      let temp = [];

      // setTotalPlayers(json.totalPlayers);
      setRealm(json.chateau.topServerRealm.realm);
      setPlayerCount(json.chateau.topServerRealm.playerCount);
      setOnlineUsers(json.chateau.totalAddresses);
      setTotal(json.chateau.totalPlayers);

      for (const [index, value] of json.chateau.totalAddresses.entries()) {
        temp.push(json.chateau.totalAddresses[index]);
      }

      setOnlineUsers(temp);
      console.log('Total players: ' + total);

      setLoading(false);

      const timer = setTimeout(() => {
        setZooming(false);
      }, 800);

      return () => clearTimeout(timer);
    })();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function getContent() {
    return (
      <div className="home-dashboard">
        {isZooming ? (
          !visited ? (
            <span id="zoom-overlay" className="zoom-animation" />
          ) : null
        ) : null}

        {mainContent()}
      </div>
    );
  }

  function homeVideo() {
    return (
      <div className="home-video-container">
        <video
          src="https://res.cloudinary.com/dnzambf4m/video/upload/v1603235036/chateau_site_vid_ozjakq.mp4"
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
                  {total} player online in Chateau Satoshi
                </p>
              ) : (
                <p className="home-dashboard-p">
                  {total} players online in Chateau Satoshi
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
                    alt="Decentraland Avatar Image"
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
                    alt="Decentraland Avatar Image"
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

        {!state.userStatus ? (
          <div className="home-mission-content">
            <div className="home-dashboard-description">
              <h1
                className="home-dashboard-mission"
                style={{ marginBottom: '-12px' }}
              >
                Hit the tables in a virtual casino
              </h1>
              {/*<h2 className="home-dashboard-h2">
                Non-custodial. Provably fair.
              </h2>*/}
              <h2 className="home-dashboard-h2">
                Non-custodial, provably fair slots, roulette, blackjack, and
                backgammon playable with crypto in Decentraland
              </h2>
              <span className="logged-out-button-span">
                <ModalVideo />

                <Button
                  color="blue"
                  className="how-to-button"
                  target="_blank"
                  href="https://docs.decentral.games/getting-started"
                >
                  HOW TO PLAY
                </Button>
              </span>

              <span
                className="user-numbers-container-3"
                style={{ display: 'flex' }}
              >
                <div className="online-dot"></div>
                {!isLoading ? (
                  <span>
                    {total === 1 ? (
                      <p className="home-dashboard-p">
                        {total} player online
                      </p>
                    ) : (
                      <p className="home-dashboard-p">
                        {total} players online
                      </p>
                    )}
                  </span>
                ) : null}
              </span>

              {onlineUsers.length > 10 ? (
                <span style={{ display: 'flex', justifyContent: 'center' }} className="online-pics-mobile">
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
                          alt="Decentraland Avatar Image"
                        />
                        <p style={{ paddingTop: '21px' }}> + {onlineUsers.length - 10}</p>
                      </span>
                    );
                  })}
                </span>
              ) : (
                <span style={{ display: 'flex', justifyContent: 'center' }} className="online-pics-mobile">
                  {onlineUsers.map((onlineUser) => {
                    return (
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
                        alt="Decentraland Avatar Image"
                      />
                    );
                  })}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="home-dashboard-content">

            <p className="featured-casino-text">DECENTRAL GAMES PRESENTS</p>
            <h1 className="home-dashboard-h1" style={{ marginBottom: '-12px' }}>
              Chateau Satoshi
            </h1>
            <Button
              color="blue"
              className="play-button"
              href={`https://play.decentraland.org/?position=-75%2C77&realm=${realm}`}
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
              Chateau Satoshi is an art deco themed metaverse casino built by Decentral Games in Decentraland. Enjoy non-custodial slots, roulette, and blackjack playable with crypto.
            </p>

            {playerNumbers()}
          </div>
        )}
      </Aux>
    );
  }

  if (isLoading && !visited) {
    return <Spinner background={2} />;
  } else {
    return getContent();
  }
};

export default Chateau;
