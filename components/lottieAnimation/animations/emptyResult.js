import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/emptyResult.json'
import { Button } from 'semantic-ui-react';
import styles from './animation.module.scss';

class EmptyResultAnimation extends Component {
    render() {
        const loadingOptions = {
            loop: false,
            autoplay: true,
            animationData: loadingData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div className={styles.main_section}>
                <img
                    className={styles.image}
                    src="https://res.cloudinary.com/dnzambf4m/image/upload/v1642685731/image_jnqaxd.png"
                />
                <div className={styles.title}>
                    More Wearable
                </div>

                <div className={styles.desc}>
                    Acquire more ICE Enabled Wearables to <br/>
                    expand your roster of poker players.
                </div>

                <Button
                    className={styles.blue_button}
                    href="https://decentral.games/ice/marketplace"
                    target="_blank"
                >
                    Browse Wearables
                </Button>
            </div>
        )
    }
}

export default EmptyResultAnimation;
