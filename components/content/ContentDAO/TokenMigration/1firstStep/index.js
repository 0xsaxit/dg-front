import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'semantic-ui-react';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './firstStep.module.scss'
import Global from 'components/Constants';
import { GlobalContext } from '../../../../../store';
import Transactions from '../../../../../common/Transactions';

const FirstStep = (props) => {
    // get the treasury's balances numbers from the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    const [hash, setHash] = useState('');
    const [unstaked, setUnstaked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stakingContract, setStakeContract] = useState({});

    // fetch staking contract data
    useEffect(() => {
        if (state.userStatus >= 4) {
            const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

            if (state.networkID != Global.CONSTANTS.PARENT_NETWORK_ID) {
                dispatch({
                    type: 'show_toastMessage',
                    data: `Please switch your Network to Ethereum Mainnet`,
                });
            }

            async function fetchData() {
                try {
                    const contract =
                        await Transactions.stakingContractGovernance(web3);
                    setStakeContract(contract);

                    const stakedAmount =
                        await contract.methods.balanceOf(state.userAddress).call();

                    if (BigNumber(stakedAmount).isZero()) {
                        setUnstaked(true);
                    }
                } catch (e) {
                    console.log(e.message);
                }
            }

            fetchData();
        }
    }, [state.userStatus]);

    async function unstake() {
        const amount = BigNumber(state.stakingBalances.BALANCE_USER_GOVERNANCE || 0)
            .times(Global.CONSTANTS.FACTOR).toFixed();

        console.log('Call withdraw() function to unstake tokens');

        try {
            console.log(amount, state.userAddress)
            await stakingContract.methods
                .withdraw(amount)
                .send({ from: state.userAddress })
                .on('transactionHash', function(hash) {
                    setHash(hash);
                    setLoading(true);
                })
                .on('confirmation', function(confirmation, receipt) {
                    setUnstaked(true);
                    setLoading(false);
                    console.log('withdraw() transaction completed: ' + hash);
                });

            // update global state staking balances
            const refresh = !state.refreshBalances;

            dispatch({
                type: 'refresh_balances',
                data: refresh,
            });
            dispatch({
              type: 'show_toastMessage',
              data: '$DG unstaked successfully!',
            });
        } catch (error) {
            console.log('Withdraw transaction error: ' + error);
            setLoading(false);
            dispatch({
              type: 'show_toastMessage',
              data: 'Failed to unstake $DG!',
            });
        }
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
                                    {props.formatPrice(state.stakingBalances.BALANCE_USER_GOVERNANCE || 0, 2)}
                                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                </div>
                                <p>
                                    ${props.formatPrice((state.DGPrices.dg * state.stakingBalances.BALANCE_USER_GOVERNANCE || 0).toFixed(2), 2)}
                                </p>
                            </div>
                            <div className={styles.button_div}>
                                {loading ?
                                    <Button
                                        className={styles.button}
                                        href={`https://etherscan.io/tx/${hash}`}
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
                                            unstake();
                                        }}
                                    >
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                                        Unstake {props.formatPrice(state.stakingBalances.BALANCE_USER_GOVERNANCE || 0, 2)} $DG
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