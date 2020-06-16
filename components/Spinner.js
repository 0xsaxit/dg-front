import React from 'react';
import spin from '../static/images/spin.gif';

const Spinner = (props) => {
  if (props.show == 1) {
    return <img src={spin} className="spinner" />;
  } else if (props.show == 2) {
    return (
      <div className="snow">
        <img src={spin} className="spinner" />
      </div>
    );
  }
};

export default Spinner;
