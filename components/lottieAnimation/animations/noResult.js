import React, { Component } from 'react';
import Lottie from 'react-lottie';
import loadingData from '../json/doc_no_result.json';

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
      <div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img src="https://res.cloudinary.com/dnzambf4m/image/upload/v1644858496/image_40_woadzu.png" height={200} width={200} />
        </div>
        <h3 className="title" style={{ textAlign: 'center' }}>
          No Result
        </h3>
      </div>
    );
  }
}

export default NoResult;
