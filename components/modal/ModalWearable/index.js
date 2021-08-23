import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Global from 'components/Constants';
import styles from './ModalWearable.module.scss';
import Images from '../../../common/Images';
import Fetch from '../../../common/Fetch';
//import { ClothesImage } from './svgAsset';


const ModalWearable = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);
  

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      setSafari(true);
    }  
  }, []);

  

  return (
    <>    
      <Modal
        className={styles.wearable_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.play_now_modal}>
            Play Now
          </Button>
        }
      >
        <div
          style={{
            marginTop: '-72px',
            marginBottom: '58px',
            marginLeft: '-38px',
          }}
        >
          <span className={styles.button_close} onClick={() => setOpen(false)}>
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
        <div style={{color: 'white', display: 'flex', gap: '24px'}}>

          <div className={styles.wear_box}>
            <div className={styles.wear_box_mark}>
              <span>+34%</span>
            </div>
            <div className={styles.wear_box_purple} >
            </div>
            <div className={styles.card_body} >
              <div className={styles.card} >
                Rank3
              </div>
              <div className={styles.card} >
                +34%
              </div>
              <div className={styles.card} >
                1 of 100
              </div>
            </div>
          </div>
          
          <div className={styles.wear_box}>
            <div className={styles.wear_box_questionmark}>
              <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z" fill="white"/>
              </svg>
            </div>
            <div className={styles.wear_box_mark}>
              + 50% - 69%
            </div>

            <div className={styles.wear_box_pink} >
            </div>

            <div className={styles.card_body} >
              <div className={styles.card} >
                Rank 4
              </div>
              <div className={styles.card} >
                + 50% - 69%
              </div>
              <div className={styles.card} >
                1 of 100
              </div>
            </div>
          </div>

          <div className={styles.wear_box_right} >
            <div className={styles.header} >
              Upgrade ICE Wearable
            </div>

            <div className={styles.benefit_area} >
              Benefits
              <div className={styles.benefit_list} >
                <ul>
                  <li>
                    Update your ICE Bonus to between 50% - 69%
                  </li>
                  <li>
                    Daily free chip stack increase from 4,000 to 4,500
                  </li>
                </ul>
              </div>
            </div>

            <div className={styles.price_area} >
              Price 
              <span style={{opacity: 0.75}}>
                &nbsp;($109.12)
              </span>

              <div className={styles.card_area}>
                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    <span>
                      100 ICE
                    </span>                  
                  </div>

                  <div className={styles.description}>
                    105,000 ICE Available
                  </div>
                  <div className={styles.network}>
                    (On Polygon)
                  </div>
                </div>

                <div className={styles.plusIcon}>
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z" fill="white"/>
                  </svg>
                </div>

                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    0.1 DG
                  </div>
                  <div className={styles.description}>
                    2.91 DG Available
                  </div>
                  <div className={styles.network}>
                    (On Polygon)
                  </div>
                </div>

                <div className={styles.plusIcon}>
                  <svg width="8" height="7" viewBox="0 0 8 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z" fill="white"/>
                  </svg>
                </div>

                <div className={styles.card_area_body}>
                  <div className={styles.card}>
                    200 XP
                  </div>
                  <div className={styles.description}>
                    224 XP Available
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.button_area} >
              <Button className={styles.button_upgrade}>
                Upgrade Wearable
              </Button>
              <Button className={styles.button_close}>
                Learn More
              </Button>
            </div>
          </div>
          

        </div>
      </Modal>
    </>
  );
};

export default ModalWearable;
