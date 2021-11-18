import { useEffect, useState, useContext } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalIceBreakDown.module.scss';

const ModalIceBreakDown = ({
    history,
    setShowingBreakDown
}) => {
    const [open, setOpen] = useState(true);

    const defaultImgs = [
        "https://res.cloudinary.com/dnzambf4m/image/upload/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/v1637175172/playerStatsItemBg_mhds5h.png",
        "https://res.cloudinary.com/dnzambf4m/image/upload/v1637175172/playerStatsItemBg_mhds5h.png"
    ];

    const gamePlayTemp = [
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        }
    ]

    const delegationTemp = [
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 2091,
            xpEarned: 3,
            tier: 'Top 20%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592477/hat_m_5_zulgdg.png",
                    rank: 5,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592479/robe_5_pezqkh.png",
                    rank: 5,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_5_nusll8.png",
                    rank: 5,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        },
        {
            address: '0x723...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592476/hat_m_4_y9flz7.png",
                    rank: 4,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/robe_4_dovw7i.png",
                    rank: 4,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1636592480/slippers_3_l0bpxr.png",
                    rank: 4,
                    bonus: '48%',
                }
            ],
            iceEarned: 400,
            xpEarned: 6,
            tier: 'Bottom 10%',
        },
        {
            address: '0x724...2ab3',
            nfts: [
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/pipe_green_g7chzb.png",
                    rank: 2,
                    bonus: '42%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172291/shirt_green_m_kcakd1.png",
                    rank: 2,
                    bonus: '45%',
                },
                {
                    img: "https://res.cloudinary.com/dnzambf4m/image/upload/v1637172290/shoes_green_frnbtm.png",
                    rank: 2,
                    bonus: '48%',
                }
            ],
            iceEarned: 1920,
            xpEarned: 4,
            tier: 'Top 15%',
        }
    ]

    const records = history.type === 'Gameplay' ? gamePlayTemp : delegationTemp;

    return (
        <>
            <Modal
                className={styles.breakdown_modal}
                onClose={() => {
                    setOpen(false),
                        setShowingBreakDown(-1)
                }}
                onOpen={() => setOpen(true)}
                open={open}
                close
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

                <div className={styles.body}>
                    <div className={styles.title}>
                        <h2>{history.type} Breakdown</h2>
                        <p>{history.date}</p>
                    </div>

                    <div className={styles.history}>
                        <div className={styles.header}>
                            <div className={styles.address}>Address</div>
                            <div className={styles.nfts}>NFTS Worn</div>
                            <div className={styles.iceEarned}>ICE Earned</div>
                            <div className={styles.xpEarned}>XP Earned</div>
                            <div className={styles.tier}>Leaderboard Tier</div>
                        </div>
                        <div className={styles.content}>
                            {records.map((record, index) => {
                                return (
                                    <div key={index} className={styles.row}>
                                        <div className={styles.address}>
                                            {record.address}
                                        </div>
                                        <div className={styles.nfts} style={{ marginTop: '10px' }}>
                                            {defaultImgs.map((def, i) => {
                                                if (record.nfts && record.nfts.length > 0 && record.nfts.length > i) {
                                                    return (
                                                        <div key={i} className={styles.nft}>
                                                            <img src={`${record.nfts[i].img}`} />
                                                            <div className={styles.rank}> {record.nfts[i].rank} </div>
                                                            <div className={styles.bottomInfo}>
                                                                +{record.nfts[i].bonus}
                                                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                            </div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div key={i} className={styles.nft}>
                                                            <img src={`${def}`} />
                                                            <div className={styles.bottomInfo} style={{ opacity: 0.6 }}>
                                                                +0%
                                                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            })}
                                        </div>
                                        <div className={styles.iceEarned} style={{ paddingLeft: '53px', textAlign: 'left' }}>
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg" alt="ice" />
                                            {record.iceEarned} ICE
                                        </div>
                                        <div className={styles.xpEarned} style={{ paddingLeft: '60px', textAlign: 'left' }}>
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_XP_ICN_f9w2se.svg" alt="xp" />
                                            {record.xpEarned} XP
                                        </div>
                                        <div className={styles.tier} style={{ paddingLeft: '65px', textAlign: 'left' }}>
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1637175017/cup_w68eni.png" alt="xp" />
                                            {record.tier}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ModalIceBreakDown;