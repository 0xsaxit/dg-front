import React, { useContext } from 'react';
import { GlobalContext } from '../store';
import { initGA, logPageView } from './analytics.js';
import MenuTop from './home/MenuTop';
import Aux from './_Aux';

class Layout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    // console.log('isDashboard 2: ' + this.props.isDashboard);

    // this.getContext();
  }

  getContext() {
    const [state, dispatch] = useContext(GlobalContext);

    console.log('context dashboard... ' + state.dashboard);
    console.log(state.dashboard);
  }

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

export default Layout;
