// third-party public API keys
const KEYS = {
  BICONOMY_API_1: 'iW9B13586.996fe1e6-5969-40cb-b986-6ea37cfeec8f',
  BICONOMY_API_2: 'A7mK3_ymC.92264b6e-1289-4e01-9f5f-6b53de2c69d4',
  TRANSAK_API: '6f2cd88d-b241-4cdb-8f1a-a034cda14bf6',
  GOOGLE_ANALYTICS: 'UA-146057069-1',
  BUTTER_TOKEN: 'd7d6d8425656d3cfe5f45d7a0a3a8470ef09d434',
  SEGMENT_WRITE_KEY: 'pK03oncLYCxY1DJtTmnJnuwLByq2RlAb',
  CONNEXT_PUBLIC_ID: 'vector6Dd1twoMwXwdphzgY2JuM639keuQDRvUfQub3Jy5aLLYqa14Np'
};


// common constant values
const CONSTANTS = {
  BASE_URL: 'https://decentral.games',
  MAX_AMOUNT: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
  GAS_LIMIT: '3000000', // was '900000'
  GAS_AMOUNT: '80000000000', // was '20000000000'
  FACTOR: 1000000000000000000, // ETH-to-WEI multiplication factor
  PARENT_NETWORK_ID: 1, // 1: Mainnet, 3: Ropsten, 5: Goerli
  ACTIVE_PERIOD: 43200, // user account active period: 3600 === 1 hour // 43200
  MAINNET_URL: 'https://mainnet.infura.io/v3/1a359efdd4d04d89b5c1b63de776d444',
  MATIC_NETWORK_ID: 137, // Mumbai: 80001, Mainnet: 137
  MATIC_URL: 'https://polygon-rpc.com/', // 'https://rpc-mainnet.matic.network',
  MATIC_EXPLORER: 'https://explorer-mainnet.maticvigil.com',
  TITLE: 'Decentral Games',
  DESCRIPTION: 'Free to play, play to earn gaming in the metaverse. Play ICE Poker, trade NFTs, vote in the DAO, and earn real value from your favorite games.',
  DISCORD_URL: 'https://discord.gg/cvbSNzY',
  SOCIAL_HANDLE: 'decentralgames',
  MAX_ITEM_COUNT: 10, // maximum number of tokenOfOwner indexes to query on the accessories contract
  MAX_DELEGATION_COUNT: 5, // maximum number of delegated NFTs a user can have
  VERIFY_URL: 'staging.decentral.games',
  WETH_MINT_AMOUNT: 0.25, // amount of WETH required for minting
  DG_STAKED_AMOUNT: 1, // amount of DG user is required to have staked in order to mint wearable
  XDG_STAKED_AMOUNT: 1000, // amount of DG user is required to have staked in order to mint wearable
  POOLING_TIME_OUT: 8000, // API endpoint request pool interval (milliseconds)
  POOLING_LIMIT_COUNT: 6, // attempt to call API endpoint this number of times
  MINT_STATUS: 29, // minimum userStatus level for minting wearables (we can replace with appConfig variable when it's available)
};

