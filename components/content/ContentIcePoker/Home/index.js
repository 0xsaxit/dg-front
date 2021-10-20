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

            <div className={styles.read_whitepaper}>
                <abbr>Read Whitepaper</abbr>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12.374 9.45117V2.11963C12.374 1.43848 11.9126 0.969727 11.2241 0.969727H3.88525C3.24072 0.969727 2.75732 1.46045 2.75732 2.04639C2.75732 2.63232 3.25537 3.08643 3.87793 3.08643H6.64648L8.90967 3.00586L7.64258 4.13379L1.24121 10.5425C0.999512 10.7842 0.867676 11.0698 0.867676 11.3628C0.867676 11.9341 1.40234 12.4761 1.98096 12.4761C2.27393 12.4761 2.55225 12.3442 2.80127 12.1025L9.20996 5.70117L10.3452 4.43408L10.25 6.6167V9.4585C10.25 10.0884 10.7041 10.5791 11.29 10.5791C11.8833 10.5791 12.374 10.0811 12.374 9.45117Z"
                        fill="white" />
                </svg>

            </div>
        </div>
    )
}

export default Home