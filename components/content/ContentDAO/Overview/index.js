import React from 'react';
import cn from 'classnames';
import { Grid, Image } from 'semantic-ui-react';
import Aux from 'components/_Aux';
import styles from './Overview.module.scss';

function Overview({ state }) {
  // define local variables
  return (
    <Aux>
      <div className={styles.overview_container}>
        <div className={styles.container_left}>
          <p className={styles.welcome_text}>
            Welcome Name,
          </p>
          <h1 className={styles.dashboard_text}>
            Your DAO Dashboard
          </h1>
        </div>
      </div>
    </Aux>
  );
}

export default Overview;