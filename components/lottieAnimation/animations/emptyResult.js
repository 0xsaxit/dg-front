import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/emptyResult.json'

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
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <Lottie options={loadingOptions} height={180} width={250} />
                <h4 className="title">No Result</h4>
            </div>
        )
    }
}

export default EmptyResultAnimation;