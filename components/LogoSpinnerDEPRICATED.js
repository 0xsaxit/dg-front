import React from 'react';
import Aux from './_Aux';
import spin from '../static/images/spin.gif';

const Spinner = props =>
  props.show == 1 ? (
    <Aux>
      <div className="spinner" style={props.style}>
        <img src={spin} class="image small inline modallogospin" />
        <p class="modallogospin" style={{lineHeight: '36px', marginRight: '45px', color: 'white' }}>Confirming...</p> 
      </div>
    </Aux>
  ) : null;

export default Spinner;
