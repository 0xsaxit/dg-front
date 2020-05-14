import React from 'react';
import Biconomy from '@biconomy/mexa';
import sigUtil from 'eth-sig-util';
import ABIFAKEMana from './ABI/ABIFAKEMana';

// import Web3 from 'web3';
// let web3;

// if (typeof window.ethereum !== 'undefined') {
//   console.log('modern browser and privacy mode enabled');

//   web3 = new Web3(window.ethereum);
// }

class MetaTX extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.biconomyAPIKey = ''; // add your api  key from the dashboard
    this.parentChainId = ''; // chain id of the network tx is signed on
    this.maticProvider = 'https://testnetv3.matic.network';
    this.tokenAddress = Global.MATIC_TOKEN;
    this.amount = '1000000000000000000';
    this.recipient = Global.PARENT_CONTRACT_ADDRESS;
    this.web3 = new Web3(window.ethereum);

    // define EIP712 domain params
    this.domainType = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ];

    this.metaTransactionType = [
      { name: 'nonce', type: 'uint256' },
      { name: 'from', type: 'address' },
      { name: 'functionSignature', type: 'bytes' },
    ];

    this.domainData = {
      name: 'MetaToken',
      version: '1',
      chainId: parentChainId,
      verifyingContract: contractAddress,
    };
  }

  async componentDidMount() {
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // enable metamask & initialize Web3 providers (metamask inpage provider for web3 and biconomy provider for getWeb3)
    // window.ethereum.enable().catch((error) => {
    //   console.log(error);
    // });

    const biconomy = new Biconomy(
      new Web3.providers.HttpProvider(maticProvider),
      {
        apiKey: biconomyAPIKey,
        debug: true,
      }
    );
    const getWeb3 = new Web3(biconomy);

    biconomy
      .onEvent(biconomy.READY, () => {
        // Initialize your dapp here like getting user accounts etc
        console.log('Mexa is Ready');
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        // Handle error while initializing mexa
        console.error(error);
      });
  }

  // const functionSignature = biconomyMetaTransfer(
  //   tokenAddress,
  //   amount,
  //   recipient
  // );
  // executeMetaTransaction(functionSignature, userAddress);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // initialize contract object and define params and execute Biconomy meta-transaction
  // const contract = new getWeb3.eth.Contract(ABIFAKEMana, contractAddress);
  // const amount = '1000000000000000000';
  // const recipient = 'Add your recipient address here';

  biconomyMetaTransfer = async (tokenAddress, amount, recipient) => {
    const FAKEMANA_CONTRACT = new getWeb3.eth.Contract(
      ABIFAKEMana,
      tokenAddress
    );

    let functionSignature = FAKEMANA_CONTRACT.methods
      .transfer(recipient, amount)
      .encodeABI();

    // executeMetaTransaction(functionSignature, userAddress);

    return functionSignature;
  };

  executeMetaTransaction = async (
    functionSignature,
    userAddress
    // web3Default = window.web3
  ) => {
    // const accounts = await web3.eth.getAccounts();
    // let userAddress = accounts[0];
    let nonce = await FAKEMANA_CONTRACT.methods.getNonce(userAddress).call();

    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
    message.functionSignature = functionSignature;

    const dataToSign = JSON.stringify({
      types: {
        EIP712Domain: this.domainType,
        MetaTransaction: this.metaTransactionType,
      },
      domain: this.domainData,
      primaryType: 'MetaTransaction',
      message: message,
    });

    console.log(this.domainData);
    console.log(userAddress);

    this.web3.eth.currentProvider.send(
      {
        jsonrpc: '2.0',
        id: 999999999999,
        method: 'eth_signTypedData_v4',
        params: [userAddress, dataToSign],
      },
      function (error, response) {
        console.info(`User signature is ${response.result}`);

        let { r, s, v } = getSignatureParameters(response.result);

        // logging output
        console.log(userAddress);
        console.log(JSON.stringify(message));
        console.log(message);
        console.log(getSignatureParameters(response.result));

        const recovered = sigUtil.recoverTypedSignature_v4({
          data: JSON.parse(dataToSign),
          sig: response.result,
        });

        console.log(`Recovered ${recovered}`);

        let tx = FAKEMANA_CONTRACT.methods
          .executeMetaTransaction(userAddress, functionSignature, r, s, v)
          .send({
            from: userAddress,
          });
        console.log(tx);
      }
    );
  };

  render() {
    return <div>foo foo foo...</div>;
  }
}

export default MetaTX;
