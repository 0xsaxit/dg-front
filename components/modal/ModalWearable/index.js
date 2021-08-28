import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';

import { GlobalContext } from 'store';
import Global from 'components/Constants';
import styles from './ModalWearable.module.scss';
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import IceWearInfo from 'components/modal/IceWearInfo';


const ModalWearable = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(props.open || false);
  const [upgrade, setUpgrade] = useState(true);
  const [info, setInfo] = useState(false);

  return (
    <>
    {upgrade? (
      <Modal
        className={styles.wearable_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={
          <Button className={styles.play_now_modal}>
            Test Upgrade
          </Button>
        }
      >
        <div className={styles.close_icon} onClick={() => setOpen(false)}>
          <span className={styles.button_close}>
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M0.619141 12.6201C0.126953 13.1211 0.100586 14.0439 0.636719 14.5713C1.17285 15.1074 2.08691 15.0898 2.58789 14.5889L7.54492 9.63184L12.4932 14.5801C13.0117 15.1074 13.9082 15.0986 14.4355 14.5625C14.9717 14.0352 14.9717 13.1387 14.4531 12.6201L9.50488 7.67188L14.4531 2.71484C14.9717 2.19629 14.9717 1.2998 14.4355 0.772461C13.9082 0.236328 13.0117 0.236328 12.4932 0.754883L7.54492 5.70312L2.58789 0.746094C2.08691 0.253906 1.16406 0.227539 0.636719 0.763672C0.109375 1.2998 0.126953 2.21387 0.619141 2.71484L5.57617 7.67188L0.619141 12.6201Z" 
                fill="white"
              />
            </svg>
          </span>
        </div>
        <div style={{color: 'white', display: 'flex', gap: '24px'}}>

          <div className={styles.wear_box}>
            <div className={styles.wear_box_mark}>
              +34%
              <img 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/snowflake_rplq6d.png" 
                className={styles.img_card}
              />
            </div>
            <div className={styles.wear_box_purple} >
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727553/Group_207_wujmkv.png" />
            </div>
            <div className={styles.card_body} >
              <div className={styles.card} >
                Rank3
              </div>
              <div className={styles.card} >
                +35
                <img 
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/snowflake_rplq6d.png" 
                  className={styles.img_card}
                />
              </div>
              <div className={styles.card} >
                1 of 100
              </div>
            </div>
          </div>
          
          <div className={styles.wear_box}>
            <Popup
              on='click'
              inverted
              position='bottom center'
              trigger={
                <div className={styles.wear_box_questionmark}>
                  <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M5.5026 11.5C8.51864 11.5 11 9.01864 11 6.0026C11 2.98136 8.51864 0.5 5.4974 0.5C2.47617 0.5 0 2.98136 0 6.0026C0 9.01864 2.48136 11.5 5.5026 11.5ZM5.4974 4.33624C5.05097 4.33624 4.67721 3.96248 4.67721 3.51605C4.67721 3.05403 5.05097 2.69066 5.4974 2.69066C5.94384 2.69066 6.31241 3.05403 6.31241 3.51605C6.31241 3.96248 5.94384 4.33624 5.4974 4.33624ZM4.51109 8.9252C4.22039 8.9252 3.99198 8.72275 3.99198 8.41647C3.99198 8.14134 4.22039 7.91812 4.51109 7.91812H5.10807V6.07008H4.61491C4.31902 6.07008 4.0958 5.86244 4.0958 5.56654C4.0958 5.28622 4.31902 5.06819 4.61491 5.06819H5.67909C6.05286 5.06819 6.24493 5.32256 6.24493 5.71708V7.91812H6.71732C7.00802 7.91812 7.23643 8.14134 7.23643 8.41647C7.23643 8.72275 7.00802 8.9252 6.71732 8.9252H4.51109Z" 
                      fill="white"
                    />
                  </svg>
                </div>
              } 
              pinned
            >
              <div className={styles.popupcard}>
                <div className={styles.header}>
                  
                  <div className={styles.logo}>
                    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path 
                        d="M8.50401 17.3747C13.1652 17.3747 17 13.5399 17 8.87874C17 4.20955 13.1652 0.374725 8.49599 0.374725C3.82681 0.374725 0 4.20955 0 8.87874C0 13.5399 3.83483 17.3747 8.50401 17.3747ZM8.49599 6.30346C7.80604 6.30346 7.22841 5.72583 7.22841 5.03589C7.22841 4.32187 7.80604 3.76028 8.49599 3.76028C9.18594 3.76028 9.75554 4.32187 9.75554 5.03589C9.75554 5.72583 9.18594 6.30346 8.49599 6.30346ZM6.97168 13.3955C6.52242 13.3955 6.16942 13.0826 6.16942 12.6093C6.16942 12.1841 6.52242 11.8391 6.97168 11.8391H7.89429V8.98303H7.13214C6.67485 8.98303 6.32987 8.66212 6.32987 8.20483C6.32987 7.77161 6.67485 7.43466 7.13214 7.43466H8.77678C9.35441 7.43466 9.65125 7.82777 9.65125 8.43749V11.8391H10.3813C10.8306 11.8391 11.1836 12.1841 11.1836 12.6093C11.1836 13.0826 10.8306 13.3955 10.3813 13.3955H6.97168Z" 
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className={styles.title}>
                    Your new ICE bonus will be randomly selected within the new rank range. If unhappy with your result, you can reroll for 10,000 ICE.
                  </div>

                </div>

                <div className={styles.images}>
                  <div className={styles.row}>
                    <div className={styles.col}>                      
                      <div className={styles.img}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893954/Group_199_gnajsw.png" />
                      </div>
                      <div className={styles.rank}>
                        Rank1
                      </div>
                      <div className={styles.percent}>
                        + 0% ICE
                      </div>
                    </div>
                    <div className={styles.col}>
                      <div className={styles.img}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893954/Group_200_jrqo60.png" />
                      </div>
                      <div className={styles.rank}>
                        Rank2
                      </div>
                      <div className={styles.percent}>
                        + 10 - 29% ICE
                      </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.col}>
                      <div className={styles.img}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893954/Group_201_a4lthi.png" />
                      </div>
                      <div className={styles.rank}>
                        Rank3
                      </div>
                      <div className={styles.percent}>
                        + 30% - 49% ICE
                      </div>
                    </div>
                    <div className={styles.col}>
                      <div className={styles.img}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893954/Group_202_hlg8kr.png" />
                      </div>
                      <div className={styles.rank}>
                        Rank4
                      </div>
                      <div className={styles.percent}>
                        + 50% - 69% ICE
                      </div>
                    </div>
                  </div>

                  <div className={styles.row}>
                    <div className={styles.col}>
                      <div className={styles.img}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629893951/Group_203_wl4qhv.png" />
                      </div>
                      <div className={styles.rank}>
                        Rank5
                      </div>
                      <div className={styles.percent}>
                        + 70% - 100% ICE
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
            
            <div className={styles.wear_box_mark} style={{marginLeft: '50px'}}>
              + 50% - 69%
              <img 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/snowflake_rplq6d.png" 
                className={styles.img_card}
              />
            </div>

            <div className={styles.wear_box_pink} >
              <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727553/bg_7_cknc85.png" />
            </div>

            <div className={styles.card_body} >
              <div className={styles.card} >
                Rank 4
              </div>
              <div className={styles.card} >
                + 50% - 69%
                <img 
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/snowflake_rplq6d.png" 
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
                      100K ICE
                    <img 
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/snowflake_rplq6d.png" 
                      className={styles.img_card1}
                    />
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
                    <img 
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" 
                      className={styles.img_card2}
                    />
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
                    <img 
                      src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/XP_zbnvuf.png" 
                      className={styles.img_card3}
                    />
                  </div>
                  <div className={styles.description}>
                    224 XP Available
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.button_area} >
              <Button className={styles.button_upgrade} onClick={()=> {
                setUpgrade(false);
              }}>
                Upgrade Wearable
              </Button>
              <Button className={styles.button_close}>
                Learn More
              </Button>
            </div>
          </div>
          

        </div>
      </Modal>

    ) : (
      <NeedMoreUpgrade />
    )}
    </>
  );
};

export default ModalWearable;
