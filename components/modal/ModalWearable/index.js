import { useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import styles from './ModalWearable.module.scss';
import IceUpgradeWearableTooltip from 'components/tooltips/IceUpgradeWearableTooltip';
import NeedMoreUpgrade from 'components/modal/NeedMoreUpgrade';
import ModalUpgradeSuccess from 'components/modal/ModalUpgradeSuccess';
import ModalUpgradePending from 'components/modal/ModalUpgradePending';

const ModalWearable = props => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [upgrade, setUpgrade] = useState(0);

  /////////////////////////////////////////////////////////////////////
  /////////////// TODO: please add some logic to calculate the "not enough" tags' visibility on top of the
  /////////////// token price tags. (spans on lines 124, 155 and 183)
  ////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////
  /////////////// Bonus Array, ICE Prices, Img Array
  const [wearableName, setWearableName] = useState(
    props.name.replace('Diamond Hands ', '')
  );

  const bonus = [
    '0%', // Rank 0
    '+1 - 7%', // Rank 1
    '+8 - 15%', // Rank 2
    '+16 - 24%', // Rank 3
    '+25 - 34%', // Rank 4
    '+35 - 45%', // Rank 5
  ];

  const icePrices = [
    0, // Rank 0
    0, // Rank 1
    30000, // Rank 2
    40000, // Rank 3
    50000, // Rank 4
    60000, // Rank 5
  ];

  const imgUrls = {
    Trousers: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_suit_bottom_rank1_lower_body_eqxrjg.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_suit_bottom_rank1_lower_body_eqxrjg.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375785/dg_suit_bottom_rank2_lower_body_lzafze.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375790/dg_suit_bottom_rank3_lower_body_d8j7fc.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_suit_bottom_rank4_lower_body_lgxlp6.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375787/dg_suit_bottom_rank5_lower_body_wjheco.svg',
    ],
    Blazer: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375788/dg_suit_top_rank1_upper_body_topkkt.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375788/dg_suit_top_rank1_upper_body_topkkt.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375798/dg_suit_top_rank2_upper_body_gqhhf1.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375788/dg_suit_top_rank3_upper_body_zgdd1z.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375793/dg_suit_top_rank4_upper_body_mmro3k.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375795/dg_suit_top_rank5_upper_body_cwbqb8.svg',
    ],
    Cigar: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375775/dg_cigar_rank1_eyewear_ryp0s8.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375775/dg_cigar_rank1_eyewear_ryp0s8.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_cigar_rank2_eyewear_egkg1l.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_cigar_rank3_eyewear_dw0ezt.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_cigar_rank4_eyewear_wbccwe.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_cigar_rank5_eyewear_imanmm.svg',
    ],
    Loafers: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_dress_rank1_shoes_feet_m5fgcv.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375776/dg_dress_rank1_shoes_feet_m5fgcv.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375780/dg_dress_rank2_shoes_feet_rfwrkf.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375779/dg_dress_rank3_shoes_feet_wbkmn1.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375779/dg_dress_rank4_shoes_feet_b6y0dw.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375780/dg_dress_rank5_shoes_feet_icgadn.svg',
    ],
    Shades: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_money_shades_rank1_eyewear_gvb3kg.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_money_shades_rank1_eyewear_gvb3kg.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375780/dg_money_shades_rank2_eyewear_czk0rc.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375784/dg_money_shades_rank3_eyewear_r1i2ng.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375781/dg_money_shades_rank4_eyewear_p03kbq.svg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1633375783/dg_money_shades_rank5_eyewear_xidpnl.svg',
    ],
  };

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
              <div
                style={{
                  width: '240px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div className={styles.wear_box_mark}>
                  +{props.bonus}%
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
              </div>
              <div className={styles.wear_box_purple}>
                <img src={props.imgSrc} />
              </div>
              <div className={styles.card_body}>
                <div className={styles.card}>Rank {props.rank}</div>
                <div className={styles.card}>
                  +{props.bonus}%
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
                <div className={styles.card}>
                  {props.description.split(' ').at(-1).replace('/', ' of ')}
                </div>
              </div>
            </div>

            <div className={styles.upgrade_arrow}>
              <img
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1632104564/blue-arrow_Traced_oy95nf.svg"
                alt="Upgrade"
              />
            </div>

            <div className={styles.wear_box}>
              <IceUpgradeWearableTooltip />

              <div
                style={{
                  width: '240px',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <div className={styles.wear_box_mark}>
                  {bonus[Math.min(props.rank + 1, 5)]}
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
              </div>

              <div className={styles.wear_box_pink}>
                <img
                  src={
                    imgUrls[wearableName][parseInt(Math.min(props.rank + 1, 5))]
                  }
                />
              </div>

              <div className={styles.card_body}>
                <div className={styles.card}>
                  Rank {Math.min(props.rank + 1, 5)}
                </div>
                <div className={styles.card}>
                  {bonus[Math.min(props.rank + 1, 5)]}
                  <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                    className={styles.img_card}
                  />
                </div>
                <div className={styles.card}>x of 100</div>
              </div>
            </div>

            <div className={styles.wear_box_right}>
              <div className={styles.header}>Upgrade ICE Wearable</div>

              <div className={styles.benefit_area}>
                Benefits
                <div className={styles.benefit_list}>
                  <ul>
                    <li>
                      Update your ICE Bonus to between{' '}
                      {bonus[Math.min(props.rank + 1, 5)]}
                    </li>
                    <li>Daily free chip stack increase from 4,000 to 4,500</li>
                  </ul>
                </div>
              </div>

              <div className={styles.price_area}>
                Price
                <span style={{ opacity: 0.75 }}>&nbsp;($109.12)</span>
                <div className={styles.card_area}>
                  <div className={styles.card_area_body}>
                    {state.iceAmounts.ICE_AVAILABLE_AMOUNT <
                      icePrices[Math.min(props.rank + 1, 5)] && (
                        <span className={styles.not_enough}>Not Enough</span>
                      )}
                    <div className={styles.card}>
                      {icePrices[Math.min(props.rank + 1, 5)] / 1000 + 'K'} ICE
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                        className={styles.img_card1}
                      />
                    </div>

                    <div className={styles.description}>
                      {state.iceAmounts.ICE_AVAILABLE_AMOUNT} ICE Available
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
                    {state.DGBalances.BALANCE_CHILD_DG < 0.1 && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      0.1 DG
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
                        className={styles.img_card2}
                      />
                    </div>
                    <div className={styles.description}>
                      {parseFloat(state.DGBalances.BALANCE_CHILD_DG).toFixed(2)}{' '}
                      DG Available
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
                    {state.xpAmounts < 50 && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      50 XP
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/XP_zbnvuf.png"
                        className={styles.img_card3}
                      />
                    </div>
                    <div className={styles.description}>
                      {state.xpAmounts} XP Available
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.button_area}>
                {state.xpAmounts >= 50 &&
                  state.DGBalances.BALANCE_CHILD_DG >= 0.1 &&
                  state.iceAmounts.ICE_AVAILABLE_AMOUNT >= 30000 ? (
                  <Button
                    className={styles.button_upgrade}
                    onClick={() => {
                      setOpen(false);
                      setUpgrade(2);
                    }}
                  >
                    Upgrade Wearable
                  </Button>
                ) : (
                  <Button
                    className={styles.button_upgrade}
                    onClick={() => {
                      setOpen(false);
                      setUpgrade(1);
                    }}
                  >
                    Upgrade Wearable
                  </Button>
                )}
                <Button className={styles.button_close}>Learn More</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {upgrade == 1 && (
        <NeedMoreUpgrade
          upgradeNeedIceAmount={icePrices[Math.min(props.rank + 1, 5)]}
          upgradeNeedDgAmount={0.1}
          upgradeNeedXpAmount={50}
          setUpgrade={setUpgrade}
          setPropsOpen={setOpen}
        />
      )}

      {upgrade == 2 && (
        <ModalUpgradePending
          setUpgrade={setUpgrade}
          tokenID={props.tokenID}
          itemID={props.itemID}
          upgradeRank={Math.min(props.rank + 1, 5)}
        />
      )}

      {upgrade == 3 && <ModalUpgradeSuccess setUpgrade={setUpgrade} />}
    </>
  );
};

export default ModalWearable;
