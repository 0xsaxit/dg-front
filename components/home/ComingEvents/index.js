import { useEffect, useContext, useState } from 'react';
import Countdown from 'react-countdown';
import cn from 'classnames';
import { Button, Divider, Grid, Image } from 'semantic-ui-react';
import { GlobalContext } from 'store/index';
import Spinner from 'components/Spinner';
import Global from 'components/Constants';

import styles from './ComingEvents.module.scss';

function getSentences(str) {
  const ss = str.match(/.*?[?!.]/g);
  const f = ss.slice(0, 1).join('!');
  return f;
}

const ContentEvents = ({ events, eventOngoing }) => {
  return (
    <span className={styles.custom_events}>
      <div className={styles.account_other_tabs}>
        <div className="ml-0">
          <span className="d-flex justify-content-between">
            {eventOngoing ? (
              <span className={styles.title}>Next Event: Now</span>
            ) : (
              <span className="d-flex">
                <span className={styles.title}>Next Event:</span>
                <Countdown
                  className={styles.countdown}
                  date={events[0].next_start_at}
                />
              </span>
            )}
          </span>
        </div>
      </div>

      <div>
        <a href={events[0].url} className={styles.nft_container}>
          <span className={styles.featured_event_grid}>
            <Image
              src={events[0].image}
              className={cn(styles.event_pic, styles.featured)}
            />

            <div className={cn(styles.post_info, styles.featured)}>
              <h3 className={cn(styles.nft_other_h3, styles.featured)}>
                {events[0].name}
              </h3>
              <span className={styles.featured_info}>
                <p className={styles.nfts_info}>{events[0].next_start_at}</p>
              </span>

              <Divider className={styles.events_featured_divider} />

              <p className={styles.events_featured_p}>
                {getSentences(events[0].description)}
              </p>
              <span className={styles.button_group}>
                <Button
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={events[0].url}
                >
                  HOP IN
                </Button>
                <Button
                  className={styles.nft_read_button}
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

      <div className={styles.account_other_tabs}>
        <div className="ml-0">
          <span className={styles.all_events}>All Events</span>
        </div>
      </div>

      <Grid>
        {events.slice(1).map((event, i) => (
          <Grid.Column
            computer={5}
            tablet={8}
            mobile={16}
            className={styles.leaderboard_column}
            key={i}
          >
            <a href={event.url} className={styles.nft_container}>
              <div>
                <span className="d-flex justify-content-center">
                  <Image src={event.image} className={styles.event_pic} />
                </span>
                <div className={styles.nft_description}>
                  <h3 className={styles.nft_other_h3}>{event.name}</h3>
                  <span className="d-flex justify-content-center">
                    <p className={styles.nfts_info}>{event.next_start_at}</p>
                  </span>

                  <Divider className={styles.divider} />

                  <p className={styles.nft_other_p}>
                    {getSentences(event.description)}
                  </p>

                  <span className="d-flex justify-content-between">
                    <Button
                      color="blue"
                      className={styles.nft_button}
                      target="_blank"
                      href={event.url}
                    >
                      HOP IN
                    </Button>
                    <Button
                      className={styles.nft_read_button}
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
};

const ComingEvents = () => {
  // get DCL events data from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventOngoing, setEventOngoing] = useState(false);

  useEffect(() => {
    if (Object.keys(state.eventsData).length !== 0) {
      const events = [];
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

      const eventDate = new Date(
        state.eventsData.data[0].next_start_at
      ).getTime();
      const currentDate = new Date().getTime();

      setEventOngoing(eventDate > currentDate);
      setEvents(events);
      setLoading(false);
    }
  }, [state.eventsData]);

  return (
    <div className={styles.main_container}>
      {loading === true ? (
        <Spinner background={1} />
      ) : (
        <div className={styles.page_container}>
          <ContentEvents eventOngoing={eventOngoing} events={events} />
        </div>
      )}
    </div>
  );
};

export default ComingEvents;
