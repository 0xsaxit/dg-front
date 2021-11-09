import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../../../store';
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './secondStep.module.scss'

const SecondStep = (props) => {
    // dispatch user's ICE amounts to the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    // define local variables
    const [dgAmount, setDGAmount] = useState(21);
    const [unstaked, setUnstake] = useState(false);
    const [loading, setLoading] = useState(false);
    const [withdrawn, setWithDrawn] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // helper functions
    function formatPrice(balanceDG, units) {
        const balanceAdjusted = Number(balanceDG)
            .toFixed(units)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return balanceAdjusted;
    }


    function handleClickUnstakeLPTokens() {
        setLoading(true);
        setTimeout(() => {
            setUnstake(true);
            setLoading(false);

            setTimeout(() => {
                setWithDrawn(true);
            }, 3000)
        }, 5000);
    }

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Withdraw Your $DG in Uniswap Liquidity</h1>
                <p>Unstake and withdraw your LP from Uniswap, then refresh this page to ensure you're ready for step 3.</p>
            </div>

            <div className={styles.content}>

                <div className={styles.box_div}>
                    {!unstaked ?
                        <>
                            <div className={styles.box_title}>
                                <h1>Unstake Uniswap ETH-DG LP</h1>
                            </div>
                            <div className={styles.center_content}>
                                <div>
                                    {formatPrice(dgAmount, 2)} <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                </div>
                                <p>${formatPrice(dgAmount * state.DGPrices.dg, 2)}</p>
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
                                            handleClickUnstakeLPTokens();
                                        }}
                                    >
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                                        Unstake LP Tokens
                                    </Button>
                                }
                            </div>
                        </>
                        : !withdrawn ?
                            <>
                                <div className={styles.box_title}>
                                    <h1>You're Ready to Withdraw</h1>
                                </div>
                                <div className={styles.center_ready_content}>
                                    <p>No ETH-DG LP to Unstake</p>
                                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                                </div>
                                <div className={styles.button_div}>
                                    <Button
                                        className={styles.button}
                                        onClick={() => {
                                            props.nextStep();
                                        }}
                                        disabled={true}
                                    >
                                        Next Step
                                        <img className={styles.nextIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="" />
                                    </Button>
                                </div>
                            </>
                            :
                            <>
                                <div className={styles.box_title}>
                                    <h1>You're Ready for Step 3</h1>
                                </div>
                                <div className={styles.center_ready_content}>
                                    <p>No (Old) $DG Liquidity to Withdraw</p>
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

                {!withdrawn ?
                    <div className={styles.box_div}>
                        <div className={styles.box_title}>
                            <h1>Withdraw Uniswap $DG</h1>
                        </div>
                        <div className={styles.center_content}>
                            <div>
                                {formatPrice(dgAmount, 2)} <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                            </div>
                            <p>${formatPrice(dgAmount * state.DGPrices.dg, 2)}</p>
                        </div>
                        <div className={styles.button_div}>
                            <Button
                                className={styles.button}
                                onClick={() => {
                                    window.open("/", "_blank");
                                }}
                            >
                                <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636428353/uniswap_tkdx8e.png" alt="uniswap" />
                                Withdraw Uniswap Liquidity
                                <img className={styles.arrowIcon} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636424323/TransBgArrow_ukntvi.png" alt="" />
                            </Button>
                        </div>
                    </div>
                    : null
                }
            </div>
        </div >
    )
}

export default SecondStep