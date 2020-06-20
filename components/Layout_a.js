import React, { Component } from 'react';
import { initGA, logPageView } from './analytics.js';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

export default class Layout extends Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    return (
      <Aux>
        <MenuTop dashboard={true} />

        {this.props.children}
      </Aux>
    );
  }
}
