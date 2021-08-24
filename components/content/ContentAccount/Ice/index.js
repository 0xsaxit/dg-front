import React from 'react';
import cn from 'classnames';
import Aux from 'components/_Aux';
import ModalWearable from 'components/modal/ModalWearable';
import ModalMint from 'components/modal/ModalMint';

import styles from './Ice.module.scss';

function ICE({ state }) {
  // define local variables
  return (
    <Aux>
      <div className={styles.ice_container}>
        <img
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713505/Group_191_pk1eoo.png"
          className={styles.ice_img}
        />
        <p className={styles.play_text}> Play-to-Earn with ICE Wearables </p>
        <p className={styles.play_lower}>
          {' '}
          Purchase ICE wearables and earn real cash value from free-to-play
          metaverse poker.{' '}
        </p>
        <span className={styles.button_span}>
          <button className={cn('btn', styles.left_button)}>Browse</button>
          <ModalMint className={styles.right_button} ethPrice={0.3} />
          {/* <ModalWearable /> */}
        </span>
      </div>
    </Aux>
  );
}

export default ICE;
