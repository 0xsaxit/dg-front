import React, { Component, useContext, useState, useEffect } from "react";
import { NavLink, Link, Redirect, withRouter } from "react-router-dom"
import { Icon, Image, Menu, Search, Container, Segment, Modal, Header, Grid, Input, Dropdown, Breadcrumb, Divider, Message, Popup, Button } from "semantic-ui-react";
import { isMobile } from "react-device-detect";
import Spinner from '../Spinner'

let Global;
import logo2 from '../../static/images/logo.png'
// import logo2 from '../../static/images/logoDG35.png'
import box from '../../static/images/box.png'
import check from '../../static/images/check.png'
import metamask from '../../static/images/metamask.png'
import ledger from '../../static/images/ledger.png'

var USER_ADDRESS;

const INITIAL_STATE = {
  month: 1,
  day: 1,
  year: 1990,
  amount: 1000,
  email: '',
  name: '',
  emailErrMsg: '',
  isEmailNameDone: 0,
  userStepValue: 0,
  isLoaded: 0,
  isValidBirth: 0,
  isValidLocation: 0,
  isValidMetamask: 0,
  existAccount: 0,
  isEmailError: 0,
};

class ModalVerify extends Component {

  state = { modalOpen: false }
  handleOpen = () => {
    this.setState({ modalOpen: true });
    if (this.state.isLoaded === 0) {
      this.prepareVerify();
    }
  }
  handleClose = () => this.setState({ modalOpen: false })

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;
  }

  async componentDidMount() {
    Global = require('../constant').default;
    
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
          await Global.delay(2000);
          continue;
        }

        let ret = await this.checkUserVerifyStep();
        if (ret)
          return;

        await Global.delay(2000);
      }
    } catch (err) {
      console.log(err)
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
          this.setState({ isValidBirth: 2, isLoaded: 2, userStepValue: 3, existAccount: 0 });
        else if (stepValue == 2)
          this.setState({ isValidMetamask: 2, isLoaded: 2, userStepValue: 2, existAccount: 0 });
        else
          this.setState({ isLoaded: 2, userStepValue: stepValue, existAccount: 0 });

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  }

  gotoDashboard = () => {
    this.setState({ modalOpen: false });
    this.props.dashboard();
  }
  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      })
    })
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to='/' />
    }
  }
  onChangeMonth = (e, d) => {
    this.setState({ month: d.value });
  };

  onChangeDay = (e, d) => {
    this.setState({ day: d.value });
  };

  onChangeYear = (e, d) => {
    this.setState({ year: d.value });
  };

  onChangeAmount = (e, d) => {
    this.setState({ amount: d.value });
  };

  onEmail = async (e) => {
    this.setState({ email: e.target.value });
  }

  onName = async (e) => {
    this.setState({ name: e.target.value });
  }

  verifyLocation = async (e, d) => {
    // this.setState({isValidLocation: 0 });
    // fetch("https://extreme-ip-lookup.com/json")           // Get the IP data
    //   .then(res => res.json())
    //   .then(async ip => {
    //     if (ip.country === 'United States') {
    await this.postUserVerify(4);
    this.setState({ isValidLocation: 2 });
    window.location.href = "/";
    //    this.props.history.push('/account');
    //     }
    //     else
    //       this.setState({isValidLocation: 1 });
    //   });
  };

  onMetamask = async (e, d) => {
    this.setState({ isValidMetamask: 0 });
    if (window.ethereum) {
      try {
        // Request account access if needed
        window.web3 = new window.Web3(window.ethereum);
        await window.ethereum.enable();
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        fetch(`${Global.BASE_URL}/order/addAddress`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: USER_ADDRESS,
            manaLock: 0,
            ethLock: 0,
          })
        })
          .catch(e => {
            console.log(e);
            this.setState({ isValidMetamask: 1 });
          })
          .then(res => {
            if (res)
              return res.json();
            this.setState({ isValidMetamask: 1 });
          })
          .then(async data => {
            if (!data)
              this.setState({ isValidMetamask: 1 });
            else {
              if (data.status === 'ok' && data.result === 'true') {
                // window.location.href = 'http://localhost:8000';
                await this.postUserVerify(3);
                this.setState({isValidBirth: 2, isValidMetamask: 3 });
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
    return fetch(`${Global.BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
        verifyStep: step,
      })
    })
  }

  render() {
    const month = [
      { key: 1, text: 'Jan', value: 1 },
      { key: 2, text: 'Feb', value: 2 },
      { key: 3, text: 'Mar', value: 3 },
      { key: 4, text: 'Apr', value: 4 },
      { key: 5, text: 'May', value: 5 },
      { key: 6, text: 'Jun', value: 6 },
      { key: 7, text: 'Jul', value: 7 },
      { key: 8, text: 'Aug', value: 8 },
      { key: 9, text: 'Sep', value: 9 },
      { key: 10, text: 'Oct', value: 10 },
      { key: 11, text: 'Nov', value: 11 },
      { key: 12, text: 'Dec', value: 12 },
    ]

    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
    ]

    var dayLimit;
    if ((this.state.month == 1) || (this.state.month == 3) || (this.state.month == 5) || (this.state.month == 7) ||
      (this.state.month == 8) || (this.state.month == 10) || (this.state.month == 12))
      dayLimit = 31;
    else if (this.state.month == 2)
      dayLimit = 29;
    else
      dayLimit = 30

    var day = [];
    for (var i = 1; i <= dayLimit; i++) {
      if ((i == 1) || (i == 21) || (i == 31))
        day[day.length] = { key: i, text: i + 'st', value: i };
      else if ((i == 2) || (i == 22))
        day[day.length] = { key: i, text: i + 'nd', value: i };
      else if ((i == 3) || (i == 23))
        day[day.length] = { key: i, text: i + 'rd', value: i };
      else
        day[day.length] = { key: i, text: i + 'th', value: i };
    }

    var year = [];
    for (var i = 1900; i <= 2019; i++) {
      year[year.length] = { key: i, text: i, value: i };
    }

    if (this.state.isLoaded === 0) {
      return (
        <Modal
          trigger={<Button content='CONNECT METAMASK'  color='blue' className="metamask-button" onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="verify">
            <Container style={{ height: '35em' }}>
            </Container>
          </div>
        </Modal>
      )
    }

    if (!this.isBrowserMetamsk) {
      return (
        <Modal
          trigger={<Button content='Deposit' id='depositButton' onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            <Container style={{ height: '35em' }}>
              <Grid style={{ marginTop: '17em' }} verticalAlign='middle' textAlign='center'>
                <Header> Please use Chrome Browser with Metamask enabled to proceed. </Header>
              </Grid>
            </Container>
          </div>
        </Modal>
      )
    }

    if (this.state.existAccount == 1) {
      return (
        <Button content='CONNECT METAMASK'  color='blue' className="metamask-button" as={NavLink} to='/' />
      )
    }

    if (this.state.isValidBirth == 2) {
      return (
        <Modal
          trigger={<Button content='CONNECT METAMASK'  color='blue' className="metamask-button" onClick={this.handleOpen} />}
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="verify">
            {this.ifMobileRedirect()}

            <div className="ui verifyContainer">
              <Grid verticalAlign='middle' textAlign='center'>
                <Grid.Column>

                  <div className="progressbar">
                    <img className="modal-logo" src={logo2} />
                    <Grid.Row >
                      <Divider className="modal-divider" />
                      <img style={{ opacity: '0.5' }} className="progressbar-image-box" src={box} />
                      <img style={{ opacity: '0.5' }} className="progressbar-image-check" src={check} />
                      <p style={{ opacity: '0.5', paddingLeft: '0px' }} className="progressbar p-text"> Connect Wallet </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text"> Verify Location </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Create Account </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">2. Verify your location. Due to international online gaming legislation, we unfortunately do not allow accounts from US IP addresses.
                      </p>
                      </Grid.Row>

                      <Grid.Row>
                        <Button className="play-button" color='blue'
                          onClick={this.verifyLocation} >
                          Verify
                      </Button>
                      </Grid.Row>
                    </Grid>

                    {this.state.isValidLocation == 1 ?
                      <p className="modal-p-error">
                        You are within the United States.
                  </p> : <p />}

                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      )
    }

    return (
      <Modal
        trigger={<Button color='blue' className="metamask-button" content='CONNECT METAMASK' onClick={this.handleOpen} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="verify">
          {this.ifMobileRedirect()}

          <div className="ui verifyContainer">
            <Grid verticalAlign='middle' textAlign='center'>
              <Grid.Column>

                <div className="progressbar">
                  <img className="modal-logo" src={logo2} />
                  <Grid.Row >
                    <Divider className="modal-divider" />
                    <img className="progressbar-image-box" src={box} />
                    <p className="progressbar p-text"> Connect Wallet </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img style={{ opacity: '0.5' }} className="progressbar-image-box" src={box} />
                    <p style={{ opacity: '0.5' }} className="progressbar p-text"> Verify Location </p>
                  </Grid.Row>
                </div>

                <div className="modal-content-container">
                  <Grid>
                    <Grid.Row>
                      <h3 className="modal-h3"> Create Account </h3>
                    </Grid.Row>
                    <Grid.Row>
                      <p className="modal-p">1. Connect your Metamask wallet.</p>
                    </Grid.Row>
                    <Grid.Row>
                      <Container style={{ textAlign: 'left', marginLeft: '50px', marginTop: '10px', width: '800px' }}>
                        <a href='#' onClick={this.onMetamask}>
                          <Image src={metamask} inline rounded bordered style={{ width: '110px' }} />
                        </a>

                        {this.state.isValidMetamask == 1 ?
                          <p className="modal-p-error">
                            Failed to add address.
                          </p> : <p />
                        }
                      </Container>
                    </Grid.Row>
                  </Grid>
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ModalVerify
