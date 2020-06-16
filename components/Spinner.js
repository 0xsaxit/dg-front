import React from 'react';
import spin from '../static/images/spin.gif';

const Spinner = (props) => {
  if (props.snow == 0) {
    return <img src={spin} className="spinner" />;
  } else if (props.snow == 1) {
    return (
      <div className="snow">
        <img src={spin} className="spinner" />
      </div>
    );
  }
};

export default Spinner;
