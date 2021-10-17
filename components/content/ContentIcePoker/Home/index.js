import React from 'react'
import { Button } from 'semantic-ui-react';
import styles from './Home.module.scss'

const Home = () => {
    return (
        <div className={styles.main_wrapper}>
            <div className={styles.title}>
                <h1>
                    Free To Play. <br />
                    Play To Earn. <br />
                    <abbr>(ICE)</abbr> Poker.
                </h1>

                <p>
                    Play free poker and earn real cash value. <br />
                    Acquire an ICE Wearable NFT to get started.
                </p>
            </div>

            <div className={styles.img}>
                <img
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1634393601/Intersect_qszewx.png"
                    alt="Intersect"
                />
            </div>

            <div className={styles.button_section}>
                <Button
                    className={styles.get_started}
                    href="/ice"
                    target="_blank"
                >
                    Get Started
                </Button>
                <Button
                    className={styles.play_button}
                    href="/ice"
                    target="_blank"
                >
                    Play
                </Button>
            </div>
        </div>
    )
}

export default Home