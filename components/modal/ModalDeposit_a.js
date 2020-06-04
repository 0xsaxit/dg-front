import React from 'react';
import Biconomy from '@biconomy/mexa';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ModalSidebar from './ModalSidebar';
import ContentDeposit from './contentDeposit';
import SwitchRPC from './switchRPC';
import ABIFAKEMana from '../ABI/ABIFAKEMana.json';
import Global from '../constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
let tokenAddressRopsten = '';
let tokenAddressMatic = '';
let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  tokenAddressRopsten = addresses.ROPSTEN_TOKEN_ADDRESS;
  tokenAddressMatic = addresses.MATIC_TOKEN_ADDRESS;
  spenderAddress = addresses.PARENT_CONTRACT_ADDRESS;

  domainData.verifyingContract = tokenAddressMatic;
}
getAddresses();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// initialize Biconomy API constants and define parameters
const Web3 = require('web3');
const sigUtil = require('eth-sig-util');
const biconomyAPIKey = 'vG_JQDKVI.af6fc0a6-0caf-4756-a564-f9468fbf5732';
let authorizeAmount = Global.MAX_AMOUNT;
let parentChainId = Global.PARENT_NETWORK_ID;
// let maticProvider = Global.MATIC_URL;

let web3 = {};
let getWeb3 = {};
let tokenContract = {};

// define EIP712 domain params
const domainType = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

const metaTransactionType = [
  { name: 'nonce', type: 'uint256' },
  { name: 'from', type: 'address' },
  { name: 'functionSignature', type: 'bytes' },
];

