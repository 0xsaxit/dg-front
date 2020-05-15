import React from 'react';
import Biconomy from '@biconomy/mexa';
import sigUtil from 'eth-sig-util';
import ABIFAKEMana from '../ABI/ABIFAKEMana';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Initialize constants
const Global = require('./../constant').default;

const Web3 = require('web3'); // ******************************************************
// const web3 = new Web3(window.ethereum); // ******************************************************

const biconomyAPIKey = 'W-egI3EhK.4a1c6273-7df8-4862-a62a-2d563f13b877'; // add your api  key from the dashboard
const parentChainId = Global.MATIC_NETWORK_ID; // chain id of the network tx is signed on
const maticProvider = Global.MATIC_URL;

const tokenAddress = Global.MATIC_TOKEN; // was contractAddress
// const contractAddress = '0x'; // Please add your deployed contract address here

const contract = {}; // *****************************************************
const web3 = {};
const biconomy = {};

const amount = '1000000000000000000';
const recipient = Global.PARENT_CONTRACT_ADDRESS;

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
  chainId: parentChainId,
  verifyingContract: tokenAddress,
};

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Enable metamask & initialize Web3 providers (metamask inpage provider for web3 and biconomy provider for getWeb3)
// must place in componentDidMount() ********************************************************
// window.ethereum.enable().catch((error) => {
//   console.log(error);
// });

// const web3 = new Web3(window.ethereum);
// const biconomy = new Biconomy(new Web3.providers.HttpProvider(maticProvider), {
//   apiKey: biconomyAPIKey,
//   debug: true,
// });
// const getWeb3 = new Web3(biconomy);
// contract = new getWeb3.eth.Contract(ABIFAKEMana, tokenAddress);

// biconomy
//   .onEvent(biconomy.READY, () => {
//     console.log('Mexa is Ready'); // Initialize your dapp here like getting user accounts etc
//   })
//   .onEvent(biconomy.ERROR, (error, message) => {
//     console.error(error); // Handle error while initializing mexa
//   });

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// Define functions to execute the transaction - use await? *******************************
// export const metaTransfer = async () => {
//   let functionSignature = contract.methods
//     .transfer(recipient, amount)
//     .encodeABI();

//   executeMetaTransaction(functionSignature);
// };

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// const executeMetaTransaction = async (functionSignature) => {
//   const accounts = await web3.eth.getAccounts();
//   let userAddress = accounts[0];
//   let nonce = await contract.methods.getNonce(userAddress).call();

//   let message = {};
//   message.nonce = parseInt(nonce);
//   message.from = userAddress;
//   message.functionSignature = functionSignature;

//   const dataToSign = JSON.stringify({
//     types: {
//       EIP712Domain: domainType,
//       MetaTransaction: metaTransactionType,
//     },
//     domain: domainData,
//     primaryType: 'MetaTransaction',
//     message: message,
//   });
//   console.log(domainData);
//   console.log(userAddress);
//   web3.eth.currentProvider.send(
//     {
//       jsonrpc: '2.0',
//       id: 999999999999,
//       method: 'eth_signTypedData_v4',
//       params: [userAddress, dataToSign],
//     },
//     function (error, response) {
//       console.info(`User signature is ${response.result}`);

//       let { r, s, v } = getSignatureParameters(response.result);

//       // logging output
//       console.log(userAddress);
//       console.log(JSON.stringify(message));
//       console.log(message);
//       console.log(getSignatureParameters(response.result));

//       const recovered = sigUtil.recoverTypedSignature_v4({
//         data: JSON.parse(dataToSign),
//         sig: response.result,
//       });
//       console.log(`Recovered ${recovered}`);
//       let tx = contract.methods
//         .executeMetaTransaction(userAddress, functionSignature, r, s, v)
//         .send({
//           from: userAddress,
//         });
//       console.log(tx);
//     }
//   );
// };

// const getSignatureParameters = (signature) => {
//   if (!web3.utils.isHexStrict(signature)) {
//     throw new Error(
//       'Given value "'.concat(signature, '" is not a valid hex string.')
//     );
//   }
//   var r = signature.slice(0, 66);
//   var s = '0x'.concat(signature.slice(66, 130));
//   var v = '0x'.concat(signature.slice(130, 132));
//   v = web3.utils.hexToNumber(v);
//   if (![27, 28].includes(v)) v += 27;
//   return {
//     r: r,
//     s: s,
//     v: v,
//   };
// };

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
class MetaTX extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    window.ethereum.enable().catch((error) => {
      console.log(error);
    });

    web3 = new Web3(window.ethereum);
    biconomy = new Biconomy(new Web3.providers.HttpProvider(maticProvider), {
      apiKey: biconomyAPIKey,
      debug: true,
    });
    const getWeb3 = new Web3(biconomy);
    contract = new getWeb3.eth.Contract(ABIFAKEMana, tokenAddress);

    biconomy
      .onEvent(biconomy.READY, () => {
        console.log('Mexa is Ready'); // Initialize your dapp here like getting user accounts etc
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.error(error); // Handle error while initializing mexa
      });
  }

  metaTransfer = async () => {
    let functionSignature = contract.methods
      .transfer(recipient, amount)
      .encodeABI();

    executeMetaTransaction(functionSignature);
  };

  executeMetaTransaction = async (functionSignature) => {
    const accounts = await web3.eth.getAccounts();
    let userAddress = accounts[0];
    let nonce = await contract.methods.getNonce(userAddress).call();

    let message = {};
    message.nonce = parseInt(nonce);
    message.from = userAddress;
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
    console.log(domainData);
    console.log(userAddress);
    web3.eth.currentProvider.send(
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
        let tx = contract.methods
          .executeMetaTransaction(userAddress, functionSignature, r, s, v)
          .send({
            from: userAddress,
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
    return <div>foo</div>;
  }
}

export default MetaTX;
