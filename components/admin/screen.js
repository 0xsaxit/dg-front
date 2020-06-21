import React from 'react';
import { Redirect } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { Header } from 'semantic-ui-react';
import { Container, Grid, Image } from 'semantic-ui-react';
import MenuTop from './MenuTop';
import Machine from './machine';
import History from './history';
import Dashboard from './dashboard';
import Spinner from '../Spinner';
import AdminCheck from './adminCheck';

let Global;

const INITIAL_STATE = {
  selectedMenu: 0,
  isRunningTransaction: false,
};

class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;
  }

  async componentDidMount() {
    let object = this;
    Global = require('../Constants').default;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserState();
    });

    if (window.web3) {
      this.isBrowserMetamsk = 1;
    }

    try {
      if (!window.web3.currentProvider.selectedAddress) {
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
      }

      let ret = await this.getUserState();
      if (ret) return;
    } catch (e) {
      console.log(e);
    }

    this.setState({ isValid: 0 });
  }

  selectedMenu = async (index) => {
    this.setState({ selectedMenu: index });
  };

  getContent = () => {
    if (this.state.selectedMenu == 0) return <Dashboard />;
    if (this.state.selectedMenu == 1) return <Machine />;
    if (this.state.selectedMenu == 2) return <History />;
  };

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to="/" />;
    }
  };

  render() {
    if (!this.isBrowserMetamsk) {
      return (
        <div id="admin" className="ui accountContainer">
          {/*<Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Grid verticalAlign='middle' textAlign='center'>
              <Header> This page is only available when you have installed metamask on browser. </Header>
            </Grid>
          </Container>*/}
        </div>
      );
    }

    return (
      <div id="admin">
        {this.ifMobileRedirect()}
        <Spinner background={this.state.isRunningTransaction} />
        <div className="ui accountContainer">
          <Grid verticalAlign="middle">
            <Grid.Column>
              <MenuTop onMenuSelected={this.selectedMenu} />
              {this.getContent()}
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default AdminCheck(Admin);
