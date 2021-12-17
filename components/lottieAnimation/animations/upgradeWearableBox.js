import React, { Component } from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/upgrade_wearable_box.json';

class UpgradeWearableBox extends Component {
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
            <div className="upgradeWearableBox-animation-div">
                <Lottie 
                  options={loadingOptions} 
                  height={this.props.height}
                  eventListeners={[
                    {
                      eventName: 'complete',
                      callback: this.props.onCompletion  //() => console.log('the animation completed:'),
                    },
                  ]}
                />
            </div>
        )
    }
}

export default UpgradeWearableBox;
