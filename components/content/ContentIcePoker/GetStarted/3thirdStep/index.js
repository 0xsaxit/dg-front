import React from 'react'
import { Button } from 'semantic-ui-react';
import styles from './thirdStep.module.scss'

const ThirdStep = () => {
    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>Create Decentraland Avatar</h1>
                <p>For metaverse poker, you’ll need a metaverse avatar</p>
            </div>

            <div className={styles.content}>
                <div className={styles.box_div}>
                    <div className={styles.box_title}>
                        <h1>Create Decentraland Avatar</h1>
                    </div>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634661247/Create_Avatar_ekyri5.png" alt="avatar" />
                    <div className={styles.button_div}>
                        <Button
                            onClick={() => {
                                window.open("https://play.decentral.games/dext", "_blank");
                            }}
                        >
                            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620413783/MANA_jw7ylg.png" alt="mana" />
                            Enter Decentraland
                        </Button>
                    </div>
                </div>

                <div className={styles.box_div} style={{ paddingRight: '10px' }}>
                    <div className={styles.box_title}>
                        <h1>Equip Your ICE Wearable</h1>
                    </div>
                    <div className={styles.content}>
                        <li>
                            Navigate to your backpack at the<br /><abbr />top right and equip your ICE wearables
                        </li>
                    </div>
                    <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1634616873/Equip_qjdgyx.png" style={{ width: '150px' }} alt="marketplace" />
                </div>
            </div>
        </div>
    )
}

export default ThirdStep