import React from 'react';
import cn from 'classnames';
import Aux from 'components/_Aux';
import styles from './WearableBody.module.scss';
import WearableHeader from 'components/content/ContentAccount/IceBalance/Wearable/WearableHeader';
import ModalWearable from 'components/modal/ModalWearable';
import ModalMint from 'components/modal/ModalMint';
import ICEDWearableCard from 'components/modal/ICEDWearableCard';

function WearableBody({ state }) {
  // define local variables
  return (
    <Aux>
      <div className={styles.wearable}>
        <WearableHeader />
        {state.userStatus ? (
          <div className={cn("row", styles.wearable_card_container)}>
            <div className={cn("col-lg-4 col-md-4 col-sm-6 col-xs-12", styles.wearable_card)}>
              <ICEDWearableCard
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1630855008/bg_6_bc0ssa.png"
                desc="20% Max ICE Bonus"
                text="ICE Dress Shoes"
                state="1"
              />
            </div>

            <div className={cn("col-lg-4 col-md-4 col-sm-6 col-xs-12", styles.wearable_card)}>
              <ICEDWearableCard
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1630855104/Group_224_sils6v.png"
                address="0x23.."
                desc="30% Max ICE Bonus"
                text="ICE Suit & Tie"
                state="2"
              />
            </div>

            <div className={cn("col-lg-4 col-md-4 col-sm-6 col-xs-12", styles.wearable_card)}>
              <ICEDWearableCard
                url="https://res.cloudinary.com/dnzambf4m/image/upload/v1630855008/bg_6_bc0ssa.png"
                address="0x23.."
                desc="30% Max ICE Bonus"
                text="ICE Dress Shoes"
                state="3"
              />
            </div>
          </div>
        ) : (
          <div className={styles.wearable_container}>
            <img
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629713505/Group_191_pk1eoo.png"
              className={styles.wearable_img}
            />
            <p className={styles.play_text}>
              {' '}
              Play-to-Earn with ICE Wearables{' '}
            </p>
            <p className={styles.play_lower}>
              {' '}
              Purchase ICE wearables and earn real cash value from free-to-play
              metaverse poker.{' '}
            </p>
          </div>
        )}
      </div>
    </Aux>
  );
}

export default WearableBody;
