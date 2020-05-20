import React from 'react';
import Biconomy from '@biconomy/mexa';
import ABI from '../ABI/NADummyToken.json';
// import ABI from '../ABI/ABIFAKEMana.json';
import Global from '../constant';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// initialize Biconomy API constants and define parameters
const Web3 = require('web3');
const sigUtil = require('eth-sig-util');
const biconomyAPIKey = 'vG_JQDKVI.af6fc0a6-0caf-4756-a564-f9468fbf5732';
const authorizeAmount = Global.MAX_AMOUNT;
const maticProvider = Global.MATIC_URL;

let tokenAddress = '';
let spenderAddress = '';
let web3 = {};
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
  name: 'MetaToken',
  version: '1',
  chainId: '3',
  verifyingContract: '',
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class Deposit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.USER_ADDRESS = '';
  }

  async componentDidMount() {
    this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;

    // set addresses with data returned by server REST API
    tokenAddress = '0xe835767Ce965fc8A7D128F2fAc3CdD381587BBe4'; // '0x2A3df21E612d30Ac0CD63C3F80E1eB583A4744cC';
    domainData.verifyingContract = tokenAddress;
    spenderAddress = Global.MASTER_CONTRACT_ADDRESS();

    // initialize Web3 providers (MetaMask provider for web3 and Biconomy provider for getWeb3)
    web3 = new Web3(window.ethereum);

    const biconomy = new Biconomy(
      new Web3.providers.HttpProvider(maticProvider),
      {
        apiKey: biconomyAPIKey,
        debug: true,
      }
    );
    const getWeb3 = new Web3(biconomy);
    tokenContract = new getWeb3.eth.Contract(ABI, tokenAddress);

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
  // call to Biconomy API - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
  metaTransfer = async () => {
    console.log('execute Biconomy meta-transaction');
    console.log('Matic RPC: ' + maticProvider);
    console.log('user address: ' + this.USER_ADDRESS);
    console.log('chain ID: ' + domainData.chainId);
    console.log('spender (treasury) address: ' + spenderAddress);
    console.log('authorize amount: ' + authorizeAmount);
    console.log('verify contract (FAKEMana): ' + domainData.verifyingContract);

    try {
      this.props.showSpinner();

      console.log(
        'Matic Network balance: ' +
          (await tokenContract.methods.balanceOf(this.USER_ADDRESS).call())
      );

      // encode function signature from our token contract (send treasury contract address and amount)
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, authorizeAmount)
        .encodeABI();

      this.executeMetaTransaction(functionSignature);

      await this.postUserVerify(6); // update verify to 'deposit'
      await this.postUserAuthState(this.props.authvalue); // update authorize to 4

      this.setState({ isValidAuthorize: 2 }); // valid authorize
      this.props.hideSpinner();

      setTimeout(this.props.update, 5000); // set user token balance from MetaMask
    } catch (err) {
      this.setState({ isValidAuthorize: 1 }); // invalid authorize

      this.props.hideSpinner();
    }
  };

  executeMetaTransaction = async (functionSignature) => {
    console.log('functional signature: ' + functionSignature);

    let nonce = await tokenContract.methods.getNonce(this.USER_ADDRESS).call();
    console.log('nonce: ' + nonce);

    let message = {};
    message.nonce = parseInt(nonce);
    message.from = this.USER_ADDRESS;
    message.functionSignature = functionSignature;

    // create a dataToSign object containing the encoded function (functionSignature)
    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: domainType,
        MetaTransaction: metaTransactionType,
      },
      domain: domainData,
      primaryType: 'MetaTransaction',
      message: message,
    });

    web3.eth.currentProvider.send(
      {
        jsonrpc: '2.0',
        id: 999999999999,
        method: 'eth_signTypedData_v4',
        params: [this.USER_ADDRESS, dataToSign],
      },

      (error, response) => {
        let { r, s, v } = this.getSignatureParameters(response.result);
        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(dataToSign),
          sig: response.result,
        });

        console.log('user signature is: ' + response.result);
        console.log('recovered address: ' + recovered);
        console.log('r: ' + r);
        console.log('s: ' + s);
        console.log('v: ' + v);

        // execute the meta-transaction using the function signature
        let tx = tokenContract.methods
          .executeMetaTransaction(this.USER_ADDRESS, functionSignature, r, s, v)
          .send({
            from: this.USER_ADDRESS,
          });

        console.log(tx);
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

  render() {
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
                />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Deposit;
