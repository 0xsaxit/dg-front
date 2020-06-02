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
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({
        manaTokenBalanceL1: (amount1 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
      this.setState({
        manaTokenBalanceL2: (amount2 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    } catch (err) {
      console.log(err);
    }
  };


  render() {

    return (
      <div className="wallet_board" style={{ height: '420px' }}>
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
              Balances
            </h3>
            <p className="wallet-top-text3">
              Default games are free, deposit to Matic Network to play with
              crypto. Decentral Games is currently in beta.
            </p>
          </div>
          <div id="balance-box" style={{ marginTop: '24px' }}>
            <div style = {{ position: 'relative', paddingBottom: '15px' }}>
              <div style = {{ minWidth: '50%', float: 'left', paddingLeft: '21px' }}>
                <span>
                  MAINCHAIN
                </span>
              </div>
              <div style = {{ minWidth: '50%', float: 'left'}}>
                <span>
                  MATIC NETWORK
                </span>
              </div>
            </div>
            <Table
              id="header"
              className="info-table"
              singleLine
              fixed
              style={{ marginBottom: 0 }}
            >
              <Table.Body>
                <Table.Row>
                  <div style = {{ position: 'relative', width: '100%'}}>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span id="wallet-row">
                        <img
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={mana}
                        />
                        {this.state.manaTokenBalanceL1} MANA
                      </span>
                    </div>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span style={{ float: 'right', marginLeft: '0px' }} id="wallet-balance-row">
                        <img
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={mana}
                        />
                        {this.state.manaTokenBalanceL2} MANA
                      </span>
                    </div>
                  </div>
                </Table.Row>

                <Table.Row>
                  <div style = {{ position: 'relative', width: '100%'}}>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span id="wallet-row">
                        <img
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={dai}
                        />
                        0 DAI
                      </span>
                    </div>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span style={{ float: 'right', marginLeft: '0px' }} id="wallet-balance-row3">
                      <img
                        style={{ verticalAlign: 'middle', marginRight: '6px' }}
                        className="image inline"
                        width="20px"
                        height="20px"
                        src={dai}
                      />
                      0 DAI
                      </span>
                    </div>
                  </div>
                </Table.Row>

                <Table.Row>
                  <div style = {{ position: 'relative', width: '100%'}}>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span id="wallet-row">
                        <img
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={eth}
                        />
                        0 ETH
                      </span>
                    </div>
                    <div style = {{ minWidth: '50%', float: 'left'}}>
                      <span style={{ float: 'right', marginLeft: '0px' }} id="wallet-balance-row2">
                        <img
                          style={{ verticalAlign: 'middle', marginRight: '6px' }}
                          className="image inline"
                          width="20px"
                          height="20px"
                          src={eth}
                        />
                        0 ETH
                      </span>
                    </div>
                  </div>
                </Table.Row>

              </Table.Body>
            </Table>
          </div>
          <p className="wallet-bottom-text">
            By using this website you agree to our{' '}
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
