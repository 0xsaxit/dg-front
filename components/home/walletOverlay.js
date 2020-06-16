import React from 'react';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import eth from '../../static/images/eth_circle.webp';
import dg from '../../static/images/authorize_title.png';
import { Button, Divider } from 'semantic-ui-react';
import { Table, Modal, Icon } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
// import ModalDeposit from '../ModalDeposit';
// import ModalWithdraw from '../ModalWithdraw';

let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  tokenBalance: 0,
  ethBalance: 0,
  username: '',
};

class WalletOverlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  dashboard = () => {
    this.props.walletInfo();
  };

  async componentDidMount() {
    Global = require('../constants').default;
    await this.getUserData();

    if (window.web3) {
      console.log(window);
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );
      let object = this;
      window.ethereum.on('accountsChanged', async function (accounts) {
        await object.getUserData();
      });
    }
  }

  async getUserData() {
    // this.verifyNetwork();
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
      var amount;

      amount = await Global.balanceOfToken('matic', this.maticWeb3);
      this.setState({ tokenBalance: amount });
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
  //   if (window.web3) {
  //     window.web3.version.getNetwork(async (err, network) => {
  //       if (network === Global.MATIC_NETWORK_ID) {
  //         this.isMatic = true;
  //         await this.getTokenBalance(true);
  //       } else {
  //         this.isMatic = false;
  //         await this.getTokenBalance(false);
  //       }
  //     });
  //   }
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
    ];

    let button;

    /* if (this.state.tokenBalance == 0) {
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
    } */

    return (
      <div className="wallet_board_overlay">
        <div className="wallet-board-content">
          <span className="red-dot">&#8226;</span>
          <span className="wallet-top-text">No Wallet Connected</span>
        </div>
        <Divider style={{ marginTop: '12px' }} />
        <div>
          <div style={{ padding: '0 20px' }}>
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
                    Ethereum token transactions while maintaining the security
                    of the Ethereum mainchain. To use Matic, deposit your
                    Ethereum tokens with a deposit transaction. The tokens will
                    then be instantly usable in all our games.
                  </p>
                  <p className="modal-font">
                    When you wish to withdraw from Matic and retrieve your
                    tokens on the mainchain, initiate a withdrawal transaction.
                    Withdrawals may take up to 1 week, but we are working to
                    speed this up.
                  </p>
                </Modal.Content>
              </Modal>
            </h3>
            <p className="wallet-top-text">
              Default games are free, deposit to play with crypto. Decentral
              Games is in beta, crypto gameplay is on Matic testnet using
              Ropsten MANA.
            </p>

            <ModalVerify dashboard={this.dashboard} />
            {/* <Button color='blue' className="metamask-button"
              href="https://google.com"
              >
                CONNECT METAMASK
            </Button> */}
          </div>
        </div>
      </div>
    );
  }
}

export default WalletOverlay;
