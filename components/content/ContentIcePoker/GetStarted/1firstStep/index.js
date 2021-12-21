import React from 'react'
import { Button } from 'semantic-ui-react';
import styles from './firstStep.module.scss'

async function switchMaticNetwork() {
    try {
        let ethereum = window.ethereum;
        const data = [{
            chainId: '0x89',
            chainName: 'Matic Mainnet',
            nativeCurrency:
            {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18
            },
            rpcUrls: ['https://rpc-mainnet.maticvigil.com/'],
            blockExplorerUrls: ['https://explorer.matic.network/'],
        }]

        const tx = await ethereum.request({ method: 'wallet_addEthereumChain', params: data }).catch()
        if (tx) {
            console.log(tx)
        }
    } catch (error) {
        console.error(error);
    }
}

async function switchNetwork() {
    // Check if MetaMask is installed    
    if (window.ethereum) {
        try {
            // check if the chain to connect to is installed
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x89' }],
            });
        } catch (error) {
            // This error code indicates that the chain has not been added to MetaMask        
            if (error.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: '0x38',
                                rpcUrl: 'https://explorer.matic.network/',
                            },
                        ],
                    });
                } catch (addError) {
                    console.error(addError);
                }
            }
            console.error(error);
        }
    } else {
        // if no window.ethereum then MetaMask is not installed
        alert('MetaMask is not installed. Please consider installing it');
    }
}

const FirstStep = () => {
    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Create Metamask Wallet</h1>
                <p>Your Metamask Wallet is your gateway to ICE Poker, the metaverse, and beyond</p>
            </div>

            <div className={styles.content}>
                <div className={styles.box_div}>
                    <div className={styles.box_title}>
                        <h1>Download Extension</h1>
                    </div>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" alt="metamask" />
                    <div className={styles.button_div}>
                        <Button
                            className={styles.firstButton}
                            onClick={() => {
                                window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en", "_blank");
                            }}
                        >
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/chrome_ytab9e.png" alt="chrome" />
                            Chrome
                        </Button>
                        <Button
                            className={styles.secondButton}
                            onClick={() => {
                                window.open("https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/", "_blank");
                            }}
                        >
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/firefox_ky0stl.png" alt="firefox" />
                            Firefox
                        </Button>
                    </div>
                </div>

                <div className={styles.box_div}>
                    <div className={styles.tag}>
                        Optional Step
                    </div>
                    <div className={styles.box_title}>
                        <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634606779/polygon_rsgtjk.png" alt="polygon" />
                        <h1>Add Polygon to Metamask</h1>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.network}>
                            <p>Network Name</p>
                            <div className={styles.border_div}>Polygon</div>
                        </div>
                        <div className={styles.rpcURL}>
                            <p>New RPC URL</p>
                            <div className={styles.border_div}>polygon-rpc.com</div>
                        </div>
                        <div className={styles.chainID}>
                            <p>Chain ID</p>
                            <div className={styles.border_div}>137</div>
                        </div>
                    </div>
                    <div className={styles.button_div}>
                        <Button
                            onClick={() => {
                                switchMaticNetwork();
                            }}
                        >
                            Add Polygon
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FirstStep