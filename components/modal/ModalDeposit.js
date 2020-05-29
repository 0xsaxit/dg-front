import React from 'react';
// import { MaticPOSClient } from '@maticnetwork/maticjs';
import Biconomy from '@biconomy/mexa';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ModalSidebar from './ModalSidebar';
import DepositContent from './DepositContent';

// import ABIFAKEMana from '../ABI/NADummyToken.json';
import ABIFAKEMana from '../ABI/ABIFAKEMana.json';

import Global from '../constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////

// let maticPOSClient;
let tokenAddressRopsten = '';
let tokenAddressMatic = '';
let spenderAddress = '';
// let ROPSTEN_TOKEN_ADDRESS = '';
// let tokenContract = {};

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  // maticPOSClient = new MaticPOSClient({
  //   maticProvider: Global.MATIC_URL,
  //   parentProvider: '',
  //   rootChain: addresses.ROOTCHAIN_ADDRESS,
  //   posRootChainManager: addresses.ROOTCHAINMANAGER_ADDRESS,
  // });

  tokenAddressRopsten = addresses.ROPSTEN_TOKEN_ADDRESS;
  tokenAddressMatic = addresses.MATIC_TOKEN_ADDRESS;

  // tokenAddress = '0xe835767Ce965fc8A7D128F2fAc3CdD381587BBe4';

  spenderAddress = addresses.PARENT_CONTRACT_ADDRESS;

  // ROPSTEN_TOKEN_ADDRESS = addresses.ROPSTEN_TOKEN_ADDRESS;

  // tokenContract = new getWeb3.eth.Contract(ABIFAKEMana, tokenAddressMatic);
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
let maticProvider = Global.MATIC_URL;

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
      amount: 1000,
      userStepValue: 0,
      networkID: 0,
      isValidDeposit: 0,
      isValidAuthorize: 0,
      tokenBalanceL1: 0,
      tokenBalanceL2: 0,
      modalOpen: false,
      refresh: '',
    };

    this.USER_ADDRESS = '';
    this.isBrowserMetamsk = 0;
    this.maticWeb3 = {};
  }

  async componentDidMount() {
    // get web3 values, set token balances, and set userStepValue
    this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    this.isBrowserMetamsk = 1;
    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(maticProvider)
    );
    await this.getTokenBalance();
    const verifyStatus = await this.checkUserVerify();

    console.log('userStepValue status: ' + verifyStatus);

    // initialize Web3 providers (MetaMask provider for web3 and Biconomy provider for getWeb3)

    // maticPOSClient.parentProvider = window.ethereum;

    web3 = new Web3(window.ethereum);

    const biconomy = new Biconomy(
      new Web3.providers.HttpProvider(maticProvider),
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
        // if result == false set userStepValue = 1 and exit
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
          this.props.hideSpinner();
        }
        let stepValue = parseInt(json.result);

        if (stepValue > 3) {
          if (stepValue == 5) {
            // indicate deposit success and set userStepValue to result
            this.setState({
              isValidDeposit: 2,
              userStepValue: stepValue,
            });
          } else if (stepValue == 6) {
            // indicate authorization success and set userStepValue to result
            this.setState({
              isValidAuthorize: 2,
              userStepValue: stepValue,
            });
          } else {
            // indicate deposit success and set userStepValue to result
            this.setState({ isValidDeposit: 2, userStepValue: stepValue });
          }
        } else {
          // indicate deposit success and set userStepValue to result
          this.setState({ isValidDeposit: 2, userStepValue: stepValue });
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

      const txHash = await Global.depositTokenToMatic(
        tokenAddressRopsten,
        amountWei,
        this.USER_ADDRESS
      );

      console.log('tx hash: ' + txHash);

      if (txHash != false) {
        let ret = await this.updateHistory(
          this.state.amount,
          'Deposit',
          'In Progress',
          txHash
        );

        if (!ret) this.networkErrror(); // network error

        ret = await Global.getConfirmedTx(txHash); // return confirmation hash

        console.log('confirmation: ');
        console.log(ret);

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
        } else if (this.state.userStepValue == 6) {
          console.log('step value is 6');

          this.handleClose();
          setTimeout(this.props.update, 5000); // set user token balance from MetaMask
        }

        this.setState({ isValidDeposit: 2, refresh: 'Funds deposited' }); // valid deposit
      }
    } catch (err) {
      console.log(err);
      this.setState({ isValidDeposit: 1 }); // invalid deposit
    }

    this.props.hideSpinner();
  };

  networkError = () => {
    console.log('network error');

    this.setState({ isValidDeposit: 1 }); // invalid deposit
    this.props.hideSpinner();

    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // call to Biconomy API - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf

  // getContractDetails = async (pAddress) => {
  //   let abi;

  //   // if (pAddress === CHILD_ETH_TOKEN_ADDRESS) abi = CHILD_ETH_TOKEN_ABI;
  //   // else abi = CHILD_DUMMY_TOKEN_ABI;
  //   // const contract = new getWeb3.eth.Contract(abi, pAddress);

  //   const contract = new getWeb3.eth.Contract(ABIFAKEMana, pAddress);

  //   const tokenName = await contract.methods.name().call();
  //   console.log(tokenName);

  //   let domainData = {
  //     name: tokenName,
  //     version: '1',
  //     chainId: parentChainId,
  //     verifyingContract: pAddress,
  //   };

  //   return { contract, domainData };
  // };

  // metaTransfer = async () => {
  //   console.log('execute Biconomy meta-transaction');
  //   console.log('Matic RPC: ' + maticProvider);
  //   console.log('user address: ' + this.USER_ADDRESS);
  //   console.log('chain ID: ' + domainData.chainId);
  //   console.log('spender (treasury) address: ' + spenderAddress);
  //   console.log('authorize amount: ' + authorizeAmount);
  //   console.log('verify contract (FAKEMana): ' + domainData.verifyingContract);

  //   try {
  //     this.props.showSpinner();

  //     // console.log(
  //     //   'Matic Network balance: ' +
  //     //     (await tokenContract.methods.balanceOf(this.USER_ADDRESS).call())
  //     // );

  //     // encode function signature from our token contract (send treasury contract address and amount)
  //     let functionSignature = tokenContract.methods
  //       .approve(spenderAddress, authorizeAmount)
  //       .encodeABI();

  //     this.executeMetaTransaction(functionSignature);

  //     await this.postUserVerify(6); // update verify to 'deposit'
  //     await this.postUserAuthState(this.props.authvalue); // update authorize to 4

  //     this.setState({ isValidAuthorize: 2 }); // valid authorize
  //     this.props.hideSpinner();

  //     setTimeout(this.props.update, 5000); // set user token balance from MetaMask
  //   } catch (err) {
  //     this.setState({ isValidAuthorize: 1 }); // invalid authorize

  //     this.props.hideSpinner();
  //   }
  // };

  // metaTransfer = async (pAmount, spender, tokenAddress) => {
  metaTransfer = async () => {
    console.log('Execute Biconomy meta-transaction');
    console.log('Matic RPC: ' + maticProvider);
    console.log('user address: ' + this.USER_ADDRESS);
    console.log('chain ID: ' + domainData.chainId);
    console.log('token address Matic: ' + tokenAddressMatic);
    console.log('spender (treasury) address: ' + spenderAddress);
    console.log('authorize amount: ' + authorizeAmount);
    console.log('verify contract (FAKEMana): ' + domainData.verifyingContract);

    // const detail = await this.getContractDetails(tokenAddressMatic);

    // const amount = web3.utils.toWei(pAmount + '');

    // let userAddress = await getDefaultAccount(); // ***

    let functionSignature = tokenContract.methods
      .approve(spenderAddress, authorizeAmount)
      .encodeABI();
    console.log(functionSignature);

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    this.executeMetaTransaction(functionSignature);
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////

    await this.postUserVerify(6); // update verify to 'deposit'
    await this.postUserAuthState(this.props.authvalue); // update authorize to 4

    this.setState({ isValidAuthorize: 2, refresh: 'Matic Network authorized' }); // valid authorize
    this.props.hideSpinner();

    setTimeout(this.props.update, 5000); // set user token balance from MetaMask
  };

  executeMetaTransaction = async (functionSignature) => {
    // let userAddress = await getDefaultAccount();

    let nonce = await tokenContract.methods.getNonce(this.USER_ADDRESS).call();

    let message = {};
    message.nonce = parseInt(nonce);
    message.from = this.USER_ADDRESS;
    message.functionSignature = functionSignature;
    message.network = 'Interact with Matic Network';

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
    // console.log(this.USER_ADDRESS);

    web3.eth.currentProvider.send(
      {
        jsonrpc: '2.0',
        id: 999999999999,
        method: 'eth_signTypedData_v4',
        params: [this.USER_ADDRESS, dataToSign],
      },

      async (error, response) => {
        console.log('user signature: ');
        console.log(response.result);

        let { r, s, v } = this.getSignatureParameters(response.result);

        // logging output
        // console.log(this.USER_ADDRESS);
        console.log('message: ');
        console.log(JSON.stringify(message));
        console.log(message);
        console.log('get signature parameters: ');
        console.log(this.getSignatureParameters(response.result));

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(dataToSign),
          sig: response.result,
        });

        console.log(`Recovered ${recovered}`);

        let tx = await tokenContract.methods
          .executeMetaTransaction(this.USER_ADDRESS, functionSignature, r, s, v)
          .send({
            from: this.USER_ADDRESS,
          });

        console.log(
          tx,
          await tokenContract.methods.balanceOf(this.USER_ADDRESS).call()
        );
      }
    );
  };

  getSignatureParameters = (signature) => {
    if (!web3.utils.isHexStrict(signature)) {
      throw new Error(
        'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = '0x'.concat(signature.slice(66, 130));
    var v = '0x'.concat(signature.slice(130, 132));
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
  // prerender check modal content
  prerenderCheck = (text, image) => {
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
              <Grid.Column>
                <ModalSidebar checked={0} />
                <DepositContent
                  content={'changeRPC'}
                  text={text}
                  image={image}
                />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
    );
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network) }); // set network ID
    });
  };

  render() {
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // pre-render checks: verify user is on correct network, step value == 2, and using MetaMask
    this.verifyNetwork();

    if (this.state.networkID !== 3) {
      const content = this.prerenderCheck(
        "In MetaMask, open the Network dropdown menu and select 'Ropsten'",
        1
      );
      return content;
    }

    if (this.state.userStepValue === 0) {
      const content = this.prerenderCheck('', 0);
      return content;
    }

    if (this.state.userStepValue === 1) {
      const content = this.prerenderCheck(
        'Please finish verification to Deposit',
        0
      );
      return content;
    }

    if (!this.isBrowserMetamsk) {
      const content = this.prerenderCheck(
        'Please use Chrome Browser with Metamask enabled to proceed',
        0
      );
      return content;
    }

    if (this.state.userStepValue == 4) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // authorize transfers to Matic Network, then deposit MANA to Matic Network
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
                <Grid.Column>
                  <ModalSidebar checked={1} />
                  <DepositContent
                    content={'approve'} // content type
                    isCustomAmount={this.state.isCustomAmount}
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    refresh={this.state.refresh}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    } else if (this.state.userStepValue == 5) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
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
                <Grid.Column>
                  <ModalSidebar checked={2} />
                  <DepositContent
                    content={'authorize'} // content type
                    isValidAuthorize={this.state.isValidAuthorize}
                    authorizeMana={this.metaTransfer}
                    refresh={this.state.refresh}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    } else if (this.state.userStepValue == 6) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // user has finished initial authorization/deposit process and wishes to deposit more MANA to Matic Network
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
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <DepositContent
                    content={'deposit'} // content type
                    isCustomAmount={this.state.isCustomAmount}
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    refresh={this.state.refresh}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }
  }
}

export default Deposit;
