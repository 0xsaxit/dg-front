import React from 'react';
import cn from 'classnames';
import Aux from 'components/_Aux';
import {Button} from 'semantic-ui-react';
import styles from './Ice.module.scss';
import ModalWearable from 'components/modal/ModalWearable';
import ModalMint from 'components/modal/ModalMint';
import ICEDWearableCard from 'components/modal/ICEDWearableCard';


function ICE({ state }) {
  // define local variables
  return (
    <Aux>
      
      <div className={styles.ice}>
        {state.userStatus ? (
          <div className={styles.ice_card_container}>
            <div className={styles.ice_card}>
              <ICEDWearableCard
                url = 'https://res.cloudinary.com/dnzambf4m/image/upload/v1630855008/bg_6_bc0ssa.png'
                desc='20% Max ICE Bonus'
                text='ICE Dress Shoes'
                state='1'
              />
            </div>

            <div className={styles.ice_card}>
              <ICEDWearableCard 
                url = 'https://res.cloudinary.com/dnzambf4m/image/upload/v1630855104/Group_224_sils6v.png'
                address='0x23..'
                desc='30% Max ICE Bonus'
                text='ICE Suit & Tie'
                state='2'
              />
            </div> 

            <div className={styles.ice_card}>
              <ICEDWearableCard 
                url = 'https://res.cloudinary.com/dnzambf4m/image/upload/v1630855008/bg_6_bc0ssa.png'
                address='0x23..'
                desc='30% Max ICE Bonus'
                text='ICE Dress Shoes'
                state='3'
              />
            </div> 
          </div>
        ) : (     
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
              <ModalWearable />
            </span>
          </div>
        )}
      </div>
    </Aux>
  );
}

export default ICE;
