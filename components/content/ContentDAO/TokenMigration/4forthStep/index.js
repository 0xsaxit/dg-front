import React, { useState, useEffect, useContext } from 'react'
import { Button } from 'semantic-ui-react';
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './forthStep.module.scss'
import Global from 'components/Constants';
import { GlobalContext } from '../../../../../store'
import Transactions from '../../../../../common/Transactions'

const ForthStep = (props) => {
    // get the treasury's balances numbers from the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    const [hash, setHash] = useState('');
    const [staked, setStaked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stakeAmount, setStakeAmount] = useState(0);
    const [availabeStake, setAvailableStake] = useState(3400);
    const [DGTownHallContract, setDGTownHallContract] = useState({});
    const [DGLightTokenContract, setDGLightTokenContract] = useState({});
    const networkInfo = {
        id: 3,
        name: 'Ropsten',
        etherscan: 'https://ropsten.etherscan.io',
        dgLightAddress: Global.ADDRESSES.ROPSTEN_TOKEN_ADDRESS_DG_LIGHT
    };

    useEffect(() => {
        setAvailableStake(state.DGBalances.BALANCE_ROOT_DG_LIGHT);
    }, [state.DGBalances.BALANCE_ROOT_DG_LIGHT])

    function handleStakeAmountChange(e) {
        setStakeAmount(Number(e.target.value));
    }

    async function stake() {
        console.log('Call stepInside() function to stake tokens');

        const { amountAdjusted, amountToString } = props.getAmounts(stakeAmount);
        console.log('Swap amount input (number): ' + amountAdjusted);
        console.log('Swap amount input (string): ' + amountToString);

        try {
            console.log(
                'Get amount user has authorized our DGTownHall contract to spend'
            );

            const amountAllowance = await DGLightTokenContract.methods
                .allowance(state.userAddress, DGTownHallContract._address)
                .call();

            console.log('Authorized amount: ' + amountAllowance);

            if (Number(amountAllowance) < amountAdjusted) {
                console.log("Approve DGTownHall contract to spend user's tokens");

                const data = await DGLightTokenContract.methods
                    .approve(DGTownHallContract._address, Global.CONSTANTS.MAX_AMOUNT)
                    .send({ from: state.userAddress });

                console.log('approve() transaction completed: ' + data.transactionHash);

                dispatch({
                    type: 'show_toastMessage',
                    data: 'DG approved successfully!',
                });
            }

            console.log(amountToString, state.userAddress)
            await DGTownHallContract.methods
                .stepInside(amountToString)
                .send({ from: state.userAddress })
                .on('transactionHash', function(hash) {
                    setHash(hash);
                    setLoading(true);
                })
                .on('confirmation', function(confirmation, receipt) {
                    setStaked(true);
                    setLoading(false);
                    console.log('stepInside() transaction completed: ' + hash);
                });

            // update global state staking balances
            const refresh = !state.refreshBalances;

            dispatch({
                type: 'refresh_balances',
                data: refresh,
            });
            dispatch({
              type: 'show_toastMessage',
              data: 'DG staked successfully!',
            });
        } catch (error) {
            console.log('StepInside transaction error: ' + error);
            setLoading(false);
            dispatch({
              type: 'show_toastMessage',
              data: 'Failed to stake DG!',
            });
        }
    }

    async function fetchData() {
        const DGTownHallContract =
            await Transactions.DGTownHallContract(web3);
        setDGTownHallContract(DGTownHallContract);

        const DGLightTokenContract =
            await Transactions.DGLightTokenContract(web3);
        setDGLightTokenContract(DGLightTokenContract);
    }

    async function checkNetworkId(networkId) {
        Global.pageSelfNetwork = true;

        if (networkId != networkInfo.id) {
            dispatch({
                type: 'show_toastMessage',
                data: `Please switch your Network to Ethereum ${networkInfo.name}`,
            });
        }

        fetchData();
    }

    // fetch DGLight contract data
    useEffect(() => {
        if (state.userStatus >= 4) {
            checkNetworkId(window.ethereum.networkVersion);
            window.ethereum.on('networkChanged', function(networkId){
                checkNetworkId(networkId);
            });

            fetchData();
        }
    }, [state.userStatus]);

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
                                    {props.formatPrice(availabeStake || 0, 2)} DG Available to Stake
                                </h4>
                                <p>On Eth {networkInfo.name}</p>
                            </div>
                        </div>

                        <div className={styles.button_div}>
                            {loading ?
                                <Button
                                    className={styles.button_blue}
                                    href={`${networkInfo.etherscan}/tx/${hash}`}
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
                                        stake();
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