import { useEffect, useContext, useState } from 'react';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import styles from './NeedMoreUpgrade.module.scss';
import ModalWearable from 'components/modal/ModalWearable';


const NeedMoreUpgrade = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  //const [wearModal, setWearModal] = useState(false);

  return (
    <>
      {open? ( 
        <Modal
          className={styles.upgrade_modal}
          // onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          // trigger={}
        >
          <div
            className={styles.preview_button} 
            onClick={() =>{
              console.log("[close icon clicked: ]");
              setOpen(false);
            }}
          >
            <span>
              <svg width="10" height="17" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.0107422 8.6543C0.0107422 9.11133 0.168945 9.48926 0.555664 9.8584L7.16504 16.3271C7.44629 16.6084 7.78027 16.7402 8.17578 16.7402C8.99316 16.7402 9.65234 16.0811 9.65234 15.2812C9.65234 14.8682 9.48535 14.499 9.17773 14.2002L3.44727 8.64551L9.17773 3.1084C9.48535 2.80078 9.65234 2.43164 9.65234 2.02734C9.65234 1.22754 8.99316 0.568359 8.17578 0.568359C7.78027 0.568359 7.44629 0.708984 7.16504 0.981445L0.555664 7.4502C0.177734 7.81934 0.0107422 8.18848 0.0107422 8.6543Z" fill="white"/>
              </svg>
            </span>
          </div>
          <div className={styles.body}>
            <div className = {styles.title}>
              Need More to Upgrade
              <div className = {styles.desc}>
                ICE Wearables are upgraded on the Polygon sidechain. If
                you already own enough $DG and ICE on mainnet, you 
                can bridge them to Polygon <a>with us</a> or using <a>matic bridge</a>.
              </div>

              <div className = {styles.image_area}>
                <div className={styles.image_card}>
                  <div className = {styles.photo}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629894602/snowflake_kf2l6j.png" className = {styles.icon}/>
                  </div>
                  <div className = {styles.desc}>
                    Need 76,000 more
                  </div>
                </div>

                <div className={styles.image_card}>
                  <div className = {styles.dgphoto}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" className = {styles.dgicon}/>
                  </div>                  
                </div>

                <div className={styles.image_card}>
                  <div className = {styles.photo}>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629894652/XP_wxypvi.png" className = {styles.icon}/>
                  </div>
                  <div className = {styles.desc}>
                    Need 169 more
                  </div>
                </div>
              </div>

              <div className = {styles.button_area}>
                <div className = {styles.button_card}>
                  <Button className = {styles.normal_button}>
                    Buy ICE
                    &nbsp;<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M11.874 9.45117V2.11963C11.874 1.43848 11.4126 0.969727 10.7241 0.969727H3.38525C2.74072 0.969727 2.25732 1.46045 2.25732 2.04639C2.25732 2.63232 2.75537 3.08643 3.37793 3.08643H6.14648L8.40967 3.00586L7.14258 4.13379L0.741211 10.5425C0.499512 10.7842 0.367676 11.0698 0.367676 11.3628C0.367676 11.9341 0.902344 12.4761 1.48096 12.4761C1.77393 12.4761 2.05225 12.3442 2.30127 12.1025L8.70996 5.70117L9.84521 4.43408L9.75 6.6167V9.4585C9.75 10.0884 10.2041 10.5791 10.79 10.5791C11.3833 10.5791 11.874 10.0811 11.874 9.45117Z" 
                        fill="white"
                      />
                    </svg>

                  </Button>
                  <div className = {styles.desc}>
                    26,000 ICE Available
                  </div>
                </div>

                <div className = {styles.button_card}>
                  <Button className = {styles.normal_button}>
                    Buy $DG
                    &nbsp;<svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M11.874 9.45117V2.11963C11.874 1.43848 11.4126 0.969727 10.7241 0.969727H3.38525C2.74072 0.969727 2.25732 1.46045 2.25732 2.04639C2.25732 2.63232 2.75537 3.08643 3.37793 3.08643H6.14648L8.40967 3.00586L7.14258 4.13379L0.741211 10.5425C0.499512 10.7842 0.367676 11.0698 0.367676 11.3628C0.367676 11.9341 0.902344 12.4761 1.48096 12.4761C1.77393 12.4761 2.05225 12.3442 2.30127 12.1025L8.70996 5.70117L9.84521 4.43408L9.75 6.6167V9.4585C9.75 10.0884 10.2041 10.5791 10.79 10.5791C11.3833 10.5791 11.874 10.0811 11.874 9.45117Z" 
                        fill="white"
                      />
                    </svg>
                  </Button>
                  <div className = {styles.desc}>
                    2.91 DG Available
                  </div>
                </div>

                <div className = {styles.button_card}>
                  <Button className = {styles.gray_button} style={{height: '50px', paddingTop: '10px'}}>
                    <span className={styles.desc}>ONLY THROUGH</span>
                    Gameplay
                  </Button>
                  <div className = {styles.desc}>
                    38 XP Available
                  </div>
                </div>
              </div>

 

            </div>
          </div>
        </Modal>) :( <ModalWearable open={true} />
      )}
    </>
  );
};

export default NeedMoreUpgrade;
