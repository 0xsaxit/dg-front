import React from 'react'
import { Button } from 'semantic-ui-react'
import cn from 'classnames'
import styles from './IceRewards.module.scss'

const IceRewards = () => {
    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>
                    Claim Your ICE Rewards!
                </h1>
                <p>
                    Payouts at midnight UTC daily. Next payout in <abbr>4 hours.</abbr>
                </p>
            </div>

            <div className={styles.lower}>
                <p className={styles.lower_header}>Claim ICE Rewards</p>
                <div className={styles.lower_value}>
                    <p className={styles.ICE_value}>
                        1929
                    </p>
                    <img
                        style={{ marginTop: '-4px' }}
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                    />
                </div>
                <p className={styles.price}>
                    $109.32
                </p>

                <p className={styles.lower_text}>
                    ICE Earnings vary based on your total equipped wearables, <br/>
                    wearable ranks, and your placement in daily ICE Poker<br/>
                    tournaments.
                </p>

                <Button
                    className={cn(styles.claim_ICE, styles.lower_button)}
                >
                    Claim 1929 ICE
                </Button>
            </div>
        </div>
    )
}

export default IceRewards