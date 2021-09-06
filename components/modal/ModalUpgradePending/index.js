import React, { useState } from 'react'
import cn from 'classnames';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalUpgradePending.module.scss';


const ModalUpgradePending = (props) => {

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
            Upgrade Wearable
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
            <p className={styles.header}> Upgrade Pending </p>

            <p className={styles.description}>
              To upgrade your wearable, you will have to complete 4 transactions in metamask.
            </p>

            <div className={styles.upgrade_inner_container}>
              <div className={styles.upgrade_area}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="white" stroke-opacity="0.25" stroke-width="4"/>
                  <circle cx="16" cy="16" r="16" fill="#35AB3A"/>
                  <path d="M14.7197 23.5601C15.4375 23.5601 15.9941 23.3037 16.375 22.7471L23.084 12.8594C23.3477 12.4712 23.4648 12.0684 23.4648 11.7095C23.4648 10.6841 22.6445 9.90771 21.5898 9.90771C20.8794 9.90771 20.4106 10.1641 19.9785 10.8452L14.6904 19.0483L12.105 16.1553C11.7388 15.7378 11.2993 15.54 10.7134 15.54C9.65137 15.54 8.86768 16.3164 8.86768 17.3491C8.86768 17.8252 8.99219 18.1914 9.39502 18.6455L13.1523 22.8862C13.5698 23.355 14.0825 23.5601 14.7197 23.5601Z" fill="white"/>
                </svg>

                <div className={styles.upgrade_right}>
                  <p className={styles.upgrade_top_text}> Authorize ICE </p>
                  <p className={styles.upgrade_bottom_text}> Enables ICE Transaction </p>
                </div>
              </div>

              <div className={styles.upgrade_area}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="white" stroke-opacity="0.25" stroke-width="4"/>
                </svg>

                <div className={styles.upgrade_right}>
                  <p className={styles.upgrade_top_text}> Authorize DG </p>
                  <p className={styles.upgrade_bottom_text}> Enables DG Transaction </p>
                </div>
              </div>

              <div className={styles.upgrade_area}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="white" stroke-opacity="0.25" stroke-width="4"/>
                </svg>

                <div className={styles.upgrade_right}>
                  <p className={styles.upgrade_top_text}> Authorize NFT </p>
                  <p className={styles.upgrade_bottom_text}> Enables NFT Transaction </p>
                </div>
              </div>

              <div className={styles.upgrade_area}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="14" stroke="white" stroke-opacity="0.25" stroke-width="4"/>
                </svg>

                <div className={styles.upgrade_right}>
                  <p className={styles.upgrade_top_text}> Send ICE, DG & NFT </p>
                  <p className={styles.upgrade_bottom_text}> Transaction to upgrade wearable </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpgradePending;