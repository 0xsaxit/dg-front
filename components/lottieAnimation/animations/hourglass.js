import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/hourglass.json'

class HourglassAnimation extends Component {
    render() {
        const loadingOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };

        return (
            <div style={{ position: 'relative', marginTop: '120px' }}>
                <Lottie options={loadingOptions} height={120} width={120} />
            </div>
        )
    }
}

export default HourglassAnimation;