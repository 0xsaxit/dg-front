import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from 'store/index';
import cn from 'classnames';
import { Divider, Grid, Image } from 'semantic-ui-react';
import Spinner from 'components/Spinner';
import Countdown from 'react-countdown';
import Global from 'components/Constants';

import styles from './ComingEvents.module.scss';

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
  const getSentences = (str) => {
    var ss = str.match(/.*?[?!.]/g);
    var f = ss.slice(0, 1).join('!');
    return f;
  }

  const contentEvents = () => {
    return (
      <div>
        <div className={styles.account_other_tabs}>
          <span className={cn("d-flex justify-content-between")}>
            <p className={styles.content_event_title}>
              Featured Event
            </p>
            {eventOngoing ? (
              <p className={styles.content_event_title}>
                Next Event: Now
              </p>
            ) : (
              <span className={cn("d-flex")}>
                <p className={styles.content_event_title}>
                  Next Event:
                </p>
                <Countdown
                  className={styles.nft_other_h3_countdown2}
                  date={events[0].next_start_at}
                />
              </span>
            )}
          </span>
        </div>

        <div>
          <a href={events[0].url} className={styles.my_nft_container}>
            <span className={styles.featured_event_grid}>
              <Image className={styles.event_pic_featured} src={events[0].image} />

              <div className={styles.post_info_featured}>
                <h3 className={styles.nft_other_h3_featured}>
                  {events[0].name}
                </h3>
                <span className={styles.featured_info}>
                  <p className={styles.nfts_info}>{events[0].next_start_at}</p>
                </span>

                <Divider className={styles.events_featured_divider} />

                <p className={styles.events_featured_p}>
                  {getSentences(events[0].description)}
                </p>
                <span className={styles.events_featured_button}>
                  <button
                    color="blue"
                    className={styles.nft_button}
                    target="_blank"
                    href={events[0].url}
                  >
                    HOP IN
                  </button>
                  <button
                    className={styles.nft_read_button}
                    target="_blank"
                    href={`https://events.decentraland.org/en/?event=${events[0].id}`}
                  >
                    RSVP
                  </button>
                </span>
              </div>
            </span>
          </a>
        </div>

        <div className={styles.account_other_tabs}>
          <p className={styles.content_event_title}>
            All Events
          </p>
        </div>

        <Grid>
          {events.slice(1).map((event, i) => (
            <Grid.Column
              className={styles.leaderboard_column}
              computer={5}
              tablet={8}
              mobile={16}
              id="nine-nine-one"
              key={i}
            >
              <a href={event.url} className={styles.my_nft_container}>
                <div>
                  <span className={cn("d-flex justify-content-center")}>
                    <Image
                      className={styles.event_pic}
                      src={event.image}
                    />
                  </span>
                  <div className={styles.nft_description}>
                    <p className={styles.nft_other_h3}>{event.name}</p>
                    <span className={cn("d-flex justify-content-center")}>
                      <p className="nfts-info">{event.next_start_at}</p>
                    </span>

                    <Divider className={styles.nft_divider} />

                    <p className={styles.nft_other_p}>
                      {getSentences(event.description)}
                    </p>

                    <span className={cn("d-flex justify-content-between")}>
                      <button
                        className={styles.nft_button}
                        color="blue"
                        target="_blank"
                        href={event.url}
                      >
                        HOP IN
                      </button>
                      <button
                        className={styles.nft_read_button}
                        target="_blank"
                        href={`https://events.decentraland.org/en/?event=${event.id}`}
                      >
                        RSVP
                      </button>
                    </span>
                  </div>
                </div>
              </a>
            </Grid.Column>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <div className={styles.main_container}>
      {loading === true ? (
        <Spinner background={1} />
      ) : (
        <div className={styles.coming_events_container}>
          <div className={styles.page_container}>
            {contentEvents()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComingEvents;
