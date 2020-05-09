import React from 'react';
import spin from '../static/images/spin.gif';

const Spinner = props =>
  props.show == 1 ? (
      <div className="spinner" style={props.style}>
        <img src={spin} className="image small inline logospin" />
      </div>
  ) : null;

export default Spinner;
