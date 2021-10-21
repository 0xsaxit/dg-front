import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/doc_no_result.json'

class NoResult extends Component {
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
            <div className="no-result-div">
                <Lottie options={loadingOptions} height={200} width={200} />
                <h3 className="title">No Result</h3>
            </div>
        )
    }
}

export default NoResult;