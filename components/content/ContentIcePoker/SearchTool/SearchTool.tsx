import React, { FC, ReactElement, useContext, useState } from 'react';
import { GlobalContext } from '@/store';
import { Button } from 'semantic-ui-react';
import styles from './SearchTool.module.scss';
import cn from 'classnames';

enum TimePeriods {
  Weekly = 'week',
  Monthly = 'month',
  All = 'all'
}

export interface IceSearchToolType {
  className?: string;
}

const IceSearchTool: FC<IceSearchToolType> = ({ className = '' }: IceSearchToolType): ReactElement => {
  // get delegation data from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [time, setTime] = useState(TimePeriods.Weekly);

  function unlockPremium(): ReactElement {
    return (
      <section className={styles.unlock}>
        <div className={styles.unlock_img}>
          <img className={styles.search} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_39_e6ceyn.png" alt="search" />
          <img className={styles.lock} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858497/image_42_steaei.png" alt="lock" />
        </div>
        <h1 className={styles.unlock_title}>Look Up Any Player & Their History</h1>
        <p className={styles.unlock_description}>
          Unlock the ICE Poker player database to <br />
          discover and compare new potential delegates
        </p>
        <Button className={styles.blue_button}>Unlock Premium</Button>
      </section>
    );
  }

  function playerLookUpHeader(): ReactElement {
    return (
      <section className={styles.header}>
        <h1 className={styles.title}>Player Look Up</h1>

        {/* Filter by Timeline */}
        <div className={cn(styles.filter_pills, styles.timeline)}>
          <div
            className={time === TimePeriods.Weekly ? styles.active : null}
            onClick={() => {
              setTime(TimePeriods.Weekly);
            }}
          >
            Weekly
          </div>
          <div
            className={time === TimePeriods.Monthly ? styles.active : null}
            onClick={() => {
              setTime(TimePeriods.Monthly);
            }}
          >
            Monthly
          </div>
          <div
            className={time === TimePeriods.All ? styles.active : null}
            onClick={() => {
              setTime(TimePeriods.All);
            }}
          >
            All Time
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`ice-search-tool component ${className}`}>
      {state.userStatus < 28 ? <section className={styles.playerLookUp}>{playerLookUpHeader()}</section> : unlockPremium()}
    </section>
  );
};

export default IceSearchTool;
