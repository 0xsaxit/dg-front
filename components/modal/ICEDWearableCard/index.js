import React, { useState } from 'react'
import cn from 'classnames';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';
import styles from './ICEDWearableCard.module.scss';

const ICEDWearableCard = (props) => {

  return (
    <>
      <div className={styles.wearable_modal}>
        <div className={styles.title}>
          {props.title? props.title : 'ICED Wearables'}
        </div>
        <div className={styles.meta}>
          {props.desc? props.desc : '20% Max ICE Bonus'} 
        </div>

        <div className={styles.wear_box}>
          <div className={styles.wear_box_purple} >
            <div className={styles.delegatebtn}>
                Delegated To {props.address? props.address : 'You' }
            </div>
            <img src={props.url} />
          </div>
          <div className={styles.card_body} >
            <div className={styles.card} >
              Rank4
            </div>
            <div className={styles.card} >
              +35%
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630486742/image_2_pm0jck.png"
                className={styles.img}
              />
            </div>
            <div className={styles.card} >
              1 of 100
            </div>
          </div>
          <div className={styles.card_meta}>DCL SUMMER</div>
          <div className={styles.card_title}>
          {props.text? props.text : 'DG Deezys' }
          </div>
          <div className={styles.button_area} >
            <Button className={styles.button_close}>
              Withdraw Delegation
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ICEDWearableCard;