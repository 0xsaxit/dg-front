import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import box from '../../static/images/box.png';
import check from '../../static/images/check.png';
import verify from '../../static/images/switch_matic.png';
import verify1 from '../../static/images/switch_ropsten.png';
import logo from '../../static/images/logo.png';
import { Header, Button } from 'semantic-ui-react';
import {
  Container,
  Grid,
  Dropdown,
  Input,
  Modal,
  Divider,
} from 'semantic-ui-react';
// ---------------------------------------------------------------------
import dynamic from 'next/dynamic';
import Global from '../constants';

// let Global;

// import ModalFunctions from './ModalFunctions';

var USER_ADDRESS = '';
var UNIT = 1;
// var UNIT = 1000;

const INITIAL_STATE = {
  isLoaded: 0,
  isCustomAmount: 0,
  amount: 1000,
  networkID: 0,
  isExistWithdraw: 0,
  isValidStep1: 0,
  isConfirmStep1: 0,
  isValidStep2: 0,
  isConfirmStep2: 0,
  isConfirmStep3: 0,
};

class Withdraw extends React.Component {
  state = { modalOpen: false };
  handleOpen = async () => {
    let isUpdate = false;
    let txid = localStorage.getItem('withdrawTxID');
    if (this.state.isLoaded === 0) this.props.showSpinner();
    if (this.props.isLink != 0) {
      if (txid === '') isUpdate = true;
      localStorage.setItem('withdrawTxID', this.props.tx);
    } else {
      if (txid !== '') isUpdate = true;
      localStorage.setItem('withdrawTxID', '');
    }

    if (isUpdate) {
      this.state = { ...INITIAL_STATE };

      for (var i = 0; i < 3; i++) {
        USER_ADDRESS = window.web3.currentProvider.selectedAddress;
        if (!USER_ADDRESS) {
          await Global.delay(2000);
          continue;
        }

        let ret = await this.checkExistWithdraw();
        if (!ret) {
          await Global.delay(2000);
          continue;
        }

        ret = await this.checkWithdrawTransaction();
        if (!ret) {
          await Global.delay(2000);
          continue;
        }

        ret = await this.checkUserVerifyStep();
        if (!ret) {
          await Global.delay(2000);
          continue;
        }
      }
    }

    localStorage.setItem('modalWithdraw', 1);
    this.setState({ modalOpen: true });
    this.props.hideSpinner();
  };

