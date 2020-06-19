import React, { Component } from 'react';
import { initGA, logPageView } from './analytics.js';
import Menu from './home/menu';

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
      <div>
        <Menu dashboard={true} />

        {this.props.children}
      </div>
    );
  }
}
