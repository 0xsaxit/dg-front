import React, { useState } from 'react'
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './thirdStep.module.scss'

const ThirdStep = (props) => {
    const [dgAmount, setDGAmount] = useState(3.4);
    const [swapSubmitted, setSwapSubmitted] = useState(false);
    const [swaped, setSwaped] = useState(false);
    const [loading, setLoading] = useState(false);

    function handleClickSwap() {
        setSwapSubmitted(true);

        setTimeout(() => {
            setSwapSubmitted(false);
            setLoading(true);

            setTimeout(() => {
                setSwaped(true);
                setLoading(false);
            }, 5000);
        }, 5000)
    }

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Swap Your Mainnet $DG</h1>
                <p>The moment you’ve all been waiting for! Now let’s swap all your Mainnet $DG to the new DG token.</p>
            </div>

            <div className={styles.content}>
                {!swaped ?
                    (
                        !swapSubmitted ?
                            <div className={styles.box_div}>
                                <div className={styles.box_title}>
                                    <h1>Mainnet $DG Token Swap</h1>
                                </div>

                                <div className={styles.contract_div}>
                                    <div className={styles.contract_box}>
                                        <div className={styles.tag}>
                                            Old DG Contract
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530963/arrow_b8xsav.png" alt="" />
                                        </div>

                                        <div className={styles.content}>
                                            <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                            {dgAmount}
                                        </div>

                                        <div className={styles.description}>
                                            <h4 className={styles.active}>{dgAmount} $DG (Old) Detected!</h4>
                                            <p>On ETH Mainnet</p>
                                        </div>
                                    </div>
                                    <div className={styles.arrow}>
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635534332/arrow2_n1fwsf.png" alt="" />
                                    </div>
                                    <div className={styles.contract_box}>
                                        <div className={styles.tag}>
                                            New DG Contract
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530963/arrow_b8xsav.png" alt="" />
                                        </div>

                                        <div className={styles.content}>
                                            <img className={styles.new} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635540038/NEW_dqqtn6.png" alt="new" />
                                            <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                            <abbr>3,400</abbr>
                                        </div>

                                        <div className={styles.description}>
                                            <h4>0 New DG Total</h4>
                                            <p>On ETH Mainnet</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.button_div}>
                                    {loading ?
                                        <Button
                                            className={styles.button_blue}
                                            href="/"
                                            target="_blank"
                                        >
                                            <Spinner />
                                            View on Etherscan
                                            <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                                        </Button>
                                        :
                                        <Button
                                            className={styles.button_blue}
                                            onClick={() => {
                                                handleClickSwap();
                                            }}
                                        >
                                            Swap {dgAmount} $DG for 3,400 DG
                                        </Button>
                                    }
                                </div>
                            </div>
                            :
                            <div className={styles.box_div}>
                                <img
                                    className={styles.close}
                                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636431892/transClose_v26kgi.png"
                                    alt="close"
                                    onClick={() => {
                                        setSwapSubmitted(false);
                                    }}
                                />

                                <div className={styles.box_title}>
                                    <h1>Swap Transaction Submitted!</h1>
                                </div>

                                <div className={styles.center_swap_submitted}>
                                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                                </div>

                                <div className={styles.button_div} style={{ marginTop: '30px' }}>
                                    <Button
                                        className={styles.button}
                                    >
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                                        Add New DG to Metamask
                                    </Button>
                                </div>

                                <div className={styles.button_div}>
                                    <Button
                                        className={styles.button_transparent}
                                    >
                                        View on Etherscan
                                        <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                                    </Button>
                                </div>
                            </div>
                    )
                    :
                    <div className={styles.box_div_small}>
                        <div className={styles.box_title}>
                            <h1>You're Ready for Step 4</h1>
                        </div>
                        <div className={styles.center_ready_content}>
                            <p>No (Old) $DG Left to Swap</p>
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
                    </div>
                }
            </div>
        </div >
    )
}

export default ThirdStep