  handleClose = () => {
    localStorage.setItem('modalWithdraw', 0);
    this.setState({ modalOpen: false });
  };

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
    this.isBrowserMetamsk = 0;

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.isBrowserMetamsk = 1;
    }
  }

  async componentDidMount() {
    // Global = require('../constants').default;

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

        let ret = await this.checkExistWithdraw();
        if (!ret) {
          await Global.delay(2000);
          continue;
        }

        ret = await this.checkWithdrawTransaction();
        if (!ret) {
          await Global.delay(2000);
          continue;
        }

        ret = await this.checkUserVerifyStep();
        if (ret) {
          if (parseInt(localStorage.getItem('modalWithdraw')) == 1)
            this.setState({ modalOpen: true });
          return;
        }

        await Global.delay(2000);
      }
    } catch (e) {
      console.log(e);
    }

    this.setState({ isLoaded: 0 });
    this.props.hideSpinner();
  }

  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify();
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ isLoaded: 1 });
          this.props.hideSpinner();
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue == 6) this.setState({ isLoaded: 2 });
        else this.setState({ isLoaded: 1 });

        this.props.hideSpinner();
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    this.props.hideSpinner();
    return false;
  };

  checkExistWithdraw = async () => {
    try {
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        const response = await this.getWithdrawExist();
        const json = await response.json();
        if (json.status === 'ok') {
          if (json.result === 'true') {
            this.setState({ isExistWithdraw: 1 });
          }
        }
      } else this.setState({ isExistWithdraw: 0 });
      return true;
    } catch (error) {
      console.log(error);
      this.setState({ isExistWithdraw: 0 });
    }

    return false;
  };

  checkWithdrawTransaction = async () => {
    try {
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        return true;
      }

      const response = await this.getWithdrawTransaction(txid);
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return true;
        }

        let step = parseInt(json.result.step);
        let amount = parseInt(json.result.amount);
        if (step == 1) this.setState({ isValidStep1: 2, amount });
        else if (step == 2) this.setState({ isConfirmStep1: 2, amount });
        else if (step == 3) this.setState({ isValidStep2: 2, amount });
        else if (step == 4) this.setState({ isConfirmStep2: 2, amount });
        else if (step == 5) this.setState({ isConfirmStep3: 2, amount });
        else this.setState({ amount });

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
  };

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to="/" />;
    }
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network) });
    });
  };

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
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

  getWithdrawExist = () => {
    return fetch(`${Global.BASE_URL}/order/existWithdraw`, {
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

  getWithdrawTransaction = (txid) => {
    return fetch(`${Global.BASE_URL}/order/checkHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: txid,
      }),
    });
  };

  checkConfirm = (txid, step) => {
    return fetch(`${Global.BASE_URL}/order/confirmHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: txid,
        step: step,
      }),
    });
  };

  onChangeAmount = (e, d) => {
    if (d.value == -2) {
      this.setState({ amount: 0, isCustomAmount: 1 });
      return;
    }

    this.setState({ amount: d.value });
  };

  onChangeCustomAmount = async (e) => {
    let value = parseInt(e.target.value);
    if (String(value) != 'NaN')
      this.setState({ amount: parseInt(e.target.value) });
    else this.setState({ amount: 0 });
  };

  withdrawManaFromMatic = async (e, d) => {
    try {
      this.props.showSpinner();
      let amount = this.state.amount;
      if (amount == -1) amount = await this.getTokenBalance();

      var amount_wei = ((amount / UNIT) * Global.FACTOR).toString();

      // init withdrawing
      let txHash = await Global.startWithdrawTokenFromMatic(
        Global.MATIC_TOKEN_ADDRESS,
        amount_wei,
        USER_ADDRESS
      );
      if (txHash == false) {
        this.setState({ isValidStep1: 1 });
        this.props.hideSpinner();
        return;
      }
      let ret = await this.updateHistory(
        amount / UNIT,
        'Withdraw',
        'In Progress',
        txHash,
        1
      );
      if (!ret) {
        console.log('network error');
        this.setState({ isValidStep1: 1 });
        this.props.hideSpinner();
        return;
      }

      localStorage.setItem('withdrawTxID', txHash);
      this.setState({ isValidStep1: 2 });
      this.props.hideSpinner();
      return;
    } catch (err) {
      console.log(err);
    }

    this.setState({ isValidStep1: 1 });
    this.props.hideSpinner();
  };

  confirmStep1 = async (e, d) => {
    try {
      this.props.showSpinner();
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        this.setState({ isConfirmStep1: 1 });
        this.props.hideSpinner();
        return;
      }

      const response = await this.checkConfirm(txid, 1);
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.props.hideSpinner();
          this.handleClose();
          return;
        }

        let ret = await this.updateHistory(
          this.state.amount / UNIT,
          'Withdraw',
          'Ready',
          txid,
          2
        );
        if (!ret) {
          console.log('network error');
          this.setState({ isConfirmStep1: 1 });
          this.props.hideSpinner();
          return;
        }
        this.setState({ isConfirmStep1: 2 });
        this.props.hideSpinner();
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ isConfirmStep1: 1 });
    this.props.hideSpinner();
  };

  continueStep2 = async (e, d) => {
    try {
      this.props.showSpinner();
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        this.setState({ isValidStep2: 1 });
        this.props.hideSpinner();
        return;
      }

      let ret = await Global.withdrawTokenFromMatic(
        txid,
        window.web3.currentProvider.selectedAddress
      );
      if (ret == false) {
        await this.updateHistory(
          this.state.amount / UNIT,
          'Withdraw',
          'Failed',
          txid,
          2
        );
        this.setState({ isValidStep2: 1 });
        this.props.hideSpinner();
        return;
      }

      ret = await this.updateHistory(
        this.state.amount / UNIT,
        'Withdraw',
        'In Progress',
        txid,
        3
      );
      if (!ret) {
        console.log('network error');
        this.setState({ isValidStep2: 1 });
        this.props.hideSpinner();
        return;
      }

      this.setState({ isValidStep2: 2 });
      this.props.hideSpinner();
      return;
    } catch (err) {
      console.log(err);
    }

    this.setState({ isValidStep2: 1 });
    this.props.hideSpinner();
  };

  confirmStep2 = async (e, d) => {
    try {
      this.props.showSpinner();
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        this.setState({ isConfirmStep2: 1 });
        this.props.hideSpinner();
        return;
      }

      const response = await this.checkConfirm(txid, 2);
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.props.hideSpinner();
          this.handleClose();
          return;
        }

        let ret = await this.updateHistory(
          this.state.amount / UNIT,
          'Withdraw',
          'Ready',
          txid,
          4
        );
        if (!ret) {
          console.log('network error');
          this.setState({ isConfirmStep2: 1 });
          this.props.hideSpinner();
          return;
        }
        this.setState({ isConfirmStep2: 2 });
        this.props.hideSpinner();
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ isConfirmStep2: 1 });
    this.props.hideSpinner();
  };

  confirmStep3 = async (e, d) => {
    try {
      this.props.showSpinner();
      let txid = localStorage.getItem('withdrawTxID');
      if (txid == null || txid == '') {
        this.setState({ isConfirmStep3: 1 });
        this.props.hideSpinner();
        return;
      }

      // exit withdrawing
      let ret = await Global.processExits(
        Global.ROPSTEN_TOKEN_ADDRESS,
        window.web3.currentProvider.selectedAddress
      );
      if (ret == false) {
        await this.updateHistory(
          this.state.amount / UNIT,
          'Withdraw',
          'Failed',
          txid,
          4
        );
        this.setState({ isConfirmStep3: 1 });
        this.props.hideSpinner();
        return;
      }

      ret = await this.updateHistory(
        this.state.amount / UNIT,
        'Withdraw',
        'Confirmed',
        txid,
        5
      );
      if (!ret) {
        console.log('network error');
        this.setState({ isConfirmStep3: 1 });
        this.props.hideSpinner();
        return;
      }
      this.setState({ isConfirmStep3: 2 });
      this.props.hideSpinner();
      this.handleClose();
    } catch (err) {
      console.log(err);
    }

    this.setState({ isConfirmStep3: 1 });
    this.props.hideSpinner();
  };

  postHistory = async (amount, type, state, txHash, step) => {
    return fetch(`${Global.BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        amount,
        type,
        state,
        txHash,
        step,
      }),
    });
  };

  updateHistory = async (amount, type, state, txHash, step) => {
    try {
      const response = await this.postHistory(
        amount,
        type,
        state,
        txHash,
        step
      );
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  getTokenBalance = async () => {
    try {
      var amount;
      amount = await Global.balanceOfToken('matic');
      return parseInt(window.web3.fromWei(amount, 'ether').toFixed(0));
    } catch (err) {
      console.log(err);
    }

    return 0;
  };

  render() {
    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
      { key: 6, text: 'All', value: -1 },
      { key: 7, text: 'Custom', value: -2 },
    ];

    if (this.state.networkID == 0) this.verifyNetwork();

    if (this.state.isLoaded === 0) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            <Container style={{ height: '35em' }}></Container>
          </div>
        </Modal>
      );
    }

    if (this.state.isLoaded === 1) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
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
                <p className="modal-p">
                  {' '}
                  Please visit the authorize tab to finish verification.{' '}
                </p>
              </Grid>
            </Container>
          </div>
        </Modal>
      );
    }

    if (!this.isBrowserMetamsk) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
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
                <p className="modal-p">
                  {' '}
                  Please use Chrome Browser with Metamask enabled to proceed.{' '}
                </p>
              </Grid>
            </Container>
          </div>
        </Modal>
      );
    }

    if (this.state.networkID == 0) this.verifyNetwork();

    if (this.state.isExistWithdraw == 1) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
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
                <p className="modal-p">
                  {' '}
                  You have a withdrawal in progress. Please check back in a few
                  days.{' '}
                </p>
              </Grid>
            </Container>
          </div>
        </Modal>
      );
    }

    if (this.state.isConfirmStep2 == 2) {
      if (this.state.networkID == 3) {
        return (
          <Modal
            trigger={
              this.props.isLink == 0 ? (
                <Button
                  content="Withdraw"
                  id="depositButton"
                  onClick={this.handleOpen}
                  style={{}}
                />
              ) : this.props.isLink == 1 ? (
                <a
                  style={{ color: 'white' }}
                  id="tx-row-status"
                  href="#"
                  onClick={this.handleOpen}
                >
                  CONTINUE
                </a>
              ) : (
                <a
                  style={{ color: 'white' }}
                  id="tx-row-status"
                  href="#"
                  onClick={this.handleOpen}
                >
                  START
                </a>
              )
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
            <div id="deposit">
              {this.ifMobileRedirect()}
              <div className="ui withdrawContainer">
                <Grid verticalAlign="middle" textAlign="center">
                  <Grid.Column>
                    <div className="progressbar2">
                      <img className="modal-logo" src={logo} />
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <Divider className="modal-divider" />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Switch to Matic RPC{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Initiate Withdrawal{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Waiting Period{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Switch to Ropsten RPC{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Continue Withdrawal{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Waiting Period{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img className="progressbar-image-box" src={box} />
                        <p className="progressbar p-text"> Waiting Period </p>
                      </Grid.Row>
                    </div>

                    <div className="modal-content-container">
                      <Grid>
                        <Grid.Row>
                          <h3 className="modal-h3"> Withdraw MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p className="modal-p">
                            7. Confirm withdrawal on Ropsten.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          <Button
                            id="depositButton2"
                            color="blue"
                            style={{ marginLeft: '5px', marginBottom: '3em' }}
                            onClick={this.confirmStep3}
                          >
                            Confirm
                          </Button>
                        </Grid.Row>
                      </Grid>

                      {this.state.isConfirmStep3 == 1 ? (
                        <p className="modal-p-error">
                          Withdraw confirm failed.
                        </p>
                      ) : (
                        <p />
                      )}
                      <p className="modal-p-withdraw-note">
                        **Matic Network is a second layer sidechain that allows
                        our games to have much faster in-game transactions.**
                      </p>
                      <p className="modal-p-withdraw-note2">
                        <span style={{ fontWeight: 'bold' }}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain,
                        withdrawals currently take 1 week, and are broken down
                        into 3 steps. You will need to sign 2 more thransactions
                        to complete this withdrawal - one in 1-2 days, and one
                        in 1 week.
                      </p>
                      <p className="modal-withdraw-p-note2">
                        We will be offering instant mainchain liquidity services
                        in the near future.
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          </Modal>
        );
      }

      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="withdraw">
            {this.ifMobileRedirect()}
            <div className="ui withdrawContainer">
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  <div className="progressbar2">
                    <img className="modal-logo" src={logo} />
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <Divider className="modal-divider" />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Matic RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Initiate Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text">
                        {' '}
                        Switch to Ropsten RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Continue Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Confirm Withdrawal{' '}
                      </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Withdraw MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">
                          4. On your Metamask extension, open the Network
                          dropdown menu and select 'Ropsten'.
                        </p>
                      </Grid.Row>
                      <Grid.Row>
                        <img
                          style={{ width: '240px' }}
                          src={verify1}
                          className="image small inline"
                        />
                      </Grid.Row>
                    </Grid>

                    {this.state.networkID != 3 ? (
                      <p className="modal-p-error">
                        This is not Ropsten Network.
                      </p>
                    ) : (
                      <p />
                    )}
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }

    if (this.state.isValidStep2 == 2) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <div className="ui withdrawContainer">
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  <div className="progressbar2">
                    <img className="modal-logo" src={logo} />
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <Divider className="modal-divider" />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Matic RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Initiate Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Ropsten RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Continue Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Confirm Withdrawal{' '}
                      </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Withdraw MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">
                          6. Please check back in 15 minutes to continue
                          withdrawal process from Matic Network.
                        </p>
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          id="depositButton2"
                          color="blue"
                          style={{ marginLeft: '5px', marginBottom: '3em' }}
                          onClick={this.confirmStep2}
                        >
                          Confirm
                        </Button>
                      </Grid.Row>
                    </Grid>

                    {this.state.isConfirmStep2 == 1 ? (
                      <p className="modal-p-error">Withdraw confirm failed.</p>
                    ) : (
                      <p />
                    )}
                    <p className="modal-p-withdraw-note">
                      **Matic Network is a second layer sidechain that allows
                      our games to have much faster in-game transactions.**
                    </p>
                    <p className="modal-withdraw-p-note2">
                      <span style={{ fontWeight: 'bold' }}>NOTE: </span>
                      To ensure upmost security on the Matic sidechain,
                      withdrawals currently take 1 week, and are broken down
                      into 3 steps. You will need to sign 2 more thransactions
                      to complete this withdrawal - one in 1-2 days, and one in
                      1 week.
                    </p>
                    <p className="modal-withdraw-p-note2">
                      We will be offering instant mainchain liquidity services
                      in the near future,
                    </p>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }

    if (this.state.isConfirmStep1 == 2) {
      if (this.state.networkID == 3) {
        return (
          <Modal
            trigger={
              this.props.isLink == 0 ? (
                <Button
                  content="Withdraw"
                  id="depositButton"
                  onClick={this.handleOpen}
                  style={{}}
                />
              ) : this.props.isLink == 1 ? (
                <a
                  style={{ color: 'white' }}
                  id="tx-row-status"
                  href="#"
                  onClick={this.handleOpen}
                >
                  CONTINUE
                </a>
              ) : (
                <a
                  style={{ color: 'white' }}
                  id="tx-row-status"
                  href="#"
                  onClick={this.handleOpen}
                >
                  START
                </a>
              )
            }
            open={this.state.modalOpen}
            onClose={this.handleClose}
            closeIcon
          >
            <div id="deposit">
              {this.ifMobileRedirect()}
              <div className="ui withdrawContainer">
                <Grid verticalAlign="middle" textAlign="center">
                  <Grid.Column>
                    <div className="progressbar2">
                      <img className="modal-logo" src={logo} />
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <Divider className="modal-divider" />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Switch to Matic RPC{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Initiate Withdrawal{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Waiting Period{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-check"
                          src={check}
                        />
                        <p
                          style={{ opacity: '0.5', paddingLeft: '0px' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Switch to Ropsten RPC{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img className="progressbar-image-box" src={box} />
                        <p className="progressbar p-text">
                          {' '}
                          Continue Withdrawal{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <p
                          style={{ opacity: '0.5' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Waiting Period{' '}
                        </p>
                      </Grid.Row>
                      <Grid.Row style={{ marginTop: '15px' }}>
                        <img
                          style={{ opacity: '0.5' }}
                          className="progressbar-image-box"
                          src={box}
                        />
                        <p
                          style={{ opacity: '0.5' }}
                          className="progressbar p-text"
                        >
                          {' '}
                          Confirm Withdrawal{' '}
                        </p>
                      </Grid.Row>
                    </div>

                    <div className="modal-content-container">
                      <Grid>
                        <Grid.Row>
                          <h3 className="modal-h3"> Withdraw MANA </h3>
                        </Grid.Row>
                        <Grid.Row>
                          <p className="modal-p">
                            5. Continue withdrawal to Ropsten.
                          </p>
                        </Grid.Row>
                        <Grid.Row>
                          <Button
                            id="depositButton2"
                            color="blue"
                            style={{ marginLeft: '5px', marginBottom: '3em' }}
                            onClick={this.continueStep2}
                          >
                            Continue
                          </Button>
                        </Grid.Row>
                      </Grid>

                      {this.state.isValidStep2 == 1 ? (
                        <p className="modal-p-error">
                          Withdraw continue failed.
                        </p>
                      ) : (
                        <p />
                      )}
                      <p
                        className="modal-withdraw-p-note"
                        style={{ paddingLeft: '9px' }}
                      >
                        **Matic Network is a second layer sidechain that allows
                        our games to have much faster in-game transactions.**
                      </p>
                      <p
                        className="modal-withdraw-p-note2"
                        style={{ paddingLeft: '9px' }}
                      >
                        <span style={{ fontWeight: 'bold' }}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain,
                        withdrawals currently take 1 week, and are broken down
                        into 3 steps. You will need to sign 2 more thransactions
                        to complete this withdrawal - one in 1-2 days, and one
                        in 1 week.
                      </p>
                      <p
                        className="modal-withdraw-p-note2"
                        style={{ paddingLeft: '9px' }}
                      >
                        We will be offering instant mainchain liquidity services
                        in the near future,
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>
              </div>
            </div>
          </Modal>
        );
      }

      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="withdraw">
            {this.ifMobileRedirect()}
            <div className="ui withdrawContainer">
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  <div className="progressbar2">
                    <img className="modal-logo" src={logo} />
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <Divider className="modal-divider" />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Matic RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Initiate Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text">
                        {' '}
                        Switch to Ropsten RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Continue Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Confirm Withdrawal{' '}
                      </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Withdraw MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">
                          4. On your Metamask extension, open the Network
                          dropdown menu and select 'Ropsten'.
                        </p>
                      </Grid.Row>
                      <Grid.Row>
                        <img
                          style={{ width: '240px' }}
                          src={verify1}
                          className="image small inline"
                        />
                      </Grid.Row>
                    </Grid>

                    {this.state.networkID != 3 ? (
                      <p className="modal-p-error">
                        This is not Ropsten Network.
                      </p>
                    ) : (
                      <p />
                    )}
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }

    if (this.state.isValidStep1 == 2) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                href="#"
                id="tx-row-status"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <div className="ui withdrawContainer">
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  <div className="progressbar2">
                    <img className="modal-logo" src={logo} />
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <Divider className="modal-divider" />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Matic RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Initiate Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text"> Waiting Period </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Ropsten RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Continue Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Confirm Withdrawal{' '}
                      </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Withdraw MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">
                          3. Please check back in 1-2 days to continue
                          withdrawal process from Matic Network.
                        </p>
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          id="depositButton2"
                          color="blue"
                          style={{ marginTop: '-10px', display: 'block' }}
                          onClick={this.confirmStep1}
                        >
                          Confirm
                        </Button>
                      </Grid.Row>
                    </Grid>

                    {this.state.isConfirmStep1 == 1 ? (
                      <p className="modal-p-error">Withdraw confirm failed.</p>
                    ) : (
                      <p />
                    )}
                    <Container>
                      <p className="modal-withdraw-p-note">
                        **Matic Network is a second layer sidechain that allows
                        our games to have much faster in-game transactions.**
                      </p>
                      <p className="modal-withdraw-p-note2">
                        <span style={{ fontWeight: 'bold' }}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain,
                        withdrawals currently take 1 week, and are broken down
                        into 3 steps. You will need to sign 2 more thransactions
                        to complete this withdrawal - one in 1-2 days, and one
                        in 1 week.
                      </p>
                      <p className="modal-withdraw-p-note2">
                        We will be offering instant mainchain liquidity services
                        in the near future,
                      </p>
                    </Container>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }

    if (this.state.networkID == parseInt(Global.MATIC_NETWORK_ID)) {
      return (
        <Modal
          trigger={
            this.props.isLink == 0 ? (
              <Button
                content="Withdraw"
                id="depositButton"
                onClick={this.handleOpen}
                style={{}}
              />
            ) : this.props.isLink == 1 ? (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                CONTINUE
              </a>
            ) : (
              <a
                style={{ color: 'white' }}
                id="tx-row-status"
                href="#"
                onClick={this.handleOpen}
              >
                START
              </a>
            )
          }
          open={this.state.modalOpen}
          onClose={this.handleClose}
          closeIcon
        >
          <div id="deposit">
            {this.ifMobileRedirect()}
            <div className="ui withdrawContainer">
              <Grid verticalAlign="middle" textAlign="center">
                <Grid.Column>
                  <div className="progressbar2">
                    <img className="modal-logo" src={logo} />
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <Divider className="modal-divider" />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-check"
                        src={check}
                      />
                      <p
                        style={{ opacity: '0.5', paddingLeft: '0px' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Matic RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img className="progressbar-image-box" src={box} />
                      <p className="progressbar p-text">
                        {' '}
                        Initiate Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Switch to Ropsten RPC{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Continue Withdrawal{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Waiting Period{' '}
                      </p>
                    </Grid.Row>
                    <Grid.Row style={{ marginTop: '15px' }}>
                      <img
                        style={{ opacity: '0.5' }}
                        className="progressbar-image-box"
                        src={box}
                      />
                      <p
                        style={{ opacity: '0.5' }}
                        className="progressbar p-text"
                      >
                        {' '}
                        Confirm Withdrawal{' '}
                      </p>
                    </Grid.Row>
                  </div>

                  <div className="modal-content-container">
                    <Grid>
                      <Grid.Row>
                        <h3 className="modal-h3"> Withdraw MANA </h3>
                      </Grid.Row>
                      <Grid.Row>
                        <p className="modal-p">
                          2. Select amount to initiate withdrawal of MANA from
                          Matic.
                        </p>
                      </Grid.Row>
                      <Grid.Row>
                        {this.state.isCustomAmount == 0 ? (
                          <Dropdown
                            selection
                            options={amount}
                            value={this.state.amount}
                            style={{ width: '300px', marginTop: '0px' }}
                            onChange={this.onChangeAmount}
                          />
                        ) : (
                          <Input
                            style={{ width: '300px', marginTop: '0px' }}
                            value={this.state.amount}
                            onChange={this.onChangeCustomAmount}
                          />
                        )}
                      </Grid.Row>
                      <Grid.Row>
                        <Button
                          id="depositButton2"
                          color="blue"
                          style={{
                            marginTop: '-10px',
                            display: 'block',
                            marginBottom: '15px',
                          }}
                          onClick={this.withdrawManaFromMatic}
                        >
                          Withdraw
                        </Button>
                      </Grid.Row>
                    </Grid>

                    {this.state.isValidStep1 == 1 ? (
                      <p className="modal-p-error">Withdraw failed.</p>
                    ) : (
                      <p />
                    )}
                    <Container>
                      <p className="modal-withdraw-p-note">
                        **Matic Network is a second layer sidechain that allows
                        our games to have much faster in-game transactions.**
                      </p>
                      <p className="modal-withdraw-p-note2">
                        <span style={{ fontWeight: 'bold' }}>NOTE: </span>
                        To ensure upmost security on the Matic sidechain,
                        withdrawals currently take 1 week, and are broken down
                        into 3 steps. You will need to sign 2 more thransactions
                        to complete this withdrawal - one in 1-2 days, and one
                        in 1 week.
                      </p>
                      <p className="modal-withdraw-p-note2">
                        We will be offering instant mainchain liquidity services
                        in the near future.
                      </p>
                    </Container>
                  </div>
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }

    return (
      <Modal
        trigger={
          this.props.isLink == 0 ? (
            <Button
              content="Withdraw"
              id="depositButton"
              onClick={this.handleOpen}
              style={{}}
            />
          ) : this.props.isLink == 1 ? (
            <a
              style={{ color: 'white' }}
              id="tx-row-status"
              href="#"
              onClick={this.handleOpen}
            >
              CONTINUE
            </a>
          ) : (
            <a
              style={{ color: 'white' }}
              id="tx-row-status"
              href="#"
              onClick={this.handleOpen}
            >
              START
            </a>
          )
        }
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="withdraw">
          {this.ifMobileRedirect()}
          <div className="ui withdrawContainer">
            <Grid verticalAlign="middle" textAlign="center">
              <Grid.Column>
                <div className="progressbar2">
                  <img className="modal-logo" src={logo} />
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <Divider className="modal-divider" />
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Switch to Matic RPC{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Initiate Withdrawal{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Waiting Period{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Switch to Ropsten RPC{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Continue Withdrawal{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Waiting Period{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar-image-box"
                      src={box}
                    />
                    <p
                      style={{ opacity: '0.5' }}
                      className="progressbar p-text"
                    >
                      {' '}
                      Confirm Withdrawal{' '}
                    </p>
                  </Grid.Row>
                </div>

                <div className="modal-content-container">
                  <Grid>
                    <Grid.Row>
                      <h3 className="modal-h3"> Withdraw MANA </h3>
                    </Grid.Row>
                    <Grid.Row>
                      <p className="modal-p">
                        1. On your Metamask extension, open the Network dropdown
                        menu and select 'Matic' Testnet.
                      </p>
                    </Grid.Row>
                    <Grid.Row>
                      <img
                        style={{ width: '240px' }}
                        src={verify}
                        className="image small inline"
                      />
                    </Grid.Row>
                  </Grid>

                  {this.state.isMaticNetwork !=
                  parseInt(Global.MATIC_NETWORK_ID) ? (
                    <p className="modal-p-error">This is not Matic Network.</p>
                  ) : (
                    <p />
                  )}
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Withdraw;