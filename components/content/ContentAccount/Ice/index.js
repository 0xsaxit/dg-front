import React from 'react';
import Aux from 'components/_Aux';
import { Button } from 'semantic-ui-react';
import styles from './Ice.module.scss';

function ICE({ state }) {
  // define local variables
  return (
    <Aux>
      <div className={styles.ice}>
        <div className={styles.ice_container}>
          <img
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631007583/Group_190_qjjjgr.png"
            className={styles.ice_img}
          />
          <p className={styles.play_text}> Play-to-Earn with ICE Wearables </p>
          <p className={styles.play_lower}>
            {' '}
            Purchase ICE wearables and earn real cash value from free-to-play
            metaverse poker.{' '}
          </p>
          <span className={styles.button_span}>
            <Button className={styles.button_right} href="/games/ice">
              Browse Wearables
            </Button>
            {/* <ModalMint className={styles.right_button} ethPrice={0.3} /> */}
          </span>
        </div>
      </div>
    </Aux>
  );
}

export default ICE;
