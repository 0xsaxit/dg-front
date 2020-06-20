import React from 'react';
import { Container, Grid, Image, Breadcrumb } from 'semantic-ui-react';
import metamask from '../../static/images/metamask.png';
import ledger from '../../static/images/ledger.png';
import Spinner from '../Spinner';
import { Header } from 'semantic-ui-react';

let Global;

const withAdmin = (Component) => {
  class WithAdmin extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isAdmin: 0,
      };
    }

    componentDidMount() {
      Global = require('../Constants').default;

      try {
        if (!window.web3.currentProvider.selectedAddress) {
          this.setState({ isAdmin: 0 });
        } else if (
          Global.ADMIN_ADDRESSES.includes(
            window.web3.currentProvider.selectedAddress.toLowerCase()
          )
        ) {
          this.setState({ isAdmin: 2 });
        } else {
          this.setState({ isAdmin: 1 });
        }
      } catch (e) {
        console.log(e);
        console.log(Global.ADMIN_ADDRESSES);
      }
    }

    componentWillUnmount() {}

    onMetamask = async (e, d) => {
      if (window.ethereum) {
        window.web3 = new window.Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.enable();
          if (
            Global.ADMIN_ADDRESSES.includes(
              window.web3.currentProvider.selectedAddress.toLowerCase()
            )
          ) {
            this.setState({ isAdmin: 2 });
          } else {
            this.setState({ isAdmin: 1 });
          }
        } catch (error) {
          // User denied account access...
          console.log(error);
        }
      }
    };

    render() {
      if (this.state.isAdmin == 2) {
        return (
          <div id="admin" className="ui accountContainer">
            <Component {...this.props} />
          </div>
        );
      } else if (this.state.isAdmin == 1) {
        return (
          <div id="admin" className="ui accountContainer">
            <Container>
              <a
                id="a-footer"
                style={{ marginTop: '30px', display: 'inline-block' }}
                href="/"
              >
                <Breadcrumb.Divider
                  style={{ fontSize: '18px' }}
                  icon="left arrow"
                />
              </a>
              <Grid
                verticalAlign="middle"
                textAlign="center"
                style={{ marginTop: '39vh' }}
              >
                <Header style={{ color: 'white' }}>
                  {' '}
                  You must be signed in to metamask with an Administrator
                  address to view this page{' '}
                </Header>
              </Grid>
            </Container>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  }

  return WithAdmin;
};

export default withAdmin;
