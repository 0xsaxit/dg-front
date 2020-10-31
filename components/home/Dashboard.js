import React, { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import ModalVideo from '../modal/ModalVideo';
import Spinner from '../Spinner';
import Aux from '../_Aux';
import Fetch from '../../common/Fetch';
import MessageBox from './MessageBox';

const Serenity = () => {
  // get user's onboard status the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local loading variable
  const [isLoading, setLoading] = useState(true);

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

  const [visited, setVisited] = useState(false);
  const [videoPlay, setVideoPlay] = useState(true);

  // fetch daily top 3 from the server API
  useEffect(() => {
    setLoading(false);

    (async function () {
      let response = await Fetch.GAME_RECORDS();
      let json = await response.json();

      // clean up this jank
      setSpotOne(json.all.all.mana[0].name);
      setSpotTwo(json.all.all.mana[1].name);
      setSpotThree(json.all.all.mana[2].name);

      let toMana_1 = Math.round(json.all.all.mana[0].winnings / 1000000000000000000).toLocaleString();
      let toMana_2 = Math.round(json.all.all.mana[1].winnings / 1000000000000000000).toLocaleString();
      let toMana_3 = Math.round(json.all.all.mana[2].winnings / 1000000000000000000).toLocaleString();
      
      setSpotOneTotal(toMana_1);
      setSpotTwoTotal(toMana_2);
      setSpotThreeTotal(toMana_3);

      setSpotOneAddress(json.all.all.mana[0].address);
      setSpotTwoAddress(json.all.all.mana[1].address);
      setSpotThreeAddress(json.all.all.mana[2].adress);

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
      <div className="home-video-container-three">
        <img
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1598490479/ezgif.com-optimize_1_fp44rx.gif"
          className="landing-gif"
        />
      </div>
    );
  }

  function mainContent() {
    return (
      <Aux>

        <div className="landing-gif-holder">
          <span className="daily-leaders-container">
            <p className="featured-casino-text" style={{ paddingBottom: '9px' }}>DAILY LEADERS</p>

            <span className="leader-text-span">
              <span className="leaders-text">
                1.{' '}
                <img
                  className="avatar-picture"
                  src={`https://events.decentraland.org/api/profile/${spotOneAddress}/face.png`}
                  style={{
                    width: '24px',
                    marginRight: '6px',
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
              <p style={{ marginLeft: '6px', marginRight: '6px', marginTop: '-7px' }}> | </p>
              <p className="leaders-text lower" style={{ marginBottom: '18px' }}> {spotOneTotal} MANA</p>
            </span>

            <span className="leader-text-span">
              <span className="leaders-text">
                2.{' '}
                <img
                  className="avatar-picture"
                  src={`https://events.decentraland.org/api/profile/${spotTwoAddress}/face.png`}
                  style={{
                    width: '24px',
                    marginRight: '6px',
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
              <p className="leaders-text lower"> {spotTwo}</p>
              <p style={{ marginLeft: '6px', marginRight: '6px', marginTop: '-7px' }}> | </p>
              <p className="leaders-text lower" style={{ marginBottom: '18px' }}> {spotTwoTotal} MANA</p>
            </span>

            <span className="leader-text-span">
              <span className="leaders-text">
                3.{' '}
                <img
                  className="avatar-picture"
                  src={`https://events.decentraland.org/api/profile/${spotThreeAddress}/face.png`}
                  style={{
                    width: '24px',
                    marginRight: '6px',
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
              <p style={{ marginLeft: '6px', marginRight: '6px', marginTop: '-7px' }}> | </p>
              <p className="leaders-text lower"> {spotThreeTotal} MANA</p>
            </span>
          </span>
        </div>

        <div 
          className="landing-content"
          style={{ backgroundColor: 'rgb(10, 10, 10)' }}
        >
          <div className="landing-description">
            <h1 className="home-dashboard-h1" >
              decentral.games
            </h1>
            <h2 className="landing-p" style={{ marginTop: '3px', maxWidth: '500px' }}>
              The first community-owned metaverse casino ecosystem.
            </h2>
            <h2 className="landing-i" style={{ marginTop: '18px', marginBottom: '18px' }}>
              Play games, mine $DG 
            </h2>
            <Button
              color="blue"
              className="play-button"
              style={{ marginRight: '30px' }}
            >
              HIT THE TABLES
            </Button>
            <Button
              color="blue"
              className="how-to-button"
              target="_blank"
              href="https://docs.decentral.games/getting-started"
            >
              LEARN ABOUT $DG
            </Button>
          </div>
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

export default Serenity;
