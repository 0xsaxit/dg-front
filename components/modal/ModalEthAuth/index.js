import React, { useState } from 'react'
import cn from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalEthAuth.module.scss';


const ModalEthAuth = (props) => {

  const [open, setOpen] = useState(false);


  return (
    <>
      <Modal
        className={styles.withdraw_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.open_button}>
            Mint
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

        <div style={{ color: 'white', display: 'flex', justifyContent: 'center', textAlign: 'center' }}>
          <div className={styles.upgrade_container}>
            <p className={styles.header}> Mint ICE Wearable </p>

            <p className={styles.description}>
              To mint a new ICE wearable, you first need to authorize Ethereum transactions.
            </p>

            <div className={styles.upgrade_inner_container}>
              <div className={styles.upgrade_area}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="white" stroke-opacity="0.25" stroke-width="4"/>
                </svg>

                <div className={styles.upgrade_right}>
                  <p className={styles.upgrade_top_text}> Authorize ETH </p>
                  <p className={styles.upgrade_bottom_text}> Enables ETH Transaction </p>
                </div>
              </div>
            </div>
            
            <Button className={styles.proceed_button}>
              Proceed to Mint
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalEthAuth;