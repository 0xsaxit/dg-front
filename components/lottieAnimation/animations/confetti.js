import React, { Component } from 'react'
import Lottie from 'react-lottie'
import loadingData from '../json/confetti.json'

class Confetti extends Component {
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
            <div className="confetti-animation-div" style={{position:"absolute"}}>
                <Lottie 
                  options={loadingOptions} 
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

export default Confetti;
