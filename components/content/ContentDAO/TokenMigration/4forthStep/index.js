import React, { useState } from 'react'
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './forthStep.module.scss'

const ForthStep = (props) => {
    const [staked, setStaked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [availabeStake, setAvailableStake] = useState(3400);

    function handleStakeAmountChange(e) {
        setStakeAmount(e.target.value);
    }

    function handleClickStake() {
        setLoading(true);

        setTimeout(() => {
            setStaked(true);
            setLoading(false);
        }, 5000)
    }

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Stake in New Governance</h1>
                <p>To finish the process, restake your new DG for new governance yields.</p>
            </div>

            <div className={styles.content}>
                {!staked ?
                    <div className={styles.box_div}>
                        <div className={styles.box_title}>
                            <h1>New DG Gov Staking <abbr>(112% APY)</abbr></h1>
                        </div>

                        <div className={styles.contract_div}>
                            <div className={styles.content}>
                                <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                <input
                                    type="number"
                                    className={styles.dg_input}
                                    value={stakeAmount.toString()}
                                    onChange={handleStakeAmountChange}
                                    style={{
                                        minWidth: `${5 + (stakeAmount.toString().length + 1) * 12}px`,
                                        maxWidth: `${5 + (stakeAmount.toString().length + 1) * 12}px`
                                    }}
                                />
                            </div>

                            <Button
                                className={styles.max_button}
                                onClick={() => {
                                    setStakeAmount(availabeStake);
                                }}
                            >
                                MAX
                            </Button>

                            <div className={styles.description}>
                                <h4 className={stakeAmount <= availabeStake ? styles.success : styles.error}>
                                    {availabeStake.toLocaleString()} DG Available to Stake
                                </h4>
                                <p>On Eth Mainnet</p>
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
                                        handleClickStake();
                                    }}
                                    disabled={stakeAmount <= 0 || stakeAmount > availabeStake ? true : false}
                                >
                                    Stake {stakeAmount} DG
                                </Button>
                            }
                        </div>
                    </div>
                    :
                    <div className={styles.box_div_small}>
                        <div className={styles.box_title}>
                            <h1>You're Ready for Step 5</h1>
                        </div>
                        <div className={styles.center_ready_content}>
                            <p>No DG Left to Stake</p>
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

export default ForthStep