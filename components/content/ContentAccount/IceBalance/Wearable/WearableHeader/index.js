import React from 'react';
import { Button } from 'semantic-ui-react';

import TopRigthArrow from 'assets/svg/toprightarrow.svg';
import styles from './WearableHeader.module.scss';

const WearableHeader = () => {

  return (
    <div className={styles.wearableHeader}>
      <span>
        <h2>ICED Wearables</h2>
        <p>87% Max ICE Bonus</p>
      </span>
      <Button
        className={styles.open_sea}
        href="http://defi.atarichain.com/"
        target="_blank"
      >
        Buy On Open Sea
        <TopRigthArrow />
      </Button>
    </div>
  );
};

export default WearableHeader;
