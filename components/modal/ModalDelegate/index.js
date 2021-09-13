import React, { useState } from 'react'
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalDelegate.module.scss';

import ModalSuccessDelegation from '../ModalSuccessDelegation';
//ModalSuccessDelegation

const ModalDelegate = (props) => {

  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [entered, setEntered] = useState(true);

  return (
    <>
    {!success? (
      <Modal
        className={styles.delegate_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.open_button}>
            Delegate
          </Button>
        }
      >
        <div className={styles.close_icon} onClick={() => setOpen(false)}>
          <span className={styles.button_close}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
                fill="white"
              />
            </svg>
          </span>
        </div>
        <div style={{ color: 'white', display: 'flex', gap: '56px' }}>

          <div className={styles.wear_box}>
            <div className={styles.wear_box_purple} >
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893954/Group_199_gnajsw.png" />
            </div>
            <div className={styles.card_body} >
              <div className={styles.card} >
                Rank3
              </div>
              <div className={styles.card} >
                +35
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630486742/image_2_pm0jck.png"
                  className={styles.img_card}
                />
              </div>
              <div className={styles.card} >
                1 of 100
              </div>
            </div>
          </div>

          <div className={styles.wear_box_right} >
            <div className={styles.header} >
              Delegate Your Wearable
            </div>

            <div className={styles.benefit_area} >
              Benefits
              <div className={styles.benefit_list} >
                <ul>
                  <li>
                    Let another player Play-to-Earn with your item
                  </li>
                  <li>
                    Earn 30% of all ICE profits from their gameplay
                  </li>
                  <li>
                    Withdraw your delegation instantly at any time.
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.price_area} >
              Profit Split
              <div className={styles.card_area} style={{marginTop: 30}}>
                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    <div className={styles.info}>You Earn</div>
                    30%
                    <img
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630486742/image_2_pm0jck.png"
                      className={styles.img_card1}
                    />
                  </div>
                </div>

                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    <div className={styles.info}>They Earn</div>
                    70%
                    <img
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630486742/image_2_pm0jck.png"
                      className={styles.img_card2}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.price_area} >
              Delegate Address
              <div className={styles.card_area}>
                <div className={styles.card_area_body} style={{width: '100%'}}>
                  <div className={styles.inputcard}>
                    To:
                    <input className={styles.input} placeholder="Paste ETH Address Here" onChange={(evt)=> {
                      //console.log(evt.target.value);
                      if(evt.target.value.length > 0) {
                        setEntered(false);
                      } else {
                        setEntered(true);
                      }
                    }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.button_area} >
              <Button 
                className={styles.button_upgrade}
                onClick={() => {
                  setOpen(false);
                  setSuccess(true);
                }} 
                disabled={entered}
              >
                Delegate Wearable
              </Button>
              <Button className={styles.button_close}>
                Learn More
              </Button>
            </div>

            <div className={styles.delegateInfo}>
              Address already has delegated wearables. Only 1 person can delegate
            </div>
          </div>          
        </div>
      </Modal>) : (
        <ModalSuccessDelegation setSuccess={setSuccess} />
      )}
    </>
  );
};

export default ModalDelegate;