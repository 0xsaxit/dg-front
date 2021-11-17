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
  const [upgradeCost, setUpgradeCost] = useState(0);
  const {
    ICE_COST_AMOUNT_2,
    ICE_COST_AMOUNT_3,
    ICE_COST_AMOUNT_4,
    ICE_COST_AMOUNT_5,
    DG_COST_AMOUNT_2,
    DG_COST_AMOUNT_3,
    DG_COST_AMOUNT_4,
    DG_COST_AMOUNT_5,
    XP_COST_AMOUNT_2,
    XP_COST_AMOUNT_3,
    XP_COST_AMOUNT_4,
    XP_COST_AMOUNT_5,
  } = state.tokenAmounts;

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
    ICE_COST_AMOUNT_2, // Rank 2
    ICE_COST_AMOUNT_3, // Rank 3
    ICE_COST_AMOUNT_4, // Rank 4
    ICE_COST_AMOUNT_5, // Rank 5
  ];

  const dgPrices = [
    0, // Rank 0
    0, // Rank 1
    DG_COST_AMOUNT_2, // Rank 2
    DG_COST_AMOUNT_3, // Rank 3
    DG_COST_AMOUNT_4, // Rank 4
    DG_COST_AMOUNT_5, // Rank 5
  ];

  const xpPrices = [
    0, // Rank 0
    0, // Rank 1
    XP_COST_AMOUNT_2, // Rank 2
    XP_COST_AMOUNT_3, // Rank 3
    XP_COST_AMOUNT_4, // Rank 4
    XP_COST_AMOUNT_5, // Rank 5
  ];

  const imgUrls = {
    Trousers: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank1_lower_body_o18u5h.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank1_lower_body_o18u5h.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank2_lower_body_x8duyn.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank3_lower_body_cogifo.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank4_lower_body_bdz0gt.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank5_lower_body_jz4bwy.png',
    ],
    Blazer: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank1_upper_body_zw12j7.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank1_upper_body_zw12j7.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank2_upper_body_jifiuq.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank3_upper_body_suw9ai.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank4_upper_body_cyz0gk.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank5_upper_body_ff5n1t.png',
    ],
    Cigar: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank1_eyewear_kt6mqk.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank1_eyewear_kt6mqk.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank2_eyewear_r55vvl.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank3_eyewear_uydyit.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank4_eyewear_mtyrtr.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank5_eyewear_hromtz.png',
    ],
    Loafers: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank1_shoes_feet_nxazsi.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank1_shoes_feet_nxazsi.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank2_shoes_feet_l83rhe.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank3_shoes_feet_gvjjb8.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank4_shoes_feet_avry6l.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank5_shoes_feet_tpnzfv.png',
    ],
    Shades: [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank1_eyewear_shmmce.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank1_eyewear_shmmce.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank2_eyewear_xqvbkf.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank3_eyewear_anyqat.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank4_eyewear_eejcjh.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank5_eyewear_umdmvc.png',
    ],
    'Smoking Shoes': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_1_wwkyrb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_1_wwkyrb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592481/slippers_2_dhwhdy.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_4_b48srj.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png',
    ],
    'Smoking Pants': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/pants_1_taafzw.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/pants_1_taafzw.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/pants_2_wjenib.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/pants_3_dfspif.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/pants_4_popgjm.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592478/pants_5_hj4ezw.png',
    ],
    'Smoking Jacket': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592478/robe_1_wjllvx.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592478/robe_1_wjllvx.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592478/robe_2_hbmlze.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592478/robe_3_ckgy99.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png',
    ],
    "Captain's Hat": [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/hat_m_1_s3vhqj.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/hat_m_1_s3vhqj.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_2_tegl1l.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/hat_m_3_exygib.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png',
    ],
    'Smoking Glasses': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/glasses_1_pxzjw6.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/glasses_1_pxzjw6.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592475/glasses_2_dwrwho.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/glasses_3_y8kgci.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592474/glasses_4_ihsifq.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/glasses_5_b57ugk.png',
    ],
    'Boater Hat': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172287/hat_grey_m_xfx9s3.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172287/hat_grey_m_xfx9s3.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172286/hat_green_m_n7gcr2.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172286/hat_pink_m_lotlp6.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172286/hat_purple_m_ryoxvh.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172292/hat_gold_m_j840d3.png',
    ],
    'XL Pipe': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pipe_grery_hjgjve.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pipe_grery_hjgjve.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/pipe_pink_ozwkzw.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pipe_purple_hpdrhp.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pipe_gold_o9g9rp.png',
    ],
    'Linen Shirt': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/shirt_grey_m_jznjkn.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/shirt_grey_m_jznjkn.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_pink_m_da4udz.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_purple_m_djnlxa.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172288/shirt_gold_m_qqpd2b.png',
    ],
    'Linen Pants': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pants_grey_m_zcpmbd.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/pants_grey_m_zcpmbd.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172288/pants_green_m_dgkjtv.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pants_pink_m_sliadb.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/pants_purple_m_mublim.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172288/pants_gold_m_asyzwz.png',
    ],
    'Boater Shoes': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172287/shoes_grey_tgmj4n.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172287/shoes_grey_tgmj4n.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172292/shoes_pink_himngr.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172287/shoes_purple_uhoyvi.png',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637172289/shoes_gold_cx4ygw.png',
    ],
    'Bomber Pants': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_grey_m_kzmnh3.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_grey_m_kzmnh3.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_green_m_vtdddg.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_pink_m_z0beu4.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_purple_m_lqwt9b.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_gold_m_waxavs.jpg',
    ],
    'Bomber Hat': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_grey_m_incioq.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_grey_m_incioq.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_green_m_uxmjhy.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_pink_m_ruzzlw.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_purple_m_tgxs8e.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_gold_m_nsmuaq.jpg',
    ],
    'Bomber Jacket': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_grey_m_jpnabv.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_grey_m_jpnabv.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_green_m_f8y4a2.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_pink_m_vzcfxl.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_purple_m_cv7uxy.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_gold_m_oxqbqh.jpg',
    ],
    'Bomber Glasses': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_grey_np5pwz.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_grey_np5pwz.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_green_gzoe43.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_pink_qqjwa1.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_purple_w7yl9g.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_gold_fogrzy.jpg',
    ],
    'Bomber Shoes': [
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_grey_r1pu6s.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_grey_r1pu6s.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_green_gjqjnt.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_pink_cnuzg6.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_purple_bsqoyl.jpg',
      'https://res.cloudinary.com/dnzambf4m/image/upload/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_gold_ishar9.jpg',
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
                    <li>Increase the resale value and rarity of your NFT</li>
                  </ul>
                </div>
              </div>

              <div className={styles.price_area}>
                Price
                <span style={{ opacity: 0.75 }}>
                  {' '}
                  ($
                  {(
                    icePrices[Math.min(props.rank + 1, 5)] *
                      state.DGPrices.ice +
                    dgPrices[Math.min(props.rank + 1, 5)] * state.DGPrices.dg
                  ).toFixed(2)}
                  )
                </span>
                <div className={styles.card_area}>
                  <div className={styles.card_area_body}>
                    {state.iceAmounts.ICE_AVAILABLE_AMOUNT <
                      icePrices[Math.min(props.rank + 1, 5)] && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      {`${
                        parseFloat(
                          icePrices[Math.min(props.rank + 1, 5)]
                        ).toFixed() / 1000
                      }K ICE`}
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1630857308/diamond_1_1_r6etkk.png"
                        className={styles.img_card1}
                      />
                    </div>

                    {state.iceAmounts.ICE_AVAILABLE_AMOUNT <
                    icePrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>
                        {parseFloat(
                          state.iceAmounts.ICE_AVAILABLE_AMOUNT
                        ).toLocaleString()}{' '}
                        ICE Available
                      </div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {parseFloat(
                          state.iceAmounts.ICE_AVAILABLE_AMOUNT
                        ).toLocaleString()}{' '}
                        ICE Available
                        <svg
                          width="9"
                          height="8"
                          viewBox="0 0 9 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}

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
                    {parseFloat(state.DGBalances.BALANCE_CHILD_DG).toFixed(2) <
                      dgPrices[Math.min(props.rank + 1, 5)] && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      {dgPrices[Math.min(props.rank + 1, 5)]}
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
                        className={styles.img_card2}
                      />
                    </div>
                    {state.DGBalances.BALANCE_CHILD_DG <
                    dgPrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>
                        {parseFloat(state.DGBalances.BALANCE_CHILD_DG).toFixed(
                          2
                        )}{' '}
                        DG Available
                      </div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {parseFloat(state.DGBalances.BALANCE_CHILD_DG).toFixed(
                          2
                        )}{' '}
                        DG Available
                        <svg
                          width="9"
                          height="8"
                          viewBox="0 0 9 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}

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
                    {state.userInfo.balanceXP <
                      xpPrices[Math.min(props.rank + 1, 5)] && (
                      <span className={styles.not_enough}>Not Enough</span>
                    )}
                    <div className={styles.card}>
                      {xpPrices[Math.min(props.rank + 1, 5)]}
                      <img
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1629727455/XP_zbnvuf.png"
                        className={styles.img_card3}
                      />
                    </div>
                    {state.userInfo.balanceXP <
                    xpPrices[Math.min(props.rank + 1, 5)] ? (
                      <div className={styles.description}>
                        {state.userInfo.balanceXP} XP Available
                      </div>
                    ) : (
                      <div className={styles.greenCheck}>
                        {state.userInfo.balanceXP} XP Available
                        <svg
                          width="9"
                          height="8"
                          viewBox="0 0 9 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.83203 7.73047C4.10547 7.73047 4.32031 7.625 4.46875 7.40625L8.10547 1.86328C8.21094 1.70312 8.25391 1.55078 8.25391 1.41016C8.25391 1.03125 7.96484 0.75 7.57422 0.75C7.30859 0.75 7.14062 0.847656 6.97656 1.10156L3.81641 6.08594L2.21484 4.12109C2.06641 3.94141 1.90234 3.86328 1.67578 3.86328C1.28125 3.86328 0.996094 4.14453 0.996094 4.52734C0.996094 4.69922 1.04688 4.84766 1.19531 5.01562L3.21094 7.4375C3.37891 7.63672 3.57422 7.73047 3.83203 7.73047Z"
                            fill="#67DD6C"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className={styles.button_area}>
                {state.userInfo.balanceXP >= 50 &&
                state.DGBalances.BALANCE_CHILD_DG >= 0.1 &&
                state.iceAmounts.ICE_AVAILABLE_AMOUNT >=
                  icePrices[Math.min(props.rank + 1, 5)] ? (
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
                <Button
                  className={styles.button_close}
                  onClick={() => {
                    window.open(
                      'https://ice.decentral.games/ice-nft-wearables',
                      '_blank'
                    );
                  }}
                >
                  Learn More
                </Button>
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
          address={props.address}
          itemID={props.itemID}
        />
      )}

      {upgrade == 3 && (
        <ModalUpgradeSuccess tokenID={props.tokenID} setUpgrade={setUpgrade} />
      )}
    </>
  );
};

export default ModalWearable;
