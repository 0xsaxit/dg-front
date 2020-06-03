import React from 'react';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import eth from '../../static/images/eth_circle.webp';
import dg from '../../static/images/authorize_title.png';
import { Button } from 'semantic-ui-react';
import { Table, Modal, Icon } from 'semantic-ui-react';
import ModalDeposit from '../modal/ModalDeposit';
import ModalWithdraw from '../modal/ModalWithdraw';

import Global from '../constants';

// let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
};

class WalletInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    if (window.web3) {
      console.log(window);
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }

    // Global = require('../constants').default;

    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );

    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });

    await this.getUserData();
  }

  async getUserData() {
    await this.getTokenBalance();
    await this.getUserName();
  }

  update = () => {
    this.getTokenBalance();
  };

  getUserInfo = () => {
    return fetch(`${Global.BASE_URL}/order/getUser`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
      }),
    });
  };

  getUserName = async () => {
    try {
      let response = await this.getUserInfo();
      let json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return;
        }

        this.setState({ username: json.name });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  getTokenBalance = async () => {
    try {
      const amount = await Global.balanceOfToken('matic', this.maticWeb3);
      this.setState({
        tokenBalance: window.web3
          .fromWei(amount, 'ether')
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    } catch (err) {
      console.log(err);
    }
  };

  getEthBalance = () => {
    try {
      var Obj = this;
      // window.web3.eth.getBalance(USER_ADDRESS, function(err, amount) {
      //   if (err)
      //     return;

      //   Obj.setState({ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8)});
      // });
      this.maticWeb3.eth.getBalance(USER_ADDRESS, function (err, amount) {
        if (err) return;
        Obj.setState({
          ethBalance: window.web3.fromWei(amount, 'ether').toFixed(8),
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // verifyNetwork = () => {
  // window.web3.version.getNetwork(async (err, network) => {

  // if (network === Global.MATIC_NETWORK_ID) {
  // this.isMatic = true;
  // await this.getTokenBalance();
  // } else {
  //   this.isMatic = false;
  //   await this.getTokenBalance(false);
  // }

  // });
  // };

  render() {
    const data = [
      {
        coin1: 'MANA',
        image1: mana,
        balance1: this.state.tokenBalance,
        enabled: 1,
      },
      {
        coin2: 'ETH',
        image2: eth,
        balance2: this.state.ethBalance,
        enabled: 0,
      },
      {
        coin: 'DAI',
        image: dai,
        balance: 0,
        enabled: 0,
      },
      {
        coin: 'DG',
        image: dg,
        balance: 0,
        enabled: 0,
      },
    ];

    let button;

    if (this.state.tokenBalance == 0) {
      button = (
        <span>
          <ModalDeposit
            showSpinner={this.props.showSpinner}
            hideSpinner={this.props.hideSpinner}
            update={this.update}
            authvalue={4}
          />
          <Icon name="exclamation-circle" style={{ color: 'red' }} />
        </span>
      );
    } else {
      button = (
        <ModalDeposit
          showSpinner={this.props.showSpinner}
          hideSpinner={this.props.hideSpinner}
          update={this.update}
          authvalue={4}
        />
      );
    }

    return (
      <div className="wallet_board">
        <div className="account">
          <span className="green-dot">&#8226;</span>
          <span className="wallet-top-text">Metamask</span>
          <span className="wallet-top-text2">
            {USER_ADDRESS
              ? USER_ADDRESS.substr(0, 9) + '...' + USER_ADDRESS.substr(-4)
              : ''}
          </span>
        </div>
        <div style={{ padding: '20px 0' }}>
          <div style={{ padding: '0 15px 0px 21px' }}>
            <h3 className="wallet-info-h3">
              Matic Balances
              <Modal
                size="small"
                className="info-modal"
                trigger={
                  <i
                    className="info circle icon"
                    style={{
                      cursor: 'pointer',
                      verticalAlign: 'top',
                      fontSize: '10px',
                    }}
                  />
                }
                closeIcon
              >
                <h3 className="wallet-info-modal-h3">What is Matic Network?</h3>
                <Modal.Content className="modal-content">
                  <p className="modal-font">
                    Matic Network is a Plasma sidechain that allows for instant
                    transactions for Ethereum tokens while maintaining the
                    security of the Ethereum mainchain. To use Matic, deposit
                    your Ethereum tokens with a deposit transaction. The tokens
                    will then be instantly usable in all our games.
                  </p>
                  <p className="modal-font">
                    When you wish to withdraw from Matic and retrieve your
                    tokens on the mainchain, initiate another withdrawal
                    transaction. Withdrawals may take up to 1 week, but will be
                    much quicker soon.
                  </p>
                </Modal.Content>
              </Modal>
            </h3>
            <p className="wallet-top-text3">
              Default games are free, deposit to Matic Network to play with
              crypto. Decentral Games is currently in beta.
            </p>
          </div>
          <div id="balance-box" style={{ marginTop: '24px' }}>
            <Table
              id="header"
              className="info-table"
              singleLine
              fixed
              style={{ marginBottom: 0 }}
            >
              <Table.Body>
                <Table.Row>
                  <span id="wallet-row">
                    <img
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                      className="image inline"
                      width="20px"
                      height="20px"
                      src={mana}
                    />
                    {this.state.tokenBalance} MANA
                    <span style={{ float: 'right' }} id="wallet-row3">
                      {button}
                      <ModalWithdraw
                        isLink={0}
                        showSpinner={this.props.showSpinner}
                        hideSpinner={this.props.hideSpinner}
                      />
                    </span>
                  </span>
                </Table.Row>

                <Table.Row>
                  <span id="wallet-row">
                    <img
                      id="grey-img"
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                      className="image inline"
                      width="20px"
                      height="20px"
                      src={dai}
                    />
                    <span>{this.state.ethBalance} DAI</span>
                    <span style={{ float: 'right' }}>
                      <div className="wallet-info-button-container">
                        <p className="wallet-info-deposit">Deposit</p>
                        <p className="wallet-info-withdraw">Withdraw</p>
                      </div>
                    </span>
                  </span>
                </Table.Row>

                <Table.Row>
                  <span id="wallet-row">
                    <img
                      id="grey-img"
                      style={{ verticalAlign: 'middle', marginRight: '6px' }}
                      className="image inline"
                      width="20px"
                      height="20px"
                      src={eth}
                    />
                    <span>{this.state.ethBalance} ETH</span>
                    <span style={{ float: 'right' }}>
                      <div className="wallet-info-button-container">
                        <p className="wallet-info-deposit">Deposit</p>
                        <p className="wallet-info-withdraw">Withdraw</p>
                      </div>
                    </span>
                  </span>
                </Table.Row>

              </Table.Body>
            </Table>
          </div>
          <p className="wallet-bottom-text">
            By depositing you agree to our{' '}
            <a
              href="https://docs.decentral.games/disclaimer"
              style={{ color: 'rgba(1, 133, 244, 1)' }}
            >
              {' '}
              disclaimer.
            </a>
          </p>
        </div>
      </div>
    );
  }
}

export default WalletInfo;
