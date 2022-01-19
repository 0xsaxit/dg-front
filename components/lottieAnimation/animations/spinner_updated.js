import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/spinner.json'

class UpdatedSpinnerAnimation extends Component {
    render() {
        const loadingOptions = {
            loop: true,
            autoplay: true,
            animationData: loadingData,
            rendererSettings: {
                preserveAspectRatio: 'xMidYMid slice'
            }
        };
        // console.log(this.props.height);

        return (
            <div className="spinner-animation-div" style={{ marginRight: '0px' }}>
                <Lottie options={loadingOptions} height={this.props.height} width={this.props.width} />
            </div>
        )
    }
}

export default UpdatedSpinnerAnimation;