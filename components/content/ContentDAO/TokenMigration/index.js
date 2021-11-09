import React, { useState } from 'react'
import { Button } from 'semantic-ui-react';
import FirstStep from './1firstStep'
// import SecondStep from './2secondStep'
// import ThirdStep from './3thirdStep'
// import ForthStep from './4forthStep'
// import FifthStep from './5fifthStep'
import styles from './TokenMigration.module.scss'

const TokenMigration = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const steps = ["Unstake Your $DG", "Withdraw Your Liquidity Provision $DG", "Swap Your Mainnet $DG", "Stake in New Governance", "Swap Your Polygon DG"];

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
                        nextStep={() => setCurrentStep(2)}
                    />
                    : currentStep === 2 ?
                        <FirstStep
                            nextStep={() => setCurrentStep(3)}
                        />
                        : currentStep === 3 ?
                            <FirstStep
                                nextStep={() => setCurrentStep(4)}
                            />
                            : currentStep === 4 ?
                                <FirstStep
                                    nextStep={() => setCurrentStep(5)}
                                />
                                : currentStep === 5 ?
                                    <FirstStep />
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
                    <img className={styles.left} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/back_cskr0x.png" alt="prev" />
                    Back
                </Button>

                <Button
                    disabled={currentStep === 5 ? true : false}
                    onClick={() => {
                        setCurrentStep(currentStep < 5 ? currentStep + 1 : currentStep)
                    }}
                >
                    Next
                    <img className={styles.right} src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634587739/next_zxguep.png" alt="next" />
                </Button>
            </div>
        </div>
    )
}

export default TokenMigration