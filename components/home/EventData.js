import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid, Icon, Image } from 'semantic-ui-react';
import Global from '../Constants';
import Fetch from '../../common/Fetch';


const EventData = () => {
  console.log('hello');
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [wearables, setWearables] = useState([]);

  useEffect(() => {
    (async function () {
      // get user nfts statistics
      let response = await Fetch.EVENTS();
      let json = await response.json();

      var events = [];
      var i;

      console.log('!!!!');
      console.log(json);

      for (i = 0; i < json.data.length; i++) {
        if (json.data[i].user == "0xe2be94b59a3a4aef2f66eb0dd73079da00315bf0") {
          events.push(json.data[i]);
        }
      }

      setEvents(events);
      console.log(events);
    })();
  }, []);

  function getFormattedDate() {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    var d = new Date();
    return monthNames[d.getMonth()] + ' ' + d.getDate();
  }

  function getSentences(str) {
    var ss = str.split('!');
    var f = ss.slice(0, 1).join('!') + '!';
    return f;
  }

  useEffect(() => {
    (async function () {
      // get user nfts statistics
      let response = await Fetch.NFTS_1('0xe2be94b59a3a4aef2f66eb0dd73079da00315bf0');
      let json = await response.json();

      let response_2 = await Fetch.NFTS_2('0xe2be94b59a3a4aef2f66eb0dd73079da00315bf0');
      let json_2 = await response_2.json();

      var wearables = [];
      var i;
      var j;

      for (i = 0; i < json.assets.length; i++) {
        wearables.push(json.assets[i]);
      }

      for (j = 0; j < json_2.assets.length; j++) {
        wearables.push(json_2.assets[j]);
      }

      setWearables(wearables);
    })();
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentWearables() {
    return (
      <Grid>
        {wearables.map((wearable, i) => (
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="leaderboard-column"
            key={i}
          >
            <a href={wearable.permalink} className="my-nft-container">
              <div>
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="nft-image"
                >
                  <Image
                    src={wearable.image_url}
                    className="nft-pic"
                    style={{ borderRadius: '4px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">{wearable.name}</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className="nfts-info">{wearable.asset_contract.name}</p>
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
                    {wearable.description}
                  </p>

                  <span
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      color="blue"
                      className="nft-button"
                      target="_blank"
                      href={wearable.permalink}
                    >
                      SELL NFT
                    </Button>
                    <Button
                      className="nft-read-button"
                      target="_blank"
                      href={wearable.permalink}
                    >
                      READ MORE
                    </Button>
                  </span>
                </div>
              </div>
            </a>
          </Grid.Column>
        ))}
      </Grid>
    );
  }


  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentEvents() {
    return (
      <Grid>
        {events.map((event, i) => (
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className="leaderboard-column"
            id='nine-nine-one'
            key={i}
          >
            <a href={event.url} className="my-nft-container">
              <div>
                <span
                  style={{ display: 'flex', justifyContent: 'center' }}
                  className="event-image"
                >
                  <Image
                    src={event.image}
                    className="event-pic"
                    style={{ borderRadius: '4px 4px 0px 0px' }}
                  />
                </span>
                <div className="nft-description">
                  <h3 className="nft-other-h3">{event.name}</h3>
                  <span style={{ display: 'flex', justifyContent: 'center' }}>
                    <p className="nfts-info"> going: {event.total_attendees}</p>
                    <p className="nfts-info-2">{getFormattedDate(event.next_start_at)}</p>
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
                    {getSentences(event.description)}
                  </p>

                  <span
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Button
                      color="blue"
                      className="nft-button"
                      target="_blank"
                      href={event.url}
                    >
                      HOP IN
                    </Button>
                    <Button
                      className="nft-read-button"
                      target="_blank"
                      href={`https://events.decentraland.org/en/?event=${event.id}`}
                    >
                      RSVP
                    </Button>
                  </span>
                </div>
              </div>
            </a>
          </Grid.Column>
        ))}
      </Grid>
    );
  }

  return (
    <div className="main-container" style={{ padding: '96px 0px 0px 0px' }}>
      <div className="page-container" style={{ padding: '0px 30px 120px 30px' }}>
        {contentEvents()}
        {contentWearables()}
      </div>
    </div>
  );
};

export default EventData;