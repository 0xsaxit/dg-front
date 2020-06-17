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
  manaTokenBalanceL1: 0,
  manaTokenBalanceL2: 0,
  daiTokenBalanceL1: 0,
  daiTokenBalanceL2: 0,
  ethTokenBalanceL1: 0,
  ethTokenBalanceL2: 0,
  username: '',
};

class WalletBalances extends React.Component {
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
    return fetch(`${Global.API_BASE_URL}/order/getUser`, {
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
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({ manaTokenBalanceL1: amount1 });
      this.setState({ manaTokenBalanceL2: amount2 });
    } catch (err) {
      console.log(err);
    }
  };

  render() {
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
                    transactions for Ethereum tokens. To play our games, you
                    must deposit Ethereum tokens to Matic. After 12
                    confirmations, the tokens will appear in your Matic balance
                    and are usable in our games.
                  </p>
                  <p className="modal-font">
                    To withdraw from Matic and retrieve your tokens on the
                    Ethereum mainchain, you must initiate a withdrawal
                    transaction. Withdrawals take 5-10 minutes to complete.
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
                  <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span id="wallet-row">
                        <img
                          style={{
                            verticalAlign: 'middle',
                            marginRight: '6px',
                          }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={mana}
                        />
                        {this.state.manaTokenBalanceL2} MANA
                      </span>
                    </div>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span
                        style={{ float: 'right', marginLeft: '0px' }}
                        id="wallet-balance-row"
                      >
                        <ModalDeposit />
                        <ModalWithdraw />
                      </span>
                    </div>
                  </div>
                </Table.Row>

                <Table.Row>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span id="wallet-row">
                        <img
                          style={{
                            verticalAlign: 'middle',
                            marginRight: '6px',
                          }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={dai}
                        />
                        0 DAI
                      </span>
                    </div>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span style={{ float: 'right' }}>
                        <div className="wallet-info-button-container">
                          <p className="wallet-info-deposit">Deposit</p>
                          <p className="wallet-info-withdraw">Withdraw</p>
                        </div>
                      </span>
                    </div>
                  </div>
                </Table.Row>

                <Table.Row>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span id="wallet-row">
                        <img
                          style={{
                            verticalAlign: 'middle',
                            marginRight: '6px',
                          }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={eth}
                        />
                        0 ETH
                      </span>
                    </div>
                    <div style={{ minWidth: '50%', float: 'left' }}>
                      <span style={{ float: 'right' }}>
                        <div className="wallet-info-button-container">
                          <p className="wallet-info-deposit">Deposit</p>
                          <p className="wallet-info-withdraw">Withdraw</p>
                        </div>
                      </span>
                    </div>
                  </div>
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

export default WalletBalances;
