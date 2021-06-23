import React from 'react';
import Countdown from 'react-countdown';
import cn from 'classnames';
import { Button, Grid, Image } from 'semantic-ui-react';

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
                <span className={styles.title}>Next Event in:&nbsp;</span>
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
              <span className={styles.featured_info}>
                {events[0].next_start_at}
              </span>

              <h3 className={cn(styles.event_title, styles.featured)}>
                {events[0].name}
              </h3>

              <p className={styles.events_featured_p}>
                {getSentences(events[0].description)}
              </p>

              <span className={styles.button_group}>
                <Button
                  className={styles.nft_read_button}
                  target="_blank"
                  href={`https://events.decentraland.org/en/?event=${events[0].id}`}
                >
                  Learn More
                </Button>
                <Button
                  color="blue"
                  className={styles.nft_button}
                  target="_blank"
                  href={events[0].url}
                >
                  Go To Location
                </Button>
              </span>
            </div>
          </span>
        </a>
      </div>

      <div className={styles.account_other_tabs}>
        <div className="ml-0">
          <span className={styles.all_events}>All Upcoming Events</span>
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
                <span>
                  <Image src={event.image} className={styles.event_pic} />
                </span>
                <div className={styles.nft_description}>
                  <span>{event.next_start_at}</span>
                  <h3 className={styles.event_title}>{event.name}</h3>

                  <p className={styles.event_description}>
                    {getSentences(event.description)}
                  </p>

                  <div className="mt-auto d-flex justify-content-between">
                    <Button
                      className={styles.nft_read_button}
                      target="_blank"
                      href={`https://events.decentraland.org/en/?event=${event.id}`}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </a>
          </Grid.Column>
        ))}
      </Grid>
    </span>
  );
};

export default ContentEvents;