let domainData = {
  name: 'Decentraland',
  version: '1',
  chainId: parentChainId,
  verifyingContract: '',
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class Deposit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCustomAmount: 0,
      amount: Global.DEFAULT_AMOUNT,
      userStepValue: 0,
      networkID: 0,
      isValidDeposit: 0,
      isValidAuthorize: 0,
      tokenBalanceL1: 0,
      tokenBalanceL2: 0,
      modalOpen: false,
    };

    this.USER_ADDRESS = '';
    this.isBrowserMetaMask = 0;
    this.maticWeb3 = {};
  }

  async componentDidMount() {
    this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    if (window.web3) this.isBrowserMetaMask = 1;

    // set maticWeb3 provider, get token balances, and set userStepValue
    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );
    await this.getTokenBalance();
    const userStatus = await this.checkUserVerify();

    console.log('userStepValue status: ' + userStatus);

    // initialize Web3 providers (MetaMask provider for web3 and Biconomy provider for getWeb3)
    web3 = new Web3(window.ethereum);
    const biconomy = new Biconomy(
      new Web3.providers.HttpProvider(Global.MATIC_URL),
      {
        apiKey: biconomyAPIKey,
        debug: true,
      }
    );
    getWeb3 = new Web3(biconomy);
    tokenContract = new getWeb3.eth.Contract(ABIFAKEMana, tokenAddressMatic);

    biconomy
      .onEvent(biconomy.READY, () => {
        console.log('Mexa is Ready');
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.error(error);
      });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal
  getTrigger = () => {
    return (
      <Button content="Deposit" id="depositButton2" onClick={this.handleOpen} />
    );
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  checkUserVerify = async () => {
    try {
      const response = await this.getUserStatus();
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          if (stepValue == 5) {
            // indicate deposit success and set userStepValue to result *******************
            this.setState({
              // isValidDeposit: 2,

              userStepValue: stepValue,
            });
          } else if (stepValue == 6) {
            // indicate authorization success and set userStepValue to result
            this.setState({
              // isValidAuthorize: 2,

              userStepValue: stepValue,
            });
          } else {
            // indicate deposit success and set userStepValue to result

            // this.setState({ isValidDeposit: 2, userStepValue: stepValue });

            this.setState({ userStepValue: stepValue });
          }
        } else {
          // indicate deposit success and set userStepValue to result

          // this.setState({ isValidDeposit: 2, userStepValue: stepValue });

          this.setState({ userStepValue: stepValue });
        }

        return stepValue;
      }

      return false;
    } catch (error) {
      console.log('step value error: ' + error);
    }

    return false;
  };

  getUserStatus = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.USER_ADDRESS,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // drop-down list and input amount functions
  onChangeAmount = (e, d) => {
    if (d.value == -1) {
      this.setState({ amount: 0, isCustomAmount: 1 });
      return;
    }

    this.setState({ amount: d.value });
  };

  onChangeCustomAmount = async (e) => {
    let value = parseInt(e.target.value);

    if (String(value) != 'NaN') {
      this.setState({ amount: parseInt(e.target.value) });
    } else {
      this.setState({ amount: 0 });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // check the amount of tokens that user has allowed Matic Root contract to spend
  // authorize transfers to Matic Network, then deposit MANA to Matic Network
  depositToMatic = async () => {
    try {
      this.props.showSpinner();

      // check the amount of tokens that user has allowed Matic contract to spend
      let allowedAmount = await Global.getAllowedToken(
        tokenAddressRopsten,
        this.USER_ADDRESS
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('allowed amount: ' + allowedAmount);
      const amountWei = web3.utils.toWei(this.state.amount + '');

      if (allowedAmount == 0) {
        await Global.approveToken(
          tokenAddressRopsten,
          Global.MAX_AMOUNT,
          this.USER_ADDRESS
        );
      } else if (allowedAmount < this.state.amount) {
        await Global.approveToken(tokenAddressRopsten, 0, this.USER_ADDRESS);
        await Global.approveToken(
          tokenAddressRopsten,
          Global.MAX_AMOUNT,
          this.USER_ADDRESS
        );
      }

      // now deposit tokens from Mainnet to Matic Network
      const txHash = await Global.depositTokenToMatic(
        tokenAddressRopsten,
        amountWei,
        this.USER_ADDRESS
      );
      if (txHash != false) {
        let ret = await this.updateHistory(
          this.state.amount,
          'Deposit',
          'In Progress',
          txHash
        );
        if (!ret) this.networkErrror(); // network error

        ret = await Global.getConfirmedTx(txHash); // return confirmation hash
        console.log('confirmation: ' + ret);

        if (ret.status == '0x0') {
          ret = await this.updateHistory(
            this.state.amount,
            'Deposit',
            'Failed',
            txHash
          );
        } else {
          ret = await this.updateHistory(
            this.state.amount,
            'Deposit',
            'Confirmed',
            txHash
          );

          console.log('updated database');
        }

        if (!ret) this.networkError(); // network error

        if (this.state.userStepValue < 6) {
          console.log('updating step value to 5');

          await this.postUserVerify(5); // update verify to 'authorize'
          this.setState({ userStepValue: 5 }); // advance to auth step
        } else if (this.state.userStepValue == 6) {
          setTimeout(this.props.update, 5000); // set user token balance from MetaMask
        }

        this.setState({ isValidDeposit: 2 }); // valid deposit
        console.log('tx hash: ' + txHash);
      }

      this.props.hideSpinner();
    } catch (err) {
      console.log(err);
      this.setState({ isValidDeposit: 1 }); // invalid deposit
    }
  };

  networkError = () => {
    console.log('network error');

    this.setState({ isValidDeposit: 1 }); // invalid deposit
    this.props.hideSpinner();

    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
  metaTransfer = async () => {
    console.log('Execute Biconomy meta-transaction');

    console.log('Matic RPC: ' + Global.MATIC_URL);
    console.log('user address: ' + this.USER_ADDRESS);
    console.log('chain ID: ' + domainData.chainId);
    console.log('token address Matic: ' + tokenAddressMatic);
    console.log('spender (treasury) address: ' + spenderAddress);
    console.log('authorize amount: ' + authorizeAmount);
    console.log('verify contract (FAKEMana): ' + domainData.verifyingContract);

    // this.props.showSpinner();

    let functionSignature = tokenContract.methods
      .approve(spenderAddress, authorizeAmount)
      .encodeABI();
    this.executeMetaTransaction(functionSignature);
  };

  executeMetaTransaction = async (functionSignature) => {
    console.log('functional signature: ' + functionSignature);

    try {
      this.props.showSpinner();

      let nonce = await tokenContract.methods
        .getNonce(this.USER_ADDRESS)
        .call();

      let message = {};
      message.nonce = parseInt(nonce);
      message.from = this.USER_ADDRESS;
      message.functionSignature = functionSignature;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType,
        },
        domain: domainData,
        primaryType: 'MetaTransaction',
        message: message,
      });

      console.log('domain data: ');
      console.log(domainData);

      web3.eth.currentProvider.send(
        {
          jsonrpc: '2.0',
          id: 999999999999,
          method: 'eth_signTypedData_v4',
          params: [this.USER_ADDRESS, dataToSign],
        },

        async (error, response) => {
          let { r, s, v } = this.getSignatureParameters(response.result);

          console.log('user signature: ' + response.result);
          console.log('recovered address: ' + recovered);
          console.log('r: ' + r);
          console.log('s: ' + s);
          console.log('v: ' + v);

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result,
          });

          console.log(`Recovered ${recovered}`);

          await tokenContract.methods
            .executeMetaTransaction(
              this.USER_ADDRESS,
              functionSignature,
              r,
              s,
              v
            )
            .send({
              from: this.USER_ADDRESS,
            });

          await this.postUserVerify(6); // update verify to 'deposit'
          this.setState({ userStepValue: 5.5 }); // advance to confirmations step

          await this.postUserAuthState(this.props.authvalue); // update authorize to 4
          this.setState({ isValidAuthorize: 2 }); // valid authorize

          setTimeout(this.props.update, 5000); // set user token balance from MetaMask
        }
      );

      this.props.hideSpinner();
    } catch (err) {
      console.log(err);
    }
  };

  getSignatureParameters = (signature) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }

    const r = signature.slice(0, 66);
    const s = '0x'.concat(signature.slice(66, 130));
    let v = '0x'.concat(signature.slice(130, 132));
    v = web3.utils.hexToNumber(v);

    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v,
    };
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and deposit status in database
  postUserVerify = (step) => {
    return fetch(`${Global.BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        verifyStep: step,
      }),
    });
  };

  postUserAuthState = (value) => {
    return fetch(`${Global.BASE_URL}/order/updateUserAuthState`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        authorized: value,
      }),
    });
  };

  postHistory = async (amount, type, state, txHash) => {
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
      }),
    });
  };

  updateHistory = async (amount, type, state, txHash = '') => {
    try {
      const response = await this.postHistory(amount, type, state, txHash);
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on main net and Matic networks
  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({
        tokenBalanceL1: (amount1 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
      this.setState({
        tokenBalanceL2: (amount2 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    } catch (err) {
      console.log(err);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  verifyNetwork = async () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network) }); // set network ID
    });
  };

  switchRPC = () => {
    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <SwitchRPC />
      </Modal>
    );
  };

  nextStep = () => {
    let value = this.state.userStepValue + 1;
    this.setState({ userStepValue: value });
  };

  render() {
    this.verifyNetwork(); // verify user is on correct network
    if (this.state.networkID !== 3) return this.switchRPC();

    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              {this.state.userStepValue == 4 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // authorize transfers to Matic Network, then deposit MANA to Matic Network
                <Grid.Column>
                  <ModalSidebar checked={1} />
                  <ContentDeposit
                    content={'approve'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    isCustomAmount={this.state.isCustomAmount}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
                <Grid.Column>
                  <ModalSidebar checked={2} />
                  <ContentDeposit
                    content={'authorize'} // content type
                    isValidAuthorize={this.state.isValidAuthorize}
                    authorizeMana={this.metaTransfer}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 5.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // get number of confirmations from Matic Network and display to user
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <ContentDeposit
                    content={'confirmations'} // content type
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 6 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // user has finished onboard process and wishes to deposit more MANA to Matic Network
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <ContentDeposit
                    content={'deposit'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    isCustomAmount={this.state.isCustomAmount}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : null}
            </Grid>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Deposit;
