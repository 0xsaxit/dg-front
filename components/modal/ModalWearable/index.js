import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button, Header, Grid, Popup } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Global from 'components/Constants';
import styles from './ModalWearable.module.scss';
import IceUpgradeWearableTooltip from 'components/tooltips/IceUpgradeWearableTooltip'
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import ModalUpgradeSuccess from 'components/modal/ModalUpgradeSuccess';
import ModalUpgradePending from 'components/modal/ModalUpgradePending';

const ModalWearable = (props) => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [upgrade, setUpgrade] = useState(0);

  /////////////////////////////////////////////////////////////////////
  /////////////// TODO: please add some logic to calculate the "not enough" tags' visibility on top of the
  /////////////// token price tags. (spans on lines 124, 155 and 183)
  ////////////////////////////////////////////////////////////////////
  return (
    <>
      {upgrade == 0 && (
        <Modal
          className={styles.wearable_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={<Button className={styles.open_button}>Upgrade</Button>}
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
          <div style={{ color: 'white', display: 'flex', gap: '24px' }}>
            <div className={styles.wear_box}>
              <div className={styles.wear_box_mark}>
                +34%
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                  className={styles.img_card}
                />
              </div>
              <div className={styles.wear_box_purple}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727553/Group_207_wujmkv.png" />
              </div>
              <div className={styles.card_body}>
                <div className={styles.card}>Rank 3</div>
                <div className={styles.card}>
                  +35
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
                <div className={styles.card}>1 of 100</div>
              </div>
            </div>

            <div className={styles.wear_box}>
              <IceUpgradeWearableTooltip />

              <div
                className={styles.wear_box_mark}
                style={{ marginLeft: '50px' }}
              >
                + 50% - 69%
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                  className={styles.img_card}
                />
              </div>

              <div className={styles.wear_box_pink}>
                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727553/bg_7_cknc85.png" />
              </div>

              <div className={styles.card_body}>
                <div className={styles.card}>Rank 4</div>
                <div className={styles.card}>
                  + 50% - 69%
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
                <div className={styles.card}>1 of 100</div>
              </div>
            </div>

            <div className={styles.wear_box_right}>
              <div className={styles.header}>Upgrade ICE Wearable</div>

              <div className={styles.benefit_area}>
                Benefits
                <div className={styles.benefit_list}>
                  <ul>
                    <li>Update your ICE Bonus to between 50% - 69%</li>
                    <li>Daily free chip stack increase from 4,000 to 4,500</li>
                  </ul>
                </div>
              </div>

              <div className={styles.price_area}>
                Price
                <span style={{ opacity: 0.75 }}>&nbsp;($109.12)</span>
                <div className={styles.card_area}>
                  <div className={styles.card_area_body}>
                    {true && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      100K ICE
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                        className={styles.img_card1}
                      />
                    </div>

                    <div className={styles.description}>
                      105,000 ICE Available
                    </div>
                    <div className={styles.network}>(On Polygon)</div>
                  </div>

                  <div className={styles.plusIcon}>
                    <svg
                      width="8"
                      height="7"
                      viewBox="0 0 8 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <div className={styles.card_area_body}>
                    {false && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      0.1 DG
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
                        className={styles.img_card2}
                      />
                    </div>
                    <div className={styles.description}>2.91 DG Available</div>
                    <div className={styles.network}>(On Polygon)</div>
                  </div>

                  <div className={styles.plusIcon}>
                    <svg
                      width="8"
                      height="7"
                      viewBox="0 0 8 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.672 0.103999H2.832V2.488H0.464V4.328H2.832V6.696H4.672V4.328H7.056V2.488H4.672V0.103999Z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  <div className={styles.card_area_body}>
                    {true && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      200 XP
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/XP_zbnvuf.png"
                        className={styles.img_card3}
                      />
                    </div>
                    <div className={styles.description}>224 XP Available</div>
                  </div>
                </div>
              </div>
              <div className={styles.button_area}>
                {/* <NeedMoreUpgrade setOpen={setOpen} setUpgrade={setUpgrade} /> */}
                <Button
                  className={styles.button_upgrade}
                  onClick={() => {
                    setOpen(false);
                    setUpgrade(1);
                  }}
                >
                  Upgrade Wearable
                </Button>
                <Button className={styles.button_close}>Learn More</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {upgrade == 1 && (
        <NeedMoreUpgrade setUpgrade={setUpgrade} setOpen={setOpen} />
      )}

      {upgrade == 2 && <ModalUpgradePending setUpgrade={setUpgrade} />}

      {upgrade == 3 && <ModalUpgradeSuccess setUpgrade={setUpgrade} />}
    </>
  );
};

export default ModalWearable;
