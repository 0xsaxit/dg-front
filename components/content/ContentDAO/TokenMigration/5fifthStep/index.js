import React, { useState, useEffect, useContext } from 'react'
import { Button, Input } from 'semantic-ui-react'
import BigNumber from 'bignumber.js'
import Spinner from 'components/lottieAnimation/animations/spinner';
import styles from './fifthStep.module.scss'
import Web3 from 'web3';
import Global from 'components/Constants';
import { GlobalContext } from '../../../../../store'
import Transactions from '../../../../../common/Transactions'

const FifthStep = (props) => {
    // get the treasury's balances numbers from the Context API store
    const [state, dispatch] = useContext(GlobalContext);

    // define local variables
    const [hash, setHash] = useState('');
    const [isPolygonNetwork, setPolygonNetwork] = useState(false);
    const [switchNetworkLoading, setSwitchNetworkLoading] = useState(false);
    const [direct, setDirect] = useState(true);
    const [amountDG, setAmountDG] = useState('0');
    const [amountDGLight, setAmountDGLight] = useState('0');
    const [DGTokenContract, setDGTokenContract] = useState({});
    const [DGLightTokenContract, setDGLightTokenContract] = useState({});
    const [DGLightBridgeContract, setDGLightBridgeContract] = useState({});
    const networkInfo = {
        id: 137,
        name: 'Mainnet',
        etherscan: 'https://polygonscan.com',
        dgAddress: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG,
        dgLightAddress: Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG_LIGHT
    };
    Global.pageSelfNetwork = true;

    async function handleSwitchPolygonNetwork() {
        setSwitchNetworkLoading(true);
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: Web3.utils.toHex(networkInfo.id),
                    },
                ],
            });
        } catch {
            setSwitchNetworkLoading(false);
        }
    }

    function handleDGChange(e) {
        const num = Number(e.target.value);
        if (!Number.isNaN(num)) {
            setAmountDG(e.target.value);
            const conversion = BigNumber(num).times(1000).toFixed();
            if (amountDGLight != conversion) {
                setAmountDGLight(conversion);
            }
        }
    }

    function handleDGLightChange(e) {
        const num = Number(e.target.value);
        if (!Number.isNaN(num)) {
            setAmountDGLight(e.target.value);
            const conversion = BigNumber(num).div(1000).toFixed();
            if (amountDG != conversion) {
                setAmountDG(conversion);
            }
        }
    }

    async function goLight(
        dgLightBridgeContract,
        dgTokenContract,
        amount
    ) {
        console.log('Call goLight() function to swap into DGLight Token');

        const { amountAdjusted, amountToString } = props.getAmounts(amount);
        console.log('Swap amount input (number): ' + amountAdjusted);
        console.log('Swap amount input (string): ' + amountToString);

        try {
            console.log(
                'Get amount user has authorized our DGLight contract to spend'
            );

            const amountAllowance = await dgTokenContract.methods
                .allowance(state.userAddress, dgLightBridgeContract._address)
                .call();

            console.log('Authorized amount: ' + amountAllowance);

            if (Number(amountAllowance) < amountAdjusted) {
                console.log("Approve DGLight contract to spend user's tokens");

                const data = await dgTokenContract.methods
                    .approve(dgLightBridgeContract._address, Global.CONSTANTS.MAX_AMOUNT)
                    .send({ from: state.userAddress });

                console.log('approve() transaction completed: ' + data.transactionHash);

                dispatch({
                    type: 'show_toastMessage',
                    data: 'DG approved successfully!',
                });
            }

            console.log('Call goLight() function on smart contract');

            await dgLightBridgeContract.methods
                .goLight(amountToString)
                .send({ from: state.userAddress })
                .on('transactionHash', function(hash) {
                    setHash(hash);
                    setSwapSubmitted(true);
                    setLoading(true);
                })
                .on('confirmation', function(confirmation, receipt) {
                    setSwaped(true);
                    setLoading(false);
                    console.log('goLight() transaction completed: ' + hash);
                });

            // update global state DGLight balances
            const refresh = !state.refreshBalances;

            dispatch({
                type: 'refresh_balances',
                data: refresh,
            });

            dispatch({
                type: 'show_toastMessage',
                data: 'DG swapped successfully!',
            });
        } catch (error) {
            console.log('Staking transactions error: ' + error);
            setLoading(false);

            dispatch({
                type: 'show_toastMessage',
                data: 'Failed to swap DG!',
            });
        }
    }

    async function addToken() {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: 'ERC20',
                    options: {
                      address: direct ? networkInfo.dgLightAddress : networkInfo.dgAddress,
                      symbol: direct ? 'DG' : '$DG',
                      decimals: 18,
                      image: 'https://assets.coingecko.com/coins/images/13267/small/Decentral_Games_Logo-1.png',
                    },
                },
            });
        } catch {
        }
    }

    async function goClassic(
        dgLightBridgeContract,
        dgLightTokenContract,
        amount
    ) {
        console.log('Call goClassic() function to swap into DG Token');

        const { amountAdjusted, amountToString } = props.getAmounts(amount);
        console.log('Swap amount input (number): ' + amountAdjusted);
        console.log('Swap amount input (string): ' + amountToString);

        try {
            console.log(
                'Get amount user has authorized our DGLightBridge contract to spend'
            );

            const amountAllowance = await dgLightTokenContract.methods
                .allowance(state.userAddress, dgLightBridgeContract._address)
                .call();

            console.log('Authorized amount: ' + amountAllowance);

            if (Number(amountAllowance) < amountAdjusted) {
                console.log("Approve DGLightBridge contract to spend user's tokens");

                const data = await dgLightTokenContract.methods
                    .approve(dgLightBridgeContract._address, Global.CONSTANTS.MAX_AMOUNT)
                    .send({ from: state.userAddress });

                console.log('approve() transaction completed: ' + data.transactionHash);

                dispatch({
                    type: 'show_toastMessage',
                    data: 'DG approved successfully!',
                });
            }

            console.log('Call goClassic() function on smart contract');

            await dgLightBridgeContract.methods
                .goClassic(amountToString)
                .send({ from: state.userAddress })
                .on('transactionHash', function(hash) {
                    setHash(hash);
                    setSwapSubmitted(true);
                    setLoading(true);
                })
                .on('confirmation', function(confirmation, receipt) {
                    setSwaped(true);
                    setLoading(false);
                    console.log('goClassic() transaction completed: ' + hash);
                });

            // update global state DGLight balances
            const refresh = !state.refreshBalances;

            dispatch({
                type: 'refresh_balances',
                data: refresh,
            });

            dispatch({
                type: 'show_toastMessage',
                data: 'DG swapped successfully!',
            });
        } catch (error) {
            console.log('Staking transactions error: ' + error);
            setLoading(false);

            dispatch({
                type: 'show_toastMessage',
                data: 'Failed to swap DG!',
            });
        }
    }

    async function fetchData() {
        const DGTokenContract =
            await Transactions.DGTokenContract(web3);
        setDGTokenContract(DGTokenContract);

        const DGLightTokenContract =
            await Transactions.DGLightTokenContract(web3);
        setDGLightTokenContract(DGLightTokenContract);

        const DGLightBridgeContract =
            await Transactions.DGLightBridgeContract(web3);
        setDGLightBridgeContract(DGLightBridgeContract);
    }

    async function checkNetworkId(networkId) {
        Global.pageSelfNetwork = true;

        if (networkId != networkInfo.id) {
            dispatch({
                type: 'show_toastMessage',
                data: `Please switch your Network to Polygon ${networkInfo.name}`,
            });
            setPolygonNetwork(false);
        } else {
            setPolygonNetwork(true);
        }

        setSwitchNetworkLoading(false);
        fetchData();
    }

    // fetch DGLight contract data
    useEffect(() => {
        if (state.userStatus >= 4) {
            const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

            checkNetworkId(window.ethereum.networkVersion);
            window.ethereum.on('networkChanged', function(networkId){
                checkNetworkId(networkId);
            });
        
            fetchData();
        }
    }, [state.userStatus]);

    const [swapSubmitted, setSwapSubmitted] = useState(false);
    const [swapped, setSwaped] = useState(false);
    const [loading, setLoading] = useState(false);

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Swap Your Polygon $DG</h1>
                <p>Let’s finish off by swapping any Polygon $DG you may have.</p>
            </div>

            <div className={styles.content}>
                {!swapped ?
                    (
                        !swapSubmitted ?
                            <div className={styles.box_div}>
                                <div className={styles.box_title}>
                                    <h1>Polygon $DG Token Swap</h1>
                                </div>

                                <div className={styles.contract_div}>
                                    <div className={styles.contract_box}>
                                        <div className={styles.tag}>
                                            Old DG Contract
                                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1635530963/arrow_b8xsav.png" alt="" />
                                        </div>

                                        <div className={styles.content}>
                                            <img className={styles.dg} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png" alt="DG" />
                                            <Input
                                                className={styles.swap_input}
                                                fluid
                                                placeholder="0.00"
                                                value={amountDG}
                                                onChange={handleDGChange}
                                            />
                                        </div>

                                        <div className={styles.description}>
                                            <h4 className={direct ? styles.active : null}>
                                                {props.formatPrice(state.DGBalances.BALANCE_CHILD_DG || 0, 2)} DG (Old) {direct ? 'Detected!' : 'Total'}
                                            </h4>
                                            <p>On Polygon</p>
                                        </div>
                                    </div>
                                    <div
                                        className={styles.arrow}
                                        style={{transform: !direct ? 'rotateY(180deg)' : ''}}
                                        // onClick={() => {setDirect(!direct)}}
                                    >
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
                                            <Input
                                                className={styles.swap_input}
                                                fluid
                                                placeholder="0.00"
                                                value={amountDGLight}
                                                onChange={handleDGLightChange}
                                            />
                                        </div>

                                        <div className={styles.description}>
                                            <h4 className={!direct ? styles.active : null}>
                                                {props.formatPrice(state.DGBalances.BALANCE_CHILD_DG_LIGHT || 0, 2)} New DG {!direct ? 'Detected!' : 'Total'}
                                            </h4>
                                            <p>On Polygon</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.button_div}>
                                    {!isPolygonNetwork ?
                                        <Button
                                            className={styles.button_blue}
                                            onClick={() => {
                                                handleSwitchPolygonNetwork();
                                            }}
                                        >
                                            {switchNetworkLoading ?
                                                <Spinner />
                                                :
                                                <img
                                                    className={styles.polygon}
                                                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634606779/polygon_rsgtjk.png"
                                                    alt="Polygon"
                                                />
                                            }
                                            Switch to Polygon Network
                                        </Button>
                                        : loading ?
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
                                                disabled={Number(amountDG) <= 0}
                                                onClick={() => {
                                                    direct
                                                    ? goLight(
                                                        DGLightBridgeContract,
                                                        DGTokenContract,
                                                        amountDG
                                                    ).then(() => {
                                                        setAmountDG('0');
                                                        setAmountDGLight('0');
                                                    })
                                                    : goClassic(
                                                        DGLightBridgeContract,
                                                        DGLightTokenContract,
                                                        amountDG
                                                    ).then(() => {
                                                        setAmountDG('0');
                                                        setAmountDGLight('0');
                                                    })
                                                }}
                                            >
                                                {
                                                    direct
                                                        ? `Swap ${BigNumber(amountDG).toFormat()} $DG for ${BigNumber(amountDGLight).toFormat()} DG`
                                                        : `Swap ${BigNumber(amountDGLight).toFormat()} DG for ${BigNumber(amountDG).toFormat()} $DG`
                                                }
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
                                        onClick={() => addToken()}
                                    >
                                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                                        Add { direct ? 'New' : 'Old' } DG to Metamask
                                    </Button>
                                </div>

                                <div className={styles.button_div}>
                                    <Button
                                        className={styles.button_transparent}
                                        href={`${networkInfo.etherscan}/tx/${hash}`}
                                        target="_blank"
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
                            <h1>You're Good to Go!</h1>
                        </div>
                        <div className={styles.center_ready_content}>
                            <p>You’ve Swapped Your DG to the New Token!</p>
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1636423902/check-mark_fvx9a4.png" alt="Ready" />
                        </div>
                        <div className={styles.button_div}>
                            <Button
                                className={styles.button}
                                onClick={() => {
                                }}
                            >
                                See My DG BreakDown
                            </Button>
                        </div>
                    </div>
                }
            </div>
        </div >
    )
}

export default FifthStep