import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid, Icon, Image } from 'semantic-ui-react';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import Spinner from '../Spinner';
import Countdown from 'react-countdown';


const EventData = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async function () {
      // get events from dcl
      let response = await Fetch.EVENTS(state.userAddress);
      let json = await response.json();

      var events = [];
      var temp = [];
      var i;

      for (i = 0; i < json.data.length; i++) {
        if (json.data[i].user == "0x154620ddfdcd6ab15dd9c1682386debad1eef536") {
          var date = new Date(json.data[i].next_start_at);
          json.data[i].next_start_at = date.toUTCString().replace("GMT", "UTC");
          events.push(json.data[i]);
        }
      }

      setEvents(events);
      setLoading(false);
    })();
  }, []);

  function getSentences(str) {
    var ss = str.split('!');
    var f = ss.slice(0, 1).join('!') + '!';
    return f;
  }

  // // Renderer callback with condition
  // const renderer = ({ days, hours, minutes, seconds }) => {
  //   // Render a countdown
  //   if (days) {
  //     return (
  //       <span className="nft-other-h3 countdown2">
  //         {days} days, {hours} hours, {minutes} minutes, {seconds} seconds
  //       </span>
  //     );
  //   } else {
  //     return (
  //       <span className="nft-other-h3 countdown3">
  //         {hours} hours, {minutes} minutes, {seconds} seconds
  //       </span>
  //     );
  //   }
  // };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function contentEvents() {
    return (
      <span>

        <div className="account-other-tabs" style={{ paddingTop: '15px' }}>
          <div style={{ marginLeft: '0px' }}>
            <span className="account-other-p" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="account-hover active events">
                <b>FEATURED EVENT</b>
              </span>
              <span style={{ display: 'flex' }}>
                <h3 className="nft-other-h3 countdown1"> Next Event:</h3>
                <Countdown 
                  className="nft-other-h3 countdown2"
                  date={events[0].next_start_at}
                />
              </span>
            </span>
          </div>
        </div>

        <Divider className="tab-divider" style={{ marginBottom: '35px' }} />

        <div>
          <a href={events[0].url} className="my-nft-container">
            <span className="featured-event-grid">
              <Image src={events[0].image} className="event-pic featured" />

              <div className="post-info featured">
                <h3
                  className="nft-other-h3 featured"
                  style={{
                    paddingBottom: '9px',
                    paddingTop: '9px'
                  }}
                >
                  {events[0].name}
                </h3>
                <span className="featured-info">
                  <p className="nfts-info">
                    {events[0].next_start_at}
                  </p>
                </span>

                <Divider className="events-featured-divider" style={{ margin: '10px 0px 15px 0px' }}/>

                <p
                  style={{
                    lineHeight: '1.3',
                    paddingTop: '3px'
                  }}
                  className="events-featured-p"
                >
                  {getSentences(events[0].description)}
                </p>
                <span
                  style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0px', paddingBottom: '39px' }}
                >
                  <Button
                    color="blue"
                    className="nft-button"
                    target="_blank"
                    href={events[0].url}
                  >
                    HOP IN
                  </Button>
                  <Button
                    className="nft-read-button"
                    target="_blank"
                    href={`https://events.decentraland.org/en/?event=${events[0].id}`}
                  >
                    RSVP
                  </Button>
                </span>
              </div>
            </span>
          </a>
        </div>

        <div className="account-other-tabs" style={{ marginTop: '30px' }}>
          <div style={{ marginLeft: '0px' }}>
            <span className="account-other-p" style={{ display: 'flex' }}>
              <span className="account-hover active events">
                <b>ALL EVENTS</b>
              </span>
            </span>
          </div>
        </div>

        <Divider className="tab-divider" />

        <Grid>
          {events.slice(1).map((event, i) => (
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
                      <p className="nfts-info">{event.next_start_at}</p>
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
      </span>
    );
  }

  return (
    <div className="main-container">
      {loading === true ? (
        <Spinner background={1} />
      ) : (
        <div className="page-container" id="event-container">
          {contentEvents()}
        </div>
      )}
    </div>
  );
};

export default EventData;