import { useEffect, useContext, useState } from 'react';
import { isEmpty } from 'lodash';
import { GlobalContext } from 'store/index';
import Spinner from 'components/Spinner';
import ContentEvents from './ContentEvents';
import Global from 'components/Constants';

import styles from './ComingEvents.module.scss';

const ComingEvents = () => {
  // get DCL events data from the Context API store
  const [{ eventsData = {} }, dispatch] = useContext(GlobalContext);

  // define local variables
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventOngoing, setEventOngoing] = useState(false);

  useEffect(() => {
    if (!isEmpty(eventsData)) {
      const events = [];
      eventsData.data.map(event => {
        if (event.user === Global.ADDRESSES.DECENTRAL_GAMES_EVENTS) {
          const date = new Date(event.next_start_at);
          event.next_start_at = date.toUTCString().replace('GMT', 'UTC');
          events.push(event);
        }
      });

      const eventDate = new Date(eventsData.data[0].next_start_at).getTime();
      const currentDate = new Date().getTime();

      setEventOngoing(eventDate > currentDate);
      setEvents(events);
      setLoading(false);
    }
  }, [eventsData]);

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
