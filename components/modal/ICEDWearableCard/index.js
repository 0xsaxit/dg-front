import React, { useState } from 'react';
import cn from 'classnames';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';
import styles from './ICEDWearableCard.module.scss';
import ModalDelegate from 'components/modal/ModalDelegate';
import ModalWithdrawDelegation from 'components/modal/ModalWithdrawDelegation';
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import NeedMoreDGActivateModal from 'components/modal/NeedMoreDGActivateModal';
import ModalWearable from 'components/modal/ModalWearable';

const ICEDWearableCard = props => {
  return (
    <>
      <div className={styles.wearable_modal}>
        <div className={styles.wear_box}>
          <div className={styles.wear_box_purple}>
            {/*<div className={styles.delegatebtn}>
                Delegated To {props.address? props.address : 'You' }
            </div>*/}
            <img src={props.url} />
          </div>
          <div className={styles.card_body}>
            <div className={styles.card}>Rank 4</div>
            <div className={styles.card}>
              +35%
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                className={styles.img}
              />
            </div>
            <div className={styles.card}>1 of 100</div>
          </div>
          <div className={styles.card_meta}>ICE WEARABLE</div>
          <div className={styles.card_title}>
            {props.text ? props.text : 'DG Deezys'}
          </div>
          <div className={styles.button_area}>
            {props.state == 1 ? (
              <span className="w-100 d-flex justify-content-between">
                <ModalDelegate />
                <ModalWearable />
              </span>
            ) : props.state == 2 ? (
                <NeedMoreDGActivateModal />
              // <Button className={styles.upgrade_button}>
              //   Activate Wearable (0.5 DG)
              // </Button>
            ) : (
              <ModalWithdrawDelegation />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ICEDWearableCard;
