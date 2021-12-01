import React, { useState } from 'react'
import { Button } from 'semantic-ui-react';
import BigNumber from 'bignumber.js';
import FirstStep from './1firstStep'
import SecondStep from './2secondStep'
import ThirdStep from './3thirdStep'
import ForthStep from './4forthStep'
import FifthStep from './5fifthStep'
import styles from './TokenMigration.module.scss'

const TokenMigration = (props) => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Unstake Your $DG", "Withdraw Your Liquidity Provision $DG", "Swap Your Mainnet $DG", "Stake in New Governance", "Swap Your Polygon DG"];

    function formatNumber(value, decimals = 0) {
        if (BigNumber(value).isNaN() || !BigNumber(value).isFinite()) {
            return '0';
        }
        const valueStr = Number(BigNumber(value).toFixed(decimals)).toString();
        const decimalPoint = valueStr.indexOf('.');
        const decimalLength = decimalPoint < 0 ? 1 : valueStr.length - decimalPoint;
        return BigNumber(valueStr).toFormat(Math.min(decimals, decimalLength - 1));
    }

    return (
        <div className={styles.main_wrapper}>
            <div className={styles.header_steps}>
                {steps.map((step, index) => (
                    <div key={index} style={{ display: 'flex', justifyContent: 'center' }}>
                        <div
                            className={(index + 1) === currentStep ? styles.step_active : styles.step}
                            onClick={() => setCurrentStep(index + 1)}
                        >
                            <div>{index + 1}</div>
                            {
                                index === 1 ? <p className={styles.title_long}>{step}</p>
                                    : <p className={styles.title}>{step}</p>
                            }

                        </div>

                        {index < 4 ?
                            <div className={styles.bullets}>
                                <abbr>•</abbr>
                                <abbr>•</abbr>
                                <abbr>•</abbr>
                                <abbr>•</abbr>
                            </div>
                            : null
                        }
                    </div>
                ))}
            </div>

            <div className={styles.content}>
                {currentStep === 1 ?
                    <FirstStep
                        formatNumber={formatNumber}
                        price={props.price}
                        nextStep={() => setCurrentStep(2)}
                    />
                    : currentStep === 2 ?
                        <SecondStep
                            formatPrice={props.formatPrice}
                            formatNumber={formatNumber}
                            nextStep={() => setCurrentStep(3)}
                        />
                        : currentStep === 3 ?
                            <ThirdStep
                                formatNumber={formatNumber}
                                getAmounts={props.getAmounts}
                                nextStep={() => setCurrentStep(4)}
                            />
                            : currentStep === 4 ?
                                <ForthStep
                                    formatNumber={formatNumber}
                                    getAmounts={props.getAmounts}
                                    nextStep={() => setCurrentStep(5)}
                                />
                                : currentStep === 5 ?
                                    <FifthStep
                                        formatNumber={formatNumber}
                                        getAmounts={props.getAmounts}
                                    />
                                    : null
                }
            </div>

            <div className={styles.footer_buttons}>
                <Button
                    disabled={currentStep === 1 ? true : false}
                    onClick={() => {
                        setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep)
                    }}
                >
                    <img className={styles.left} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634587739/back_cskr0x.png" alt="prev" />
                    Back
                </Button>

                <Button
                    disabled={currentStep === 5 ? true : false}
                    onClick={() => {
                        setCurrentStep(currentStep < 5 ? currentStep + 1 : currentStep)
                    }}
                >
                    Next
                    <img className={styles.right} src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634587739/next_zxguep.png" alt="next" />
                </Button>
            </div>

            {
                currentStep === 1 ?
                    <div className={styles.footer_tip}>
                        <div className={styles.box_div}>
                            <div className={styles.box_title}>
                                <h1>What About Ethereum's Hight Gas Fees?</h1>
                            </div>
                            <div className={styles.center_content}>
                                <p>• To account for high ETH gas fees, the new DG gov rewards APR will start at <label>40% and higher</label>.</p>
                                <p>• The new gov rewards will also cut ETH gas fees by claiming and restaking yields automatically.</p>
                            </div>
                        </div>
                    </div>
                : null
            }
        </div>
    )
}

export default TokenMigration