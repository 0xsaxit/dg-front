import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Loader } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Spinner from '../Spinner';
import Aux from '../_Aux';
import Fetch from '../../common/Fetch';
import MessageBox from './MessageBox';

const Chateau = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(false);
  const [isZooming, setZooming] = useState(true);
  const [realm, setRealm] = useState('');
  const [playerCount, setPlayerCount] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [total, setTotal] = useState('');
  const [visited, setVisited] = useState(false);
  const [videoPlay, setVideoPlay] = useState(true);
  const [isLeadersLoading, setIsLeadersLoading] = useState(true)

  // temp
  const [spotOne, setSpotOne] = useState('');
  const [spotOneTotal, setSpotOneTotal] = useState('');
  const [spotOneAddress, setSpotOneAddress] = useState('');
  const [spotTwo, setSpotTwo] = useState('');
  const [spotTwoTotal, setSpotTwoTotal] = useState('');
  const [spotTwoAddress, setSpotTwoAddress] = useState('');
  const [spotThree, setSpotThree] = useState('');
  const [spotThreeTotal, setSpotThreeTotal] = useState('');
  const [spotThreeAddress, setSpotThreeAddress] = useState('');


  // fetch daily top 3 from the server API
  useEffect(() => {

    (async function () {
      let response = await Fetch.GAME_RECORDS();
      let json = await response.json();

      // clean up this jank
      setSpotOne(json.daily.all.play[0].name);
      setSpotTwo(json.daily.all.play[1].name);
      setSpotThree(json.daily.all.play[2].name);

      let toMana_1 = Math.round(json.daily.all.play[0].winnings / 1000000000000000000).toLocaleString();
      let toMana_2 = Math.round(json.daily.all.play[1].winnings / 1000000000000000000).toLocaleString();
      let toMana_3 = Math.round(json.daily.all.play[2].winnings / 1000000000000000000).toLocaleString();
      
      setSpotOneTotal(toMana_1);
      setSpotTwoTotal(toMana_2);
      setSpotThreeTotal(toMana_3);

      setSpotOneAddress(json.daily.all.play[0].address);
      setSpotTwoAddress(json.daily.all.play[1].address);
      setSpotThreeAddress(json.daily.all.play[2].address);

      setIsLeadersLoading(false);

    })();
  }, []);

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

  // // fetch user count from the server API
  // useEffect(() => {
  //   setLoading(true);

  //   (async function () {
  //     let response = await Fetch.USER_NUMBERS();
  //     let json = await response.json();
  //     let temp = [];

  //     // setTotalPlayers(json.totalPlayers);
  //     setRealm(json.chateau.topServerRealm.realm);
  //     setPlayerCount(json.chateau.topServerRealm.playerCount);
  //     setOnlineUsers(json.chateau.totalAddresses);
  //     setTotal(json.chateau.totalPlayers);

  //     for (const [index, value] of json.chateau.totalAddresses.entries()) {
  //       temp.push(json.chateau.totalAddresses[index]);
  //     }

  //     setOnlineUsers(temp);
  //     console.log('Total players: ' + total);
  //     setLoading(false);


  //     const timer = setTimeout(() => {
  //       setZooming(false);
  //     }, 800);

  //     return () => clearTimeout(timer);
  //   })();
  // }, []);

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

  // DON'T DELETE 

  // function playerNumbers() {
  //   return (
  //     <Aux>
  //       <span className="user-numbers-container-1" style={{ display: 'flex' }}>
  //         <div className="online-dot"></div>

  //         {!isLoading ? (
  //           <span>
  //             {total === 1 ? (
  //               <p className="home-dashboard-p">
  //                 {total} player online in Chateau Satoshi
  //               </p>
  //             ) : (
  //               <p className="home-dashboard-p">
  //                 {total} players online in Chateau Satoshi
  //               </p>
  //             )}
  //           </span>
  //         ) : null }
  //       </span>

  //       {onlineUsers.length > 10 ? (
  //         <span style={{ display: 'flex' }}>
  //           {onlineUsers.slice(0, 10).map((onlineUser) => {
  //             return (
  //               <span style={{ display: 'flex' }}>
  //                 <img
  //                   className="avatar-picture"
  //                   src={`https://events.decentraland.org/api/profile/${onlineUser}/face.png`}
  //                   style={{
  //                     marginTop: '15px',
  //                     marginRight: '12px',
  //                     width: '3rem',
  //                     height: '3rem',
  //                     display: 'flex',
  //                     border: '1px solid rgb(227, 232, 238)',
  //                     borderRadius: '100%',
  //                     boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
  //                     backgroundColor: 'white',
  //                   }}
  //                   alt="Decentraland Avatar Image"
  //                 />
  //                 <p style={{ paddingTop: '21px' }}> + {onlineUsers.length - 10}</p>
  //               </span>
  //             );
  //           })}
  //         </span>
  //       ) : (
  //         <span style={{ display: 'flex' }}>
  //           {onlineUsers.map((onlineUser) => {
  //             return (
  //               <div>
  //                 <img
  //                   className="avatar-picture"
  //                   src={`https://events.decentraland.org/api/profile/${onlineUser}/face.png`}
  //                   style={{
  //                     marginTop: '15px',
  //                     marginRight: '12px',
  //                     width: '3rem',
  //                     height: '3rem',
  //                     display: 'flex',
  //                     border: '1px solid rgb(227, 232, 238)',
  //                     borderRadius: '100%',
  //                     boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
  //                     backgroundColor: 'white',
  //                   }}
  //                   alt="Decentraland Avatar Image"
  //                 />
  //               </div>
  //             );
  //           })}
  //         </span>
  //       )}
  //     </Aux>
  //   );
  // }

  function dailyTopThree() {
    return (
      <Aux>
        <span className="daily-leaders-container">
          <p className="featured-casino-text" style={{ paddingBottom: '9px' }}>DAILY LEADERS</p>

          {isLeadersLoading ? (
            <div>
              <span className="leader-text-span">
                <span className="leaders-text" style={{ marginBottom: '6px' }}>
                  1.{' '}
                  <Loader active inline 
                    style={{
                      fontSize: '12px',
                      marginLeft: '3px',
                      marginTop: '2px',
                    }}
                  />
                </span>
              </span>

              <span className="leader-text-span">
                <span className="leaders-text" style={{ marginBottom: '6px' }}>
                  2.{' '}
                  <Loader active inline 
                    style={{
                      fontSize: '12px',
                      marginLeft: '3px',
                      marginTop: '2px',
                    }}
                  />
                </span>
              </span>

              <span className="leader-text-span">
                <span className="leaders-text">
                  3.{' '}
                  <Loader active inline 
                    style={{
                      fontSize: '12px',
                      marginLeft: '3px',
                      marginTop: '2px',
                    }}
                  />
                </span>
              </span>
            </div>
          ) : (
            <div>
              <span className="leader-text-span">
                <span className="leaders-text">
                  1.{' '}
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${spotOneAddress}/face.png`}
                    style={{
                      width: '24px',
                      marginRight: '9px',
                      marginLeft: '1px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow:
                        '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                      background: 'white'
                    }}
                  />
                </span>
                <p className="leaders-text lower"> {spotOne} </p>
                <p className="leaders-text lower" style={{ marginLeft: '6px', marginRight: '6px' }}> | </p>
                <p className="leaders-text lower" style={{ marginBottom: '18px' }}> {spotOneTotal} PLAY </p>
              </span>

              <span className="leader-text-span">
                <span className="leaders-text">
                  2.{' '}
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${spotTwoAddress}/face.png`}
                    style={{
                      width: '24px',
                      marginRight: '9px',
                      marginLeft: '1px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow:
                        '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                      background: 'white'
                    }}
                  />
                </span>
                <p className="leaders-text lower"> {spotTwo} </p>
                <p className="leaders-text lower" style={{ marginLeft: '6px', marginRight: '6px' }}> | </p>
                <p className="leaders-text lower" style={{ marginBottom: '18px' }}> {spotTwoTotal} PLAY </p>
              </span>

              <span className="leader-text-span">
                <span className="leaders-text">
                  3.{' '}
                  <img
                    className="avatar-picture"
                    src={`https://events.decentraland.org/api/profile/${spotThreeAddress}/face.png`}
                    style={{
                      width: '24px',
                      marginRight: '9px',
                      marginLeft: '1px',
                      verticalAlign: 'middle',
                      marginTop: '-2px',
                      border: '1px solid rgb(227, 232, 238)',
                      borderRadius: '100%',
                      boxShadow:
                        '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                      background: 'white'
                    }}
                  />
                </span>
                <p className="leaders-text lower"> {spotThree} </p>
                <p className="leaders-text lower" style={{ marginLeft: '6px', marginRight: '6px' }}> | </p>
                <p className="leaders-text lower"> {spotThreeTotal} PLAY </p>
              </span>
            </div>
          )}
        </span>
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
                style={{ marginBottom: '-15px' }}
              >
                Be the house in a community-owned metaverse casino
              </h1>
              <h2 className="home-dashboard-h2" style={{ marginBottom: '12px' }}>
                The decentral.games ecosystem is powered by $DG - earn $DG by playing games, providing liquidity and governing the house treasury.
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


              {/* DON'T DELETE 

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
              )}*/}
            </div>

            {dailyTopThree()}

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

            {/*{playerNumbers()}*/}
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