const IMG_URLS_UPGRADE = {
  Trousers: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank1_lower_body_o18u5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank1_lower_body_o18u5h.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank2_lower_body_x8duyn.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank3_lower_body_cogifo.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank4_lower_body_bdz0gt.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_bottom_rank5_lower_body_jz4bwy.png',
  ],
  Blazer: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank1_upper_body_zw12j7.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank1_upper_body_zw12j7.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank2_upper_body_jifiuq.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank3_upper_body_suw9ai.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank4_upper_body_cyz0gk.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_suit_top_rank5_upper_body_ff5n1t.png',
  ],
  Cigar: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank1_eyewear_kt6mqk.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank1_eyewear_kt6mqk.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank2_eyewear_r55vvl.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank3_eyewear_uydyit.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank4_eyewear_mtyrtr.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_cigar_rank5_eyewear_hromtz.png',
  ],
  Loafers: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank1_shoes_feet_nxazsi.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269376/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank1_shoes_feet_nxazsi.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank2_shoes_feet_l83rhe.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank3_shoes_feet_gvjjb8.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank4_shoes_feet_avry6l.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_dress_rank5_shoes_feet_tpnzfv.png',
  ],
  Shades: [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank1_eyewear_shmmce.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank1_eyewear_shmmce.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank2_eyewear_xqvbkf.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank3_eyewear_anyqat.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269377/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank4_eyewear_eejcjh.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1634269375/DG%20ICE%20Suit%20Thumbnails%20%28Square%29/dg_money_shades_rank5_eyewear_umdmvc.png',
  ],
  'Smoking Shoes': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/slippers_1_wwkyrb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/slippers_1_wwkyrb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592481/slippers_2_dhwhdy.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/slippers_3_l0bpxr.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/slippers_4_b48srj.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/slippers_5_nusll8.png',
  ],
  'Smoking Pants': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592477/pants_1_taafzw.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592477/pants_1_taafzw.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592477/pants_2_wjenib.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592479/pants_3_dfspif.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592479/pants_4_popgjm.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592478/pants_5_hj4ezw.png',
  ],
  'Smoking Jacket': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592478/robe_1_wjllvx.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592478/robe_1_wjllvx.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592478/robe_2_hbmlze.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592478/robe_3_ckgy99.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592480/robe_4_dovw7i.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592479/robe_5_pezqkh.png',
  ],
  "Captain's Hat": [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/hat_m_1_s3vhqj.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/hat_m_1_s3vhqj.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592477/hat_m_2_tegl1l.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/hat_m_3_exygib.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592476/hat_m_4_y9flz7.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592477/hat_m_5_zulgdg.png',
  ],
  'Smoking Glasses': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/glasses_1_pxzjw6.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/glasses_1_pxzjw6.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592475/glasses_2_dwrwho.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592476/glasses_3_y8kgci.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592474/glasses_4_ihsifq.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1636592476/glasses_5_b57ugk.png',
  ],
  'Boater Hat': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172287/hat_grey_m_xfx9s3.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172287/hat_grey_m_xfx9s3.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172286/hat_green_m_n7gcr2.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172286/hat_purple_m_ryoxvh.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172286/hat_pink_m_lotlp6.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172292/hat_gold_m_j840d3.png',
  ],
  'XL Pipe': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pipe_grery_hjgjve.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pipe_grery_hjgjve.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172290/pipe_green_g7chzb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pipe_purple_hpdrhp.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172291/pipe_pink_ozwkzw.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pipe_gold_o9g9rp.png',
  ],
  'Linen Shirt': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/shirt_grey_m_jznjkn.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/shirt_grey_m_jznjkn.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172291/shirt_green_m_kcakd1.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172291/shirt_purple_m_djnlxa.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172291/shirt_pink_m_da4udz.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172288/shirt_gold_m_qqpd2b.png',
  ],
  'Linen Pants': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pants_grey_m_zcpmbd.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/pants_grey_m_zcpmbd.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172288/pants_green_m_dgkjtv.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172291/pants_purple_m_mublim.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172290/pants_pink_m_sliadb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172288/pants_gold_m_asyzwz.png',
  ],
  'Boater Shoes': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172287/shoes_grey_tgmj4n.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172287/shoes_grey_tgmj4n.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172290/shoes_green_frnbtm.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172287/shoes_purple_uhoyvi.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172292/shoes_pink_himngr.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637172289/shoes_gold_cx4ygw.png',
  ],
  'Bomber Pants': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_grey_m_kzmnh3.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_grey_m_kzmnh3.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_green_m_vtdddg.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_purple_m_lqwt9b.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_pink_m_z0beu4.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024013/ICE%20Bomber%20Thumbnails%20%28Square%29/pants_gold_m_waxavs.jpg',
  ],
  'Bomber Hat': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_grey_m_incioq.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_grey_m_incioq.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_green_m_uxmjhy.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_purple_m_tgxs8e.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_pink_m_ruzzlw.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023992/ICE%20Bomber%20Thumbnails%20%28Square%29/hat_gold_m_nsmuaq.jpg',
  ],
  'Bomber Jacket': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_grey_m_jpnabv.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_grey_m_jpnabv.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_green_m_f8y4a2.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_purple_m_cv7uxy.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_pink_m_vzcfxl.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024053/ICE%20Bomber%20Thumbnails%20%28Square%29/upperbody_gold_m_oxqbqh.jpg',
  ],
  'Bomber Glasses': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_grey_np5pwz.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_grey_np5pwz.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_green_gzoe43.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_purple_w7yl9g.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_pink_qqjwa1.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637023960/ICE%20Bomber%20Thumbnails%20%28Square%29/glasses_gold_fogrzy.jpg',
  ],
  'Bomber Shoes': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_grey_r1pu6s.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_grey_r1pu6s.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_green_gjqjnt.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_purple_bsqoyl.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_pink_cnuzg6.jpg',
    'https://res.cloudinary.com/dnzambf4m/image/upload/q_auto:good/v1637024032/ICE%20Bomber%20Thumbnails%20%28Square%29/shoes_gold_ishar9.jpg',
  ],
  'Drip Shades': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Glasses_Level_1_illrek.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Glasses_Level_1_illrek.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/Glasses_level_2_epfvlj.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Glasses_Level_3_ofjya7.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/Glasses_level_4_vsuytz.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/Glasses_Level_5_rmgi3d.png',
  ],
  'Drip Bucket': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/Hat_level_1_tk8gex.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/Hat_level_1_tk8gex.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Hat_Level_2_vjczks.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/Hat_level_3_fykfxx.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/Hat_Level_4_zvyzay.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/Puffer_level_5_kedpfb.png',
  ],
  'Drip Jacket': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/puffer_level_1_lzuqdb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/puffer_level_1_lzuqdb.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781042/Crypto%20Drip/Individual%20Assets/puffer_level_2_aixvap.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781043/Crypto%20Drip/Individual%20Assets/Puffer_Level_3_chfc1k.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781043/Crypto%20Drip/Individual%20Assets/Puffer_level_4_unpu5b.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/jacket_level_5_gvoxbe.png',
  ],
  'Drip Drawers': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781044/Crypto%20Drip/Individual%20Assets/pants_level_1_hh6qax.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781044/Crypto%20Drip/Individual%20Assets/pants_level_1_hh6qax.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781043/Crypto%20Drip/Individual%20Assets/pants_level_2_zxrnrp.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781043/Crypto%20Drip/Individual%20Assets/pants_level_3_g3aehz.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781044/Crypto%20Drip/Individual%20Assets/pants_level_4_znfpfu.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781043/Crypto%20Drip/Individual%20Assets/pants_level_5_b8csos.png',
  ],
  'Drip Kicks': [
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Shoes_Level_1_cd2fil.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Shoes_Level_1_cd2fil.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/Shoes_Level_2_zycqxy.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781041/Crypto%20Drip/Individual%20Assets/Shoes_Level_3_a45sip.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/Shoes_level_4_db0xpw.png',
    'https://res.cloudinary.com/dnzambf4m/image/upload/v1639781040/Crypto%20Drip/Individual%20Assets/shoes_level_5_ieba6p.png',
  ],
};

