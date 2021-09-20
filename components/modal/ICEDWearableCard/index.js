import React, { useState } from 'react';
import cn from 'classnames';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';
import styles from './ICEDWearableCard.module.scss';
import IceP2EEnabledTooltip from 'components/tooltips/IceP2EEnabledTooltip'
import IceNeedToActivateTooltip from 'components/tooltips/IceNeedToActivateTooltip'
import IceWearableBonusTooltip from 'components/tooltips/IceWearableBonusTooltip'
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
            {props.state == 2 ?
              <IceNeedToActivateTooltip />
              :
              <IceP2EEnabledTooltip />
            }
            <img src={props.url} />
          </div>
          <div className={styles.card_body}>
            <div className={styles.card}>{props.rank}</div>
            <IceWearableBonusTooltip
              bonus={props.bonus}
            />
            <div className={styles.card}>1 of 100</div>
          </div>
          <div className={styles.card_meta}>DG Suit</div>
          <div className={styles.card_title}>
            {props.text ? props.text : 'DG Deezys'} <br/>
            (ICE {props.rank})
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
