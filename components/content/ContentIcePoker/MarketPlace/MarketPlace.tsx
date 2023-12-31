import React, { FC, ReactElement, useContext, useEffect, useState } from 'react';
import { GlobalContext } from '@/store';
import ModalMintWearable from 'components/modal/ModalMintWearable';
import ModalLoginICE from 'components/modal/ModalLoginICE';
import Spinner from 'components/lottieAnimation/animations/spinner_updated';
import { Button, Popup } from 'semantic-ui-react';
import cn from 'classnames';
import Slider from 'react-slick';
import 'react-multi-carousel/lib/styles.css';
import styles from './MarketPlace.module.scss';
import Global from '../../../Constants';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CheckMintableModal from 'components/modal/CheckMintableModal';

export interface ButtonProps {
  className?: string;
  onClick(): void;
}

export interface MarketPlaceType {
  className?: string;
}

const MarketPlace: FC<MarketPlaceType> = ({ className = '' }: MarketPlaceType): ReactElement => {
  // dispatch new user status to Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [previewLevel, setPreviewLevel] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const wearables = [
    {
      title:   'ICE Poet',
      address: Global.ADDRESSES.COLLECTION_POET_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_1_bzdlbm.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_2_wbssai.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_3_naqye8.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_4_ndrkvo.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863904/ICE%20Poet%20Fit/Fit_5_inpdfb.png'
      ],
      details: {
        SonnetShades: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863934/ICE%20Poet%20%28Square%29/glasses_1_uf5elp.png',
          'Sonnet Shades',
          'ICE Poet',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863934/ICE%20Poet%20%28Square%29/glasses_1_uf5elp.png'
        ],
        Beret: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/hat_1_fnlgwr.png',
          'Beret',
          'ICE Poet',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/hat_1_fnlgwr.png'
        ],
        TurtleNeck: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863938/ICE%20Poet%20%28Square%29/shirt_1_enafi5.png',
          'Turtle Neck',
          'ICE Poet',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863938/ICE%20Poet%20%28Square%29/shirt_1_enafi5.png'
        ],
        FunPants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/pants_1_bnff1n.png',
          'Fun Pants',
          'ICE Poet',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863936/ICE%20Poet%20%28Square%29/pants_1_bnff1n.png'
        ],
        HighTops: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863939/ICE%20Poet%20%28Square%29/shoes_1_g2aihx.png',
          'High Tops',
          'ICE Poet',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1644863939/ICE%20Poet%20%28Square%29/shoes_1_g2aihx.png'
        ]
      }
    },
    {
      title:   'ICE Airlines',
      address: Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643990279/ICE%20Airline/Male_1_y5pwpl.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_2_lxjgby.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_3_fq4hpz.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1644333351/ICE%20Airline/Male_4_ocxjnq.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943842/ICE%20Airline/Male_5_dz5iz9.png'
      ],
      details: {
        PilotGogs: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943931/ICE%20Airline/glasses_1_qtofuw.png',
          'Pilot Gogs',
          'ICE Airlines',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943931/ICE%20Airline/glasses_1_qtofuw.png'
        ],
        PilotHat: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943933/ICE%20Airline/hat_m_1_hgkx5l.png',
          'Pilot Hat',
          'ICE Airlines',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943933/ICE%20Airline/hat_m_1_hgkx5l.png'
        ],
        PilotShirt: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943937/ICE%20Airline/upperrbody_m_1_kcrpod.png',
          'Pilot Shirt',
          'ICE Airlines',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943937/ICE%20Airline/upperrbody_m_1_kcrpod.png'
        ],
        PilotPants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943935/ICE%20Airline/lowerbody_m_1_jmsfwd.png',
          'Pilot Pants',
          'ICE Airlines',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943935/ICE%20Airline/lowerbody_m_1_jmsfwd.png'
        ],
        PilotBoot: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943936/ICE%20Airline/shoes_1_dm1ovx.png',
          'Pilot Boot',
          'ICE Airlines',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643943936/ICE%20Airline/shoes_1_dm1ovx.png'
        ]
      }
    },
    {
      title:   'ICE Beach Club',
      address: Global.ADDRESSES.COLLECTION_BEACH_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_1_nbm1oh.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_2_ii0ffb.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_3_zq64sh.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_4_a2vfsw.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159133/Male_5_up7kdg.png'
      ],
      details: {
        TintShades: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159176/glasses_1_eiuee1.png',
          'Tint Shades',
          'ICE Beach Club',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159176/glasses_1_eiuee1.png'
        ],
        BeachFedora: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/hat_M_1_mkessn.png',
          'Beach Fedora',
          'ICE Beach Club',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/hat_M_1_mkessn.png'
        ],
        PartyShirt: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/shirt_M_1_m1yfk1.png',
          'Party Shirt',
          'ICE Beach Club',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159178/shirt_M_1_m1yfk1.png'
        ],
        Boardies: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159179/shorts1_aesu2u.png',
          'Boardies',
          'ICE Beach Club',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159179/shorts1_aesu2u.png'
        ],
        BeachSlides: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159180/shoes1_iywurc.png',
          'Beach Slides',
          'ICE Beach Club',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1643159180/shoes1_iywurc.png'
        ]
      }
    },
    {
      title:   'ICE Chef',
      address: Global.ADDRESSES.COLLECTION_CHEF_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit1_ehvzqa.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit2_gomdcv.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit3_te6dxo.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit4_rur3j0.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686037/Fit5_xchgms.png'
      ],
      details: {
        StarRating: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/star_1_obbp5w.png',
          'Star Rating',
          'ICE Chef',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/star_1_obbp5w.png'
        ],
        ToqueBlanche: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686093/hat_m_1_rcdevg.png',
          'Toque Blanche',
          'ICE Chef',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686093/hat_m_1_rcdevg.png'
        ],
        ChefTop: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/upperbody_m_1_llgrz7.png',
          'Chef\'s Top',
          'ICE Chef',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686096/upperbody_m_1_llgrz7.png'
        ],
        ChefApron: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/lowerbody_m_1_u7mlil.png',
          'Chef\'s Apron',
          'ICE Chef',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/lowerbody_m_1_u7mlil.png'
        ],
        Nonslips: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/shoes_1_tnfrpa.png',
          'Nonslips',
          'ICE Chef',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1642686095/shoes_1_tnfrpa.png'
        ]
      }
    },
    {
      title:   'ICE Joker',
      address: Global.ADDRESSES.COLLECTION_JOKER_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_1_zw1bwd.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_2_pplvph.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569807/Fit_3_mkggnr.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569808/Fit_4_fktcat.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569808/Fit_5_z5ysrm.png'
      ],
      details: {
        JokerBauble: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/staff1_ld2xnm.jpg',
          'Joker Bauble',
          'ICE Joker',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/staff1_ld2xnm.jpg'
        ],
        JokerCap: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/hat1_qpw84y.jpg',
          'Cap\'N\'Bells',
          'ICE Joker',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/hat1_qpw84y.jpg'
        ],
        JokerRuffle: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/upperbody_f_1_tnvzse.jpg',
          'Joker Ruffle',
          'ICE Joker',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569827/upperbody_f_1_tnvzse.jpg'
        ],
        JokerSkirt: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569826/lowerbody_m1_qwvegm.jpg',
          'Joker Skirt',
          'ICE Joker',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569826/lowerbody_m1_qwvegm.jpg'
        ],
        JokerWinklepickers: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/feet1_jb7qey.jpg',
          'Winklepickers',
          'ICE Joker',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1641569824/feet1_jb7qey.jpg'
        ]
      }
    },
    {
      title:   'Founding Fathers',
      address: Global.ADDRESSES.COLLECTION_FOUNDING_FATHERS_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_1_fvhl6y.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_2_pqzdsy.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_3_yloaxi.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_4_zn5mqz.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116036/Fit_5_cnndmr.png'
      ],
      details: {
        Feather: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116020/feather_level_1_rd61am.png',
          'Father Feather',
          'Founding Fathers',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116020/feather_level_1_rd61am.png'
        ],
        Flow: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116025/hair_level_1_dampks.png',
          'Father Flow',
          'Founding Fathers',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116025/hair_level_1_dampks.png'
        ],
        Frock: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116021/coat_level_1_ivacwe.png',
          'Father Frock',
          'Founding Fathers',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116021/coat_level_1_ivacwe.png'
        ],
        Breeches: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116030/pants_level_1_srgdhc.png',
          'Father Breeches',
          'Founding Fathers',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116030/pants_level_1_srgdhc.png'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116026/mules_level_1_u7jgmh.png',
          'Father Mules',
          'Founding Fathers',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1640116026/mules_level_1_u7jgmh.png'
        ]
      }
    },
    {
      title:   'Crypto Drip',
      address: Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_1_nbpz6x.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984401/CryptoDrip_Level_2_nigfx7.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984405/CryptoDrip_Level_3_nsemyd.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_4_es8z5p.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984404/CryptoDrip_Level_5_d41jkl.png'
      ],
      details: {
        Glasses: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984495/Glasses_Level_1_sn5dnw.png',
          'Drip Shades',
          'Crypto Drip',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984495/Glasses_Level_1_sn5dnw.png'
        ],
        Hat: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984493/Hat_level_1_vxxht6.png',
          'Drip Bucket',
          'Crypto Drip',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984493/Hat_level_1_vxxht6.png'
        ],
        Jacket: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984503/puffer_level_1_nimjkk.png',
          'Drip Jacket',
          'Crypto Drip',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984503/puffer_level_1_nimjkk.png'
        ],
        Pants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984500/pants_level_1_f4xcuo.png',
          'Drip Drawers',
          'Crypto Drip',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984500/pants_level_1_f4xcuo.png'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984504/Shoes_Level_1_jbsjgf.png',
          'Drip Kicks',
          'Crypto Drip',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1638984504/Shoes_Level_1_jbsjgf.png'
        ]
      }
    },
    {
      title:   'Bomber',
      address: Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_1_aqjlun.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_2_eg3o0c.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_3_sxwgci.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_4_ad2vxh.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637107740/Bomber%20Fit/Bomber_5_ixqifi.png'
      ],
      details: {
        Glasses: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png',
          'Bomber Glasses',
          'Bomber',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091240/Bomber%20Fit/glasses_grey_qmjxqp.png'
        ],
        Hat: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png',
          'Bomber Hat',
          'Bomber',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091241/Bomber%20Fit/hat_grey_m_ptl8se.png'
        ],
        Top: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png',
          'Bomber Jacket',
          'Bomber',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/upperbody_grey_m_exs6ms.png'
        ],
        Pants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png',
          'Bomber Pants',
          'Bomber',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091242/Bomber%20Fit/pants_grey_m_zfrety.png'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png',
          'Bomber Shoes',
          'Bomber',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091243/Bomber%20Fit/shoes_grey_gftpjo.png'
        ]
      }
    },
    {
      title:   'Linen',
      address: Global.ADDRESSES.COLLECTION_LINENS_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_1_hqogna.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_2_s3wrak.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088369/Linens_3_qrbcbx.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_4_jgqlue.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1637088370/Linens_5_vplmii.png'
      ],
      details: {
        Cigar: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png',
          'XL Pipe',
          'Linen',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091411/Linen%20Fit/pipe_grery_lhnu6p.png'
        ],
        Hat: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png',
          'Boater Hat',
          'Linen',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091409/Linen%20Fit/hat_grey_m_m8dbi3.png'
        ],
        Top: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png',
          'Linen Shirt',
          'Linen',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091412/Linen%20Fit/shirt_grey_m_e61mwo.png'
        ],
        Pants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png',
          'Linen Pants',
          'Linen',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091410/Linen%20Fit/pants_grey_m_ofahds.png'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png',
          'Boater Shoes',
          'Linen',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1637091413/Linen%20Fit/shoes_grey_mkdkto.png'
        ]
      }
    },
    {
      title:   'Party Host',
      address: Global.ADDRESSES.COLLECTION_PH_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_1_Hugh_mwzapj.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054315/Level_2_Hugh_t2g9tc.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_3_Hugh_nhbkdo.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_4_Hugh_jwxah3.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1636054316/Level_5_Hugh_ogwkwo.png'
      ],
      details: {
        Glasses: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Shades_Level_1_x4axck.png',
          'Smoking Glasses',
          'Party Host',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg'
        ],
        Hat: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Sailor-Hat-_Level-1_jq3fnn.png',
          'Captains Hat',
          'Party Host',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg'
        ],
        SmokingJacket: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133628/Smoking_Jacket_Level_1_h8khui.png',
          'Smoking Jacket',
          'Party Host',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg'
        ],
        Pants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Pants_Level_1_y4iyir.png',
          'Smoking Pants',
          'Party Host',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1636133629/Slippers_Level_1_pmeiq1.png',
          'Slippers',
          'Party Host',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg'
        ]
      }
    },
    {
      title:   'DG Suit',
      address: Global.ADDRESSES.COLLECTION_V2_ADDRESS,
      preview: [
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_1_h5zizs.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_2_y8onmu.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_3_xhaxho.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_4_uribpq.png',
        'https://res.cloudinary.com/dnzambf4m/image/upload/v1633727889/Fit_5_mmcqjy.png'
      ],
      details: {
        Glasses: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_money_shades_rank1_eyewear_knm0f4.png',
          'Shades',
          'DG Suit',
          'Accessory',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatAccessory_s1cjpg.svg'
        ],
        Cigar: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_cigar_rank1_eyewear_lk5lnu.png',
          'Cigar',
          'DG Suit',
          'Head',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatHat_pypkjx.svg'
        ],
        Top: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_top_rank1_upper_body_qlnqky.png',
          'Blazer',
          'DG Suit',
          'Torso',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631728323/FlatClothes-01_1_kbpyfj.svg'
        ],
        Pants: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_suit_bottom_rank1_lower_body_trd5yw.png',
          'Trousers',
          'DG Suit',
          'Legs',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatLegs_tn9b57.svg'
        ],
        Shoes: [
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631638434/dg_dress_rank1_shoes_feet_w7ncwa.png',
          'Loafers',
          'DG Suit',
          'Feet',
          'https://res.cloudinary.com/dnzambf4m/image/upload/v1631806696/FlatShoes_hjvr3p.svg'
        ]
      }
    }
  ];

  // helper functions
  function updatePreviewLevel(previewIndex, activeId): void {
    const levels = previewLevel;

    levels[previewIndex] = activeId;

    setPreviewLevel([].concat(levels));
  }

  function useWindowSize(): { width: any; height: any } {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width:  undefined,
      height: undefined
    });

    // Handler to call on window resize
    function handleResize(): void {
      // Set window width/height to state
      setWindowSize({
        width:  window.innerWidth,
        height: window.innerHeight
      });
    }

    useEffect(() => {
      // only execute all the code below in client side
      if (typeof window !== 'undefined') {
        // Add event listener
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []); // Empty array ensures that effect is only run on mount

    return windowSize;
  }

  function CarouselNextArrow(props: ButtonProps): ReactElement {
    const { className, onClick } = props;

    return (
      <div className={className} onClick={onClick}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1638236358/Right_Chevron_3x_cxt9x8.png" alt="nextArrow" />
      </div>
    );
  }

  function CarouselPrevArrow(props: ButtonProps): ReactElement {
    const { className, onClick } = props;

    return (
      <div className={className} onClick={onClick}>
        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1638236358/Right_Chevron_3x_cxt9x8.png" alt="nextArrow" />
      </div>
    );
  }

  function getCarousel(props: ButtonProps): ReactElement {
    const size = useWindowSize();
    const settings = {
      className:     'slider variable-width',
      dots:          false,
      infinite:      false,
      swipeToSlide:  true,
      variableWidth: true,
      slidesToShow:  size.width <= 499 ? 1 : size.width <= 1040 ? Math.floor((size.width - 120) / 300) : Math.min(Math.floor((size.width - 300) / 300), 6),
      nextArrow:     <CarouselNextArrow onClick={() => props.onClick && props.onClick()} />,
      prevArrow:     <CarouselPrevArrow onClick={() => props.onClick && props.onClick()} />
    };

    const checkSoldOutStatus = (itemList, maxMint): ReactElement => itemList.some(item => item[0] - maxMint !== 0);

    const buyOnSecondaryButton = (): ReactElement => <Button className={styles.wearable_button}>Buy on Secondary</Button>;

    const soldOutButton = (): ReactElement => (
      <Button disabled className={styles.sold_button}>
        Sold Out
      </Button>
    );

    return (
      <section>
        {wearables.map((wearable, index) => {
          let itemLimits;

          if (index === 0) {
            itemLimits = state.itemLimits11;
          } else if (index === 1) {
            itemLimits = state.itemLimits10;
          } else if (index === 2) {
            itemLimits = state.itemLimits9;
          } else if (index === 3) {
            itemLimits = state.itemLimits8;
          } else if (index === 4) {
            itemLimits = state.itemLimits7;
          } else if (index === 5) {
            itemLimits = state.itemLimits6;
          } else if (index === 6) {
            itemLimits = state.itemLimits5;
          } else if (index === 7) {
            itemLimits = state.itemLimits4;
          } else if (index === 8) {
            itemLimits = state.itemLimits3;
          } else if (index === 9) {
            itemLimits = state.itemLimits2;
          } else if (index === 10) {
            itemLimits = state.itemLimits1;
          }

          let maxMintCounts = 0;

          if (state.appConfig && state.appConfig.maxMintCounts) {
            Object.keys(state.appConfig.maxMintCounts).map(address => {
              if (address === wearable?.address?.toLowerCase()) {
                maxMintCounts = state.appConfig.maxMintCounts[address];
              }
            });
          }

          return (
            <section key={index} className={styles.wearable_section}>
              <h3>
                {wearable.title}
                {index === 0 && state.userLoggedIn && <CheckMintableModal />}
              </h3>

              <Slider {...settings}>
                <div className={styles.games_container} style={{ paddingBottom: '20px' }}>
                  <div>
                    {wearable.preview.map((img, i) => (
                      <img key={i} className={i === previewLevel[index] ? styles.preview_nft_image : styles.preview_nft_image_none} src={img} />
                    ))}
                  </div>
                  <div className={styles.preview_description}>
                    <h1 className={styles.title}>PREVIEW FIT LEVELS</h1>
                    <div className={styles.preview_level_select_div}>
                      {wearable.preview.map((img, i) => (
                        <div key={i} className={previewLevel[index] === i ? styles.selectActive : styles.select} onClick={() => updatePreviewLevel(index, i)}>
                          {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {Object.keys(wearable.details).map((item, i) => (
                  <div key={i} className={styles.games_container}>
                    <div className={styles.wear_box_purple}>
                      <div className={styles.fullDiv}>
                        <div className={styles.imgDiv}>
                          <img className={styles.img} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1645146487/iceenabledbanner_jvzh8u.svg" />
                          <Popup
                            trigger={<img className={styles.tooltip} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />}
                            position="top left"
                            hideOnScroll={true}
                            className={cn('p2e_enabled_tooltip', styles.popup)}
                          >
                            <Popup.Content className={styles.tooltipContent}>
                              <img className={styles.popup_info} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631640045/ICE_Info_bbiag6.svg" />
                              <p className={styles.popup_content}>
                                ICE Enabled
                                <br /> wearables allow you to earn real
                                <br /> cash value from free-to-play ICE
                                <br /> poker tables.
                              </p>
                            </Popup.Content>
                          </Popup>
                        </div>
                      </div>
                    </div>

                    <img className={styles.nft_image} src={wearable.details[item][0]} />

                    <div className={styles.nft_description}>
                      <span style={{ display: 'flex', justifyContent: 'center' }}>
                        <p className={styles.nft_info}>{wearable.details[item][3]}</p>

                        {state.userStatus >= 4 ? (
                          <p className={styles.nft_info}>
                            {itemLimits[i][0] >= 0 ? maxMintCounts - itemLimits[i][0] : '- '} of {maxMintCounts} left
                          </p>
                        ) : (
                          <p className={styles.nft_info}>- of {maxMintCounts} left</p>
                        )}
                      </span>
                      <p className={styles.nft_other_p}>{wearable.details[item][2]}</p>
                      <h3 className={styles.nft_other_h3}>{wearable.details[item][1]}</h3>
                    </div>

                    <div className={styles.button_container}>
                      {(() => {
                        // Logged In States
                        if (state.userLoggedIn) {
                          if (state.userStatus >= 4 && itemLimits[i][0] < 0) {
                            // Items still loading, display spinner
                            return (
                              <Button disabled className={styles.sold_button}>
                                <Spinner width={20} height={20} />
                              </Button>
                            );

                            // Items loaded
                            // Minting enabled
                          } else if (state.userStatus >= state.appConfig.minMintVerifyStep && maxMintCounts - itemLimits[i][0] > 0) {
                            return (
                              <div className={styles.flex_50}>
                                <ModalMintWearable
                                  index={i}
                                  maxMintCounts={maxMintCounts}
                                  numberLeft={itemLimits[i][0]}
                                  itemId={itemLimits[i][1]}
                                  contractAddress={itemLimits[5]}
                                  wearableImg={wearable.details[item][0]}
                                  wearableBodyType={wearable.details[item][3]}
                                  wearableBodyImg={wearable.details[item][4]}
                                  wearableName={wearable.details[item][1]}
                                />
                              </div>
                            );

                            // Minting Disabled States
                          } else if (maxMintCounts !== 0 && maxMintCounts - itemLimits[i][0] >= 0 && maxMintCounts - itemLimits[i][0] < 1) {
                            return (
                              <a
                                className={styles.flex_50}
                                href="https://opensea.io/collection/decentral-games-ice"
                                target="_blank"
                                style={{
                                  width: '100%'
                                }}
                                rel="noreferrer"
                              >
                                {

                                  // Show "Buy on Secondary" if all items in series are sold out, otherwise show "Sold Out" button
                                  checkSoldOutStatus(itemLimits.slice(0, -1), maxMintCounts) ? soldOutButton() : buyOnSecondaryButton()
                                }
                              </a>
                            );
                          } else if (
                            state.userStatus < state.appConfig.minMintVerifyStep &&
                            (maxMintCounts - itemLimits[i][0] > 0 || (maxMintCounts === 0 && itemLimits[i][0] === 0))
                          ) {
                            // Coming Soon State
                            return (
                              <Button disabled className={styles.sold_button}>
                                Coming Soon!
                              </Button>
                            );
                          } else {
                            return <p>Failed to load mint button.</p>;
                          }
                        } else {
                          // Logged Out State
                          return (
                            <div className={styles.flex_50}>
                              <ModalLoginICE />
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                ))}
              </Slider>
            </section>
          );
        })}
      </section>
    );
  }

  return (
    <div className={styles.main_wrapper}>
      <span className={styles.iceWearablesMarketplace}>
        <div className={styles.header}>
          <div className={styles.header_top}>
            <h1>ICE Wearables Marketplace</h1>
            {state.userStatus > 14 && (
              <span className={styles.white_listed_address}>
                Whitelisted Address &nbsp;
                <svg width="7" height="6" viewBox="0 0 7 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.06563 5.68435C3.28438 5.68435 3.45625 5.59998 3.575 5.42498L6.48438 0.990601C6.56875 0.862476 6.60313 0.740601 6.60313 0.628101C6.60313 0.324976 6.37188 0.0999755 6.05938 0.0999755C5.84688 0.0999755 5.7125 0.178101 5.58125 0.381226L3.05313 4.36873L1.77188 2.79685C1.65313 2.6531 1.52188 2.5906 1.34063 2.5906C1.025 2.5906 0.796875 2.8156 0.796875 3.12185C0.796875 3.25935 0.8375 3.3781 0.95625 3.51248L2.56875 5.44998C2.70313 5.60935 2.85938 5.68435 3.06563 5.68435Z"
                    fill="#1F1F1F"
                  />
                </svg>
              </span>
            )}
          </div>

          <p className={styles.marketplace_p}>
            ICE Wearables give you table access to free to play, play-to-earn poker. Learn more by{' '}
            <a href="https://ice.decentral.games/" target="_blank" rel="noreferrer">
              clicking here.
            </a>
          </p>
        </div>

        <div className={styles.outter_games_container}>{getCarousel(null)}</div>
        {/* {openCheckEligibility && <CheckMintableModal />} */}
      </span>
    </div>
  );
};

export default MarketPlace;
