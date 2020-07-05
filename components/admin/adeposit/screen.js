import React from 'react';
import { Redirect } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
// import box from '../../../static/images/box.png';
// import check from '../../../static/images/check.png';
// import verify from '../../../static/images/switch_matic.png';
import { Header, Button } from 'semantic-ui-react';
import {
  Container,
  Grid,
  Dropdown,
  Input,
  Image,
  Breadcrumb,
} from 'semantic-ui-react';
import Spinner from '../../../Spinner';
import AdminCheck from '../adminCheck';
// import logo from '../../../static/images/logo.png';
// ---------------------------------------------------------------------
let Global;
var UNIT = 1;
// var UNIT = 1000;
var USER_ADDRESS;

const INITIAL_STATE = {
  isLoaded: 0,
  isCustomAmount: 0,
  amount: 1000,
  networkID: 0,
  isValidDeposit: 0,
  isRunningTransaction: false,
};

class Deposit extends React.Component {
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
    Global = require('../../Constants').default;
  }

  ifMobileRedirect = () => {
    if (isMobile) {
      return <Redirect to="/" />;
    }
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network), isLoaded: 2 });
    });
  };

  onChangeAmount = (e, d) => {
    if (d.value == -1) {
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

  depositMana = async (e, d) => {
    try {
      this.setState({ isRunningTransaction: true });
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      var amount_wei = ((this.state.amount / UNIT) * Global.FACTOR).toString();
      var allowed_amount = await Global.getAllowedToken(
        Global.CHILD_TOKEN_ADDRESS_MANA,
        Global.TREASURY_SLOTS_ADDRESS,
        USER_ADDRESS
      );
      allowed_amount = allowed_amount / Global.FACTOR;
      console.log(allowed_amount);
      if (allowed_amount == 0)
        await Global.approveToken(
          'matic',
          Global.MAX_AMOUNT,
          Global.TREASURY_SLOTS_ADDRESS,
          USER_ADDRESS
        );
      else if (allowed_amount < this.state.amount / UNIT) {
        await Global.approveToken(
          'matic',
          0,
          Global.TREASURY_SLOTS_ADDRESS,
          USER_ADDRESS
        );
        await Global.approveToken(
          'matic',
          Global.MAX_AMOUNT,
          Global.TREASURY_SLOTS_ADDRESS,
          USER_ADDRESS
        );
      }

      var txHash = await Global.depositToParent(amount_wei, USER_ADDRESS);
      if (txHash != false) {
        var ret = await Global.getConfirmedTx(txHash);
        if (!ret || ret.status == '0x0') {
          console.log('network error');
          this.setState({ isValidDeposit: 1, isRunningTransaction: false });
          return;
        }

        this.setState({ isValidDeposit: 2, isRunningTransaction: false });
        this.props.history.push('/admin/');
        return;
      }
    } catch (err) {
      console.log(err);
    }
    this.setState({ isValidDeposit: 1, isRunningTransaction: false });
  };

  render() {
    const amount = [
      { key: 1, text: '1000 MANA', value: 1000 },
      { key: 2, text: '2000 MANA', value: 2000 },
      { key: 3, text: '3000 MANA', value: 3000 },
      { key: 4, text: '4000 MANA', value: 4000 },
      { key: 5, text: '5000 MANA', value: 5000 },
      { key: 6, text: 'Custom', value: -1 },
    ];

    if (this.state.networkID == 0) this.verifyNetwork();

    if (this.state.isLoaded == 0) {
      return (
        <div id="deposit">
          <Container style={{ marginTop: '25.5em', height: '35em' }}>
            <Spinner background={1} />
          </Container>
        </div>
      );
    }

    if (!this.isBrowserMetamsk) {
      return (
        <div id="deposit">
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
              style={{ marginTop: '40vh' }}
            >
              <Header>
                {' '}
                Please use a Chrome Browser with Metamask enabled to proceed. If
                you've haven't already, download Chrome{' '}
                <a className="red" href="https://www.google.com/chrome/">
                  here
                </a>{' '}
                and Metamask{' '}
                <a className="redlink" href="https://metamask.io/">
                  here
                </a>{' '}
              </Header>
            </Grid>
          </Container>
        </div>
      );
    }

    if (this.state.networkID == parseInt(Global.MATIC_NETWORK_ID)) {
      return (
        <div id="deposit">
          {this.ifMobileRedirect()}
          <Spinner background={this.state.isRunningTransaction} />
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              <Grid.Column>
                <div className="progressbar">
                  <a href="https://decentral.games">
                    <img
                      className="image inline"
                      src={Global.IMAGES.LOGO}
                      style={{
                        width: '230px',
                        paddingTop: '25px',
                        paddingBottom: '25px',
                      }}
                    />
                  </a>
                  <Grid.Row
                    style={{
                      paddingTop: '25px',
                      borderTop: '1px solid lightgray',
                    }}
                  >
                    <img
                      style={{ opacity: '0.5' }}
                      className="progressbar image inline"
                      src={Global.IMAGES.BOX}
                    />
                    <img
                      style={{ opacity: '0.5' }}
                      style={{
                        marginLeft: '-15px',
                        opacity: '0.5',
                        marginBottom: '3px',
                      }}
                      className="progressbar image inline"
                      src={Global.IMAGES.CHECK}
                    />
                    <p
                      style={{ opacity: '0.5', marginLeft: '2px' }}
                      className="progressbar"
                    >
                      {' '}
                      Switch to Matic RPC{' '}
                    </p>
                  </Grid.Row>
                  <Grid.Row style={{ marginTop: '15px' }}>
                    <img
                      className="progressbar image inline"
                      src={Global.IMAGES.BOX}
                    />
                    <p className="progressbar"> Select Amount </p>
                  </Grid.Row>
                </div>
                <div
                  className="contentContainer"
                  style={{
                    padding: '20px',
                    marginTop: '10px',
                    textAlign: 'left',
                  }}
                >
                  <h3 style={{ textAlign: 'left', marginLeft: '10px' }}>
                    {' '}
                    Admin - Deposit to MANA Slots Contract{' '}
                  </h3>
                  <span
                    style={{
                      display: 'block',
                      float: 'left',
                      textAlign: 'left',
                      fontSize: '1.33em',
                      marginTop: '30px',
                      marginLeft: '20px',
                    }}
                  >
                    2.
                  </span>
                  <p
                    style={{
                      textAlign: 'left',
                      fontSize: '1.33em',
                      paddingLeft: '45px',
                      marginTop: '47px',
                    }}
                  >
                    Select amount to deposit to MANA Slots Contract.
                  </p>
                  {this.state.isCustomAmount == 0 ? (
                    <Dropdown
                      selection
                      options={amount}
                      value={this.state.amount}
                      style={{
                        width: '300px',
                        marginLeft: '20px',
                        marginTop: '10px',
                      }}
                      onChange={this.onChangeAmount}
                    />
                  ) : (
                    <Input
                      style={{
                        width: '300px',
                        marginLeft: '20px',
                        marginTop: '10px',
                      }}
                      value={this.state.amount}
                      onChange={this.onChangeCustomAmount}
                    />
                  )}
                  <Button
                    id="button-6"
                    color="blue"
                    style={{
                      marginTop: '15px',
                      marginLeft: '20px',
                      display: 'block',
                    }}
                    onClick={this.depositMana}
                  >
                    Deposit
                  </Button>

                  {this.state.isValidDeposit == 1 ? (
                    <p
                      style={{
                        textAlign: 'left',
                        color: 'red',
                        marginTop: '10px',
                      }}
                    >
                      Deposit failed.
                    </p>
                  ) : (
                    <p />
                  )}
                </div>
              </Grid.Column>
            </Grid>
          </div>
        </div>
      );
    }

    return (
      <div id="deposit">
        {this.ifMobileRedirect()}
        <Spinner background={this.state.isRunningTransaction} />
        <div className="ui depositContainer">
          <Grid verticalAlign="middle" textAlign="center">
            <Grid.Column>
              <div className="progressbar">
                <a href="https://decentral.games">
                  <img
                    className="image inline"
                    src={Global.IMAGES.LOGO}
                    style={{
                      width: '230px',
                      paddingTop: '25px',
                      paddingBottom: '25px',
                    }}
                  />
                </a>
                <Grid.Row
                  style={{
                    paddingTop: '25px',
                    borderTop: '1px solid lightgray',
                  }}
                >
                  <img
                    className="progressbar image inline"
                    src={Global.IMAGES.BOX}
                  />
                  <p className="progressbar"> Switch to Matic RPC </p>
                </Grid.Row>
                <Grid.Row style={{ marginTop: '15px' }}>
                  <img
                    style={{ opacity: '0.5' }}
                    className="progressbar image inline"
                    src={Global.IMAGES.BOX}
                  />
                  <p style={{ opacity: '0.5' }} className="progressbar">
                    {' '}
                    Select Amount{' '}
                  </p>
                </Grid.Row>
              </div>

              <div
                className="contentContainer"
                style={{
                  padding: '20px',
                  marginTop: '10px',
                  textAlign: 'left',
                }}
              >
                <h3 style={{ textAlign: 'left', marginLeft: '10px' }}>
                  {' '}
                  Admin - Deposit to MANA Slots Contract{' '}
                </h3>
                <span
                  style={{
                    display: 'block',
                    float: 'left',
                    textAlign: 'left',
                    fontSize: '1.33em',
                    marginTop: '30px',
                    marginLeft: '20px',
                  }}
                >
                  1.
                </span>
                <p
                  style={{
                    textAlign: 'left',
                    fontSize: '1.33em',
                    paddingLeft: '45px',
                    marginTop: '47px',
                  }}
                >
                  On your Metamask extension, open the Network dropdown menu and
                  select 'Matic' Testnet.
                </p>
                {/* <img
                  style={{ width: '240px', marginLeft: '100px' }}
                  src={verify}
                  className="image small inline"
                /> */}

                {this.state.networkID != parseInt(Global.MATIC_NETWORK_ID) ? (
                  <p
                    style={{
                      textAlign: 'left',
                      color: 'red',
                      marginTop: '10px',
                      marginLeft: '100px',
                    }}
                  >
                    This is not Matic Network.
                  </p>
                ) : (
                  <p />
                )}
              </div>
            </Grid.Column>
          </Grid>
        </div>
      </div>
    );
  }
}

export default AdminCheck(Deposit);
