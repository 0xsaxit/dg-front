import React, { Component, useContext, useState, useEffect } from 'react';
import { NavLink, Link, Redirect, withRouter } from 'react-router-dom';
import {
  Icon,
  Image,
  Menu,
  Search,
  Container,
  Segment,
  Modal,
  Header,
  Grid,
  Input,
  Dropdown,
  Breadcrumb,
  Divider,
  Message,
  Popup,
  Button,
} from 'semantic-ui-react';
// import { isMobile } from 'react-device-detect';
import Spinner from '../Spinner';

let Global;
// import logo2 from '../../static/images/logo.png';
// import logo2 from '../../static/images/logoDG35.png'
// import box from '../../static/images/box.png';
// import check from '../../static/images/check.png';
// import metamask from '../../static/images/metamask.png';
// import ledger from '../../static/images/ledger.png';

var USER_ADDRESS;

const INITIAL_STATE = {
  userStepValue: 0,
  isLoaded: 0,
  isValidMetamask: 0,
  existAccount: 0,
};

class ModalVerify extends Component {
  state = { modalOpen: false };
  handleOpen = () => {
    this.setState({ modalOpen: true });
    if (this.state.isLoaded === 0) {
      this.prepareVerify();
    }
  };
  handleClose = () => this.setState({ modalOpen: false });

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;
  }

  async componentDidMount() {
    Global = require('../Constants').default;

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.isBrowserMetamsk = 1;
    }
  }

  async prepareVerify() {
    try {
      if (!window.web3.currentProvider.selectedAddress) {
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      }

      for (var i = 0; i < 3; i++) {
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        if (!USER_ADDRESS) {
          // await Global.delay(2000);

          continue;
        }

        let ret = await this.checkUserVerifyStep();
        if (ret) return;

        // await Global.delay(2000);
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ isLoaded: 1 });
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ isLoaded: 2, existAccount: 0 });
          return true;
        }

        localStorage.setItem('selectedMenu', 0);
        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          this.gotoDashboard();
          // window.location.href = "/";
        } else if (stepValue == 3)
          this.setState({
            isLoaded: 2,
            userStepValue: 3,
            existAccount: 0,
          });
        else if (stepValue == 2)
          this.setState({
            isValidMetamask: 2,
            isLoaded: 2,
            userStepValue: 2,
            existAccount: 0,
          });
        else
          this.setState({
            isLoaded: 2,
            userStepValue: stepValue,
            existAccount: 0,
          });

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  gotoDashboard = () => {
    this.setState({ modalOpen: false });
    this.props.dashboard();
  };

  getUserVerify = () => {
    return fetch(`${Global.API_BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      }),
    });
  };

  // ifMobileRedirect = () => {
  //   if (isMobile) {
  //     return <Redirect to="/" />;
  //   }
  // };

  onMetamask = async (e, d) => {
    console.log('metamask...');

    this.setState({ isValidMetamask: 0 });
    if (window.ethereum) {
      try {
        // Request account access if needed
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        fetch(`${Global.API_BASE_URL}/order/addAddress`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: USER_ADDRESS,
            manaLock: 0,
            ethLock: 0,
          }),
        })
          .catch((e) => {
            console.log(e);
            this.setState({ isValidMetamask: 1 });
          })
          .then((res) => {
            if (res) return res.json();
            this.setState({ isValidMetamask: 1 });
          })
          .then(async (data) => {
            if (!data) this.setState({ isValidMetamask: 1 });
            else {
              if (data.status === 'ok' && data.result === 'true') {
                // window.location.href = 'http://localhost:8000';
                await this.postUserVerify(4);
                this.setState({ isValidMetamask: 3 });
                window.location.href = '/';
              } else {
                this.setState({ isValidMetamask: 1 });
              }
            }
          });
      } catch (error) {
        // User denied account access...
        console.log(error);
      }
    }
  };

  postUserVerify = (step) => {
    return fetch(`${Global.API_BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
        verifyStep: step,
      }),
    });
  };

  render() {
    if (this.state.isLoaded === 0) {
      return (
        <Button
          content="CONNECT METAMASK"
          color="blue"
          className="metamask-button"
          onClick={this.onMetamask}
        />
      );
    }

    if (!this.isBrowserMetamsk) {
      return (
        <Modal
          trigger={
            <Button
              content="CONNECT METAMASK"
              color="blue"
              className="metamask-button"
              onClick={this.handleOpen}
            />
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            <Container style={{ height: '35em' }}>
              <Grid
                style={{ marginTop: '17em' }}
                verticalAlign="middle"
                textAlign="center"
              >
                <Header>
                  {' '}
                  Please use Chrome Browser with Metamask enabled to proceed.{' '}
                </Header>
              </Grid>
            </Container>
          </div>
        </Modal>
      );
    }

    if (this.state.existAccount == 1) {
      return (
        <Button
          content="CONNECT METAMASK"
          color="blue"
          className="metamask-button"
          as={NavLink}
          to="/"
        />
      );
    }

    return (
      <Button
        color="blue"
        className="metamask-button"
        content="CONNECT METAMASK"
        onClick={this.handleOpen}
      />
    );
  }
}

export default ModalVerify;
