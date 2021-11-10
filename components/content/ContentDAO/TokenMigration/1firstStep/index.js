import React, { useState } from 'react'
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './firstStep.module.scss'

const FirstStep = (props) => {
    const [unstaked, setUnstaked] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleClickUnstake() {
        setLoading(true);
        setTimeout(() => {
            setUnstaked(true);
            setLoading(false);
        }, 5000);
    }

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Unstake Your $DG</h1>
                <p>By unstaking first, we’ll aim to swap all your Mainnet $DG in one later transaction and reduce total gas fees.</p>
            </div>

            <div className={styles.content}>
                <div className={styles.box_div}>
                    {!unstaked ?
                        <>
                            <div className={styles.box_title}>
                                <h1>Staked Governance $DG</h1>
                            </div>
                            <div className={styles.center_content}>
                                <div>
                                    14.21 <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                </div>
                                <p>$7,332.42</p>
                            </div>
                            <div className={styles.button_div}>
                                {loading ?
                                    <Button
                                        className={styles.button}
                                        href="/"
                                        target="_blank"
                                    >
                                        <Spinner />
                                        View on Etherscan
                                        <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                                    </Button>
                                    :
                                    <Button
                                        className={styles.button}
                                        onClick={() => {
                                            handleClickUnstake();
                                        }}
                                    >
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                                        Unstake 14.21 $DG
                                    </Button>
                                }
                            </div>
                        </>
                        :
                        <>
                            <div className={styles.box_title}>
                                <h1>You're Ready for Step 2</h1>
                            </div>
                            <div className={styles.center_ready_content}>
                                <p>No (Old) $DG Left to Unstake</p>
                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                            </div>
                            <div className={styles.button_div}>
                                <Button
                                    className={styles.button}
                                    onClick={() => {
                                        props.nextStep();
                                    }}
                                >
                                    Next Step
                                    <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
                                </Button>
                            </div>
                        </>
                    }
                </div>

                <div className={styles.box_div}>
                    <div className={styles.box_title}>
                        <h1>What About Gas Fees?</h1>
                    </div>
                    <div className={styles.content}>
                        <li>
                            To account for high ETH gas fees, <br /><abbr /> the new DG gov rewards APY will <br /><abbr /> start at <a href="/">100% and higher</a>.
                        </li>
                        <li>
                            The new gov rewards will also cut <br /><abbr /> ETH gas fees by claiming and <br /><abbr /> restaking yields automatically.
                        </li>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FirstStep