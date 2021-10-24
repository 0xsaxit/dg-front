import React, { useState, useEffect, useContext } from 'react'
import { GlobalContext } from '../../../../store'
import { Button } from 'semantic-ui-react'
import cn from 'classnames'
import styles from './IceRewards.module.scss'

const IceRewards = () => {
    // dispatch user's ICE amounts to the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    // define local variables
    const [clicked, setClicked] = useState(false);

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // after claiming rewards this code gets executed
    useEffect(() => {
        setClicked(false);
    }, [state.iceAmounts]);

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // helper functions
    function formatPrice(balanceDG, units) {
        const balanceAdjusted = Number(balanceDG)
            .toFixed(units)
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        return balanceAdjusted;
    }

    async function claimTokens() {
        console.log('Claiming ICE Rewards: ' + state.iceAmounts.ICE_CLAIM_AMOUNT);
        setClicked(true);

        try {
            const json = await Fetch.CLAIM_REWARDS();

            if (json.status) {
                console.log('Claim ICE rewards request successful');
                console.log('Claim ICE transaction hash: ' + json.txHash);

                // update global state ice amounts
                const refresh = !state.refreshICEAmounts;

                dispatch({
                    type: 'refresh_ice_amounts',
                    data: refresh,
                });
            } else {
                console.log('Claim ICE rewards request error: ' + json.reason);

                setClicked(false);
            }
        } catch (error) {
            console.log(error); // API request timeout error

            setClicked(false);
        }
    }

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
                        {state.iceAmounts.ICE_CLAIM_AMOUNT}
                    </p>
                    <img
                        style={{ marginTop: '-4px' }}
                        src="https://res.cloudinary.com/dnzambf4m/image/upload/v1631324990/ICE_Diamond_ICN_kxkaqj.svg"
                    />
                </div>
                <p className={styles.price}>
                    ${formatPrice(state.iceAmounts.ICE_CLAIM_AMOUNT * state.DGPrices.ice, 2)}
                </p>

                <p className={styles.lower_text}>
                    ICE Earnings vary based on your total equipped wearables, <br />
                    wearable ranks, and your placement in daily ICE Poker<br />
                    tournaments.
                </p>


                {!clicked ? (
                    <Button className={cn(styles.claim_ICE, styles.lower_button)} onClick={() => claimTokens()}>
                        Claim {formatPrice(state.iceAmounts.ICE_CLAIM_AMOUNT, 0)} ICE
                    </Button>
                ) : (
                        <Button className={cn(styles.claim_ICE, styles.lower_button)} disabled>
                            Claim {formatPrice(state.iceAmounts.ICE_CLAIM_AMOUNT, 0)} ICE
                        </Button>
                    )}
            </div>
        </div>
    )
}

export default IceRewards