// wallet and contract addresses
const ADDRESSES = (() => {
  const OWNER_WALLET_ADDRESS = '0x3c383b7ffd5d2bf24ebd1fc8509cefa9b7d1976f';
  const WORKER_WALLET_ADDRESS = '0x1FcdE174C13691ef0C13fcEE042e0951452C0f8A';
  const ROOT_TOKEN_ADDRESS_DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
  const ROOT_TOKEN_ADDRESS_MANA = '0x0f5d2fb29fb7d3cfee444a200298f468908cc942';
  const ROOT_TOKEN_ADDRESS_DG = '0xee06a81a695750e71a662b51066f2c74cf4478a0';
  const ROOT_TOKEN_ADDRESS_DG_LIGHT = '0x4b520c812e8430659fc9f12f6d0c39026c83588d';
  const ROOT_TOKEN_ADDRESS_USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7';
  const ROOT_TOKEN_ADDRESS_ATRI = '0xdacD69347dE42baBfAEcD09dC88958378780FB62';
  const ROOT_TOKEN_ADDRESS_ICE = '';
  const ROOT_DG_LIGHT_BRIDGE_ADDRESS = '';

  const ROOT_DG_TOWN_HALL_ADDRESS = '0x4f81c790581b240a5c948afd173620ecc8c71c8d';

  const CHILD_TOKEN_ADDRESS_DAI = '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063';
  const CHILD_TOKEN_ADDRESS_MANA = '0xA1c57f48F0Deb89f569dFbE6E2B7f46D33606fD4';
  const CHILD_TOKEN_ADDRESS_DG = '0x2a93172c8DCCbfBC60a39d56183B7279a2F647b4';
  const CHILD_TOKEN_ADDRESS_DG_LIGHT = '0xef938b6da8576a896f6E0321ef80996F4890f9c4';
  const CHILD_TOKEN_ADDRESS_USDT = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
  const CHILD_TOKEN_ADDRESS_ATRI = '0xB140665ddE25c644c6B418e417C930dE8A8a6Ac9';
  const CHILD_TOKEN_ADDRESS_WETH = '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619';
  const CHILD_TOKEN_ADDRESS_ICE = '0xc6c855ad634dcdad23e64da71ba85b8c51e5ad7c';
  const CHILD_DG_LIGHT_BRIDGE_ADDRESS = '0x0f09D3a5ACeA61F7ceBd5f2FeA62c070c9730a53';

  const CHILD_TOKEN_XDG_ADDRESS = '0xc6480Da81151B2277761024599E8Db2Ad4C388C8';

  const ROPSTEN_TOKEN_ADDRESS_DG = '0x5f3f4a1f10C8F2ca2D589A19D8Fe488f49FAb04A';
  const ROPSTEN_TOKEN_ADDRESS_DG_LIGHT = '0x40E25786ACE1a546b61CE7BD0C0E04bdBd52dF76';
  const ROPSTEN_DG_LIGHT_BRIDGE_ADDRESS = '';
  const ROPSTEN_DG_TOWN_HALL_ADDRESS = '0xAa4Add3f618a59D05d1Ba8c9e6Ce22bB5d819C8f';
  const TREASURY_CONTRACT_ADDRESS = '0xBF79cE2fbd819e5aBC2327563D02a200255B7Cb3';
  const DG_POINTER_CONTRACT_ADDRESS = '0x11e46DB40d4438D1c64f68993CA43b03Ac1B6A6B';
  const DG_POINTER_CONTRACT_ADDRESS_NEW = '0xC751C3D67291E95e02E71E713E51D8CD27e8d04B';

  const DG_STAKING_BALANCER_ADDRESS_1 = '0xA9380E21fF4Ed3218a7a518D16c464ff0DcBf143';
  const DG_STAKING_BALANCER_ADDRESS_2 = '0x444b3917f08a0c7a39267b1ec2f46713c5492db2';

  const DG_STAKING_UNISWAP_ADDRESS = '0x55ceb773c494cf7ad4f2e3170936866bd7eff1c9';

  const DG_STAKING_GOVERNANCE_ADDRESS = '0xf1d113059517dbddd99ab9caffa76fc01f0557cd';

  const DG_KEEPER_CONTRACT_ADDRESS = '0x6b5C29B035Ec40a7cE567f1F11cc90eBfa4f1D17';
  const ICE_REGISTRANT_ADDRESS = '0xC9a67eD1472A76d064C826B54c144Ca00DAE4015';
  const BP_TOKEN_ADDRESS_1 = '0xca54c398195fce98856888b0fd97a9470a140f71';
  const BP_TOKEN_ADDRESS_2 = '0x3cf393b95a4fbf9b2bdfc2011fd6675cf51d3e5d';
  const UNISWAP_ADDRESS_STAKING = '0x44c21f5dcb285d92320ae345c92e8b6204be8cdf';
  const UNISWAP_ADDRESS_WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
  const TOMINOYA_CONTRACT_ADDRESS = '0xF4618abb5E8031454238696A0F013DcD1476dc33';
  const DECENTRAL_GAMES_EVENTS = '0x154620ddfdcd6ab15dd9c1682386debad1eef536';
  const COLLECTION_V2_ADDRESS = '0xCb06f6aeE0655252a3f6f2884680421D55d3C645';
  const COLLECTION_PH_ADDRESS = '0x4cd15dcd96362cF85E19039C3C2D661e5e43145E';
  const COLLECTION_LINENS_ADDRESS = '0xd79cf5a41d8caec4688e01b4754ea2da6f51e856';
  const COLLECTION_BOMBER_ADDRESS = '0xd07a56f7198ae6e4e3d6738bd8c4b81d21bf0403';
  const COLLECTION_CRYPTO_DRIP_ADDRESS = '0x897243a54b03b46a17b55d5609465e9719a6ffa0';
  const ICE_TOKEN_ADDRESS = '0xc6C855AD634dCDAd23e64DA71Ba85b8C51E5aD7c';

  console.log('OWNER_WALLET_ADDRESS: ' + OWNER_WALLET_ADDRESS);
  console.log('WORKER_WALLET_ADDRESS: ' + WORKER_WALLET_ADDRESS);
  console.log('ROOT_TOKEN_ADDRESS_DAI: ' + ROOT_TOKEN_ADDRESS_DAI);
  console.log('ROOT_TOKEN_ADDRESS_MANA: ' + ROOT_TOKEN_ADDRESS_MANA);
  console.log('ROOT_TOKEN_ADDRESS_DG: ' + ROOT_TOKEN_ADDRESS_DG);
  console.log('ROOT_TOKEN_ADDRESS_DG_LIGHT: ' + ROOT_TOKEN_ADDRESS_DG_LIGHT);
  console.log('ROOT_TOKEN_ADDRESS_USDT: ' + ROOT_TOKEN_ADDRESS_USDT);
  console.log('ROOT_TOKEN_ADDRESS_ATRI: ' + ROOT_TOKEN_ADDRESS_ATRI);
  console.log('ROOT_TOKEN_ADDRESS_ICE: ' + ROOT_TOKEN_ADDRESS_ICE);
  console.log('ROOT_DG_LIGHT_BRIDGE_ADDRESS: ' + ROOT_DG_LIGHT_BRIDGE_ADDRESS);
  console.log('ROOT_DG_TOWN_HALL_ADDRESS: ' + ROOT_DG_TOWN_HALL_ADDRESS);
  console.log('CHILD_TOKEN_ADDRESS_DAI: ' + CHILD_TOKEN_ADDRESS_DAI);
  console.log('CHILD_TOKEN_ADDRESS_MANA: ' + CHILD_TOKEN_ADDRESS_MANA);
  console.log('CHILD_TOKEN_ADDRESS_DG: ' + CHILD_TOKEN_ADDRESS_DG);
  console.log('CHILD_TOKEN_ADDRESS_DG_LIGHT: ' + CHILD_TOKEN_ADDRESS_DG_LIGHT);
  console.log('CHILD_TOKEN_ADDRESS_USDT: ' + CHILD_TOKEN_ADDRESS_USDT);
  console.log('CHILD_TOKEN_ADDRESS_ATRI: ' + CHILD_TOKEN_ADDRESS_ATRI);
  console.log('CHILD_TOKEN_ADDRESS_WETH: ' + CHILD_TOKEN_ADDRESS_WETH);
  console.log('CHILD_TOKEN_ADDRESS_ICE: ' + CHILD_TOKEN_ADDRESS_ICE);
  console.log('CHILD_DG_LIGHT_BRIDGE_ADDRESS: ' + CHILD_DG_LIGHT_BRIDGE_ADDRESS);

  console.log('CHILD_TOKEN_XDG_ADDRESS: ' + CHILD_TOKEN_XDG_ADDRESS);

  console.log('TREASURY_CONTRACT_ADDRESS: ' + TREASURY_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS: ' + DG_POINTER_CONTRACT_ADDRESS);
  console.log('DG_POINTER_CONTRACT_ADDRESS_NEW: ' + DG_POINTER_CONTRACT_ADDRESS_NEW);
  console.log('DG_STAKING_BALANCER_ADDRESS_1: ' + DG_STAKING_BALANCER_ADDRESS_1);
  console.log('DG_STAKING_BALANCER_ADDRESS_2: ' + DG_STAKING_BALANCER_ADDRESS_2);
  console.log('DG_STAKING_UNISWAP_ADDRESS: ' + DG_STAKING_UNISWAP_ADDRESS);
  console.log('DG_STAKING_GOVERNANCE_ADDRESS: ' + DG_STAKING_GOVERNANCE_ADDRESS);
  console.log('DG_KEEPER_CONTRACT_ADDRESS: ' + DG_KEEPER_CONTRACT_ADDRESS);
  console.log('ICE_REGISTRANT_ADDRESS: ' + ICE_REGISTRANT_ADDRESS);
  console.log('BP_TOKEN_ADDRESS_1: ' + BP_TOKEN_ADDRESS_1);
  console.log('BP_TOKEN_ADDRESS_2: ' + BP_TOKEN_ADDRESS_2);
  console.log('UNISWAP_ADDRESS_STAKING: ' + UNISWAP_ADDRESS_STAKING);
  console.log('UNISWAP_ADDRESS_WETH: ' + UNISWAP_ADDRESS_WETH);
  console.log('TOMINOYA_CONTRACT_ADDRESS: ' + TOMINOYA_CONTRACT_ADDRESS);
  console.log('DECENTRAL_GAMES_EVENTS: ' + DECENTRAL_GAMES_EVENTS)
  console.log('COLLECTION_V2_ADDRESS: ' + COLLECTION_V2_ADDRESS)
  console.log('COLLECTION_PH_ADDRESS: ' + COLLECTION_PH_ADDRESS)
  console.log('COLLECTION_LINENS_ADDRESS: ' + COLLECTION_LINENS_ADDRESS)
  console.log('COLLECTION_BOMBER_ADDRESS: ' + COLLECTION_BOMBER_ADDRESS)
  console.log('ICE_TOKEN_ADDRESS: ' + ICE_TOKEN_ADDRESS)

  return {
    OWNER_WALLET_ADDRESS,
    WORKER_WALLET_ADDRESS,
    ROOT_TOKEN_ADDRESS_DAI,
    ROOT_TOKEN_ADDRESS_MANA,
    ROOT_TOKEN_ADDRESS_DG,
    ROOT_TOKEN_ADDRESS_DG_LIGHT,
    ROOT_TOKEN_ADDRESS_USDT,
    ROOT_TOKEN_ADDRESS_ATRI,
    ROOT_TOKEN_ADDRESS_ICE,
    ROOT_DG_LIGHT_BRIDGE_ADDRESS,
    ROOT_DG_TOWN_HALL_ADDRESS,
    CHILD_TOKEN_ADDRESS_DAI,
    CHILD_TOKEN_ADDRESS_MANA,
    CHILD_TOKEN_ADDRESS_DG,
    CHILD_TOKEN_ADDRESS_DG_LIGHT,
    CHILD_TOKEN_ADDRESS_USDT,
    CHILD_TOKEN_ADDRESS_ATRI,
    CHILD_TOKEN_ADDRESS_WETH,
    CHILD_TOKEN_ADDRESS_ICE,
    CHILD_DG_LIGHT_BRIDGE_ADDRESS,
    CHILD_TOKEN_XDG_ADDRESS,
    ROPSTEN_TOKEN_ADDRESS_DG,
    ROPSTEN_TOKEN_ADDRESS_DG_LIGHT,
    ROPSTEN_DG_LIGHT_BRIDGE_ADDRESS,
    ROPSTEN_DG_TOWN_HALL_ADDRESS,
    TREASURY_CONTRACT_ADDRESS,
    DG_POINTER_CONTRACT_ADDRESS,
    DG_POINTER_CONTRACT_ADDRESS_NEW,
    DG_STAKING_BALANCER_ADDRESS_1,
    DG_STAKING_BALANCER_ADDRESS_2,
    DG_STAKING_UNISWAP_ADDRESS,
    DG_STAKING_GOVERNANCE_ADDRESS,
    DG_KEEPER_CONTRACT_ADDRESS,
    ICE_REGISTRANT_ADDRESS,
    BP_TOKEN_ADDRESS_1,
    BP_TOKEN_ADDRESS_2,
    UNISWAP_ADDRESS_STAKING,
    UNISWAP_ADDRESS_WETH,
    TOMINOYA_CONTRACT_ADDRESS,
    DECENTRAL_GAMES_EVENTS,
    COLLECTION_V2_ADDRESS,
    COLLECTION_PH_ADDRESS,
    COLLECTION_LINENS_ADDRESS,
    COLLECTION_BOMBER_ADDRESS,
    COLLECTION_CRYPTO_DRIP_ADDRESS,
    ICE_TOKEN_ADDRESS
  };
})();

export default {
  KEYS,
  CONSTANTS,
  ADDRESSES,
  IMG_URLS_UPGRADE,
};
