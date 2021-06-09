import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../../store/index';
import { Button, Divider, Grid, Image } from 'semantic-ui-react';
import Spinner from '../Spinner';
import Countdown from 'react-countdown';
import Global from '../Constants';

const ComingEvents = () => {
  // get DCL events data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventOngoing, setEventOngoing] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (Object.keys(state.eventsData).length !== 0) {
      let events = [];
      let i;

      for (i = 0; i < state.eventsData.data.length; i++) {
        if (
          state.eventsData.data[i].user ==
          Global.ADDRESSES.DECENTRAL_GAMES_EVENTS
        ) {
          const date = new Date(state.eventsData.data[i].next_start_at);
          state.eventsData.data[i].next_start_at = date
            .toUTCString()
            .replace('GMT', 'UTC');
          events.push(state.eventsData.data[i]);
        }
      }

      const event_date = new Date(
        state.eventsData.data[0].next_start_at
      ).getTime();
      const current_date = new Date().getTime();

      if (event_date > current_date) {
        setEventOngoing(true);
      } else {
        setEventOngoing(false);
      }

      setEvents(events);
      setLoading(false);
    }
  }, [state.eventsData]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  function getSentences(str) {
    var ss = str.split('!');
    var f = ss.slice(0, 1).join('!') + '!';
    return f;
  }

  function contentEvents() {
    return (
      <span>
        <div
          className="account-other-tabs"
          style={{ paddingTop: '15px', marginBottom: '-16px' }}
        >
          <div style={{ marginLeft: '0px' }}>
            <span style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span 
                style={{ 
                  margin: '100px 0px 0px 0px',
                  fontSize: '24px',
                  fontFamily: 'Larsseit-ExtraBold',
                  margin: '90px 0px 0px 0px',
                  color: 'white'
                }}
              >
                Featured Event
              </span>
              {eventOngoing ? (
                <span 
                  style={{ 
                    margin: '100px 0px 0px 0px',
                    fontSize: '24px',
                    fontFamily: 'Larsseit-ExtraBold',
                    margin: '90px 0px 0px 0px',
                    color: 'white'
                  }}
                >
                  Next Event: Now
                </span>
              ) : (
                <span style={{ display: 'flex' }}>
                  <span 
                    style={{ 
                      margin: '100px 0px 0px 0px',
                      fontSize: '24px',
                      fontFamily: 'Larsseit-ExtraBold',
                      margin: '90px 0px 0px 0px',
                      color: 'white'
                    }}
                  >
                    Next Event:
                  </span>
                  <Countdown
                    className="nft-other-h3 countdown2"
                    date={events[0].next_start_at}
                  />
                </span>
              )}
            </span>
          </div>
        </div>

        <div>
          <a href={events[0].url} className="my-nft-container">
            <span className="featured-event-grid">
              <Image src={events[0].image} className="event-pic featured" />

              <div className="post-info featured">
                <h3
                  className="nft-other-h3 featured"
                  style={{
                    paddingBottom: '9px',
                    paddingTop: '9px',
                  }}
                >
                  {events[0].name}
                </h3>
                <span className="featured-info">
                  <p className="nfts-info">{events[0].next_start_at}</p>
                </span>

                <Divider
                  className="events-featured-divider"
                  style={{ margin: '10px 0px 15px 0px' }}
                />

                <p
                  style={{
                    lineHeight: '1.3',
                    paddingTop: '3px',
                  }}
                  className="events-featured-p"
                >
                  {getSentences(events[0].description)}
                </p>
                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingTop: '0px',
                    paddingBottom: '39px',
                  }}
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

        <div className="account-other-tabs">
          <div style={{ marginLeft: '0px' }}>
            <span 
              style={{ 
                fontSize: '24px',
                fontFamily: 'Larsseit-ExtraBold',
                margin: '48px 0px -12px 0px',
                color: 'white',
                float: 'left'
              }}
            >
              All Events
            </span>
          </div>
        </div>

        <Grid>
          {events.slice(1).map((event, i) => (
            <Grid.Column
              computer={5}
              tablet={8}
              mobile={16}
              className="leaderboard-column"
              id="nine-nine-one"
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
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
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

export default ComingEvents;
