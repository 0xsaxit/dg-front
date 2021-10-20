import React from 'react'
import { Button } from 'semantic-ui-react';
import styles from './Home.module.scss'

const Home = () => {
    return (
        <div className={styles.main_wrapper}>
            <video
              src="https://res.cloudinary.com/dnzambf4m/video/upload/v1634761194/Web_Landing_2_1_gqgruf.webm"
              className={styles.home_video}
              type="video/mp4"
              frameBorder="0"
              autoPlay={true}
              loop
              muted
            ></video>

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