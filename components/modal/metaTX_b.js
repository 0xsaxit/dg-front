import React from 'react';
import Biconomy from '@biconomy/mexa';

// Initialize constants
const abi = require('./MetaToken.json').abi;
const Web3 = require('web3');
const sigUtil = require('eth-sig-util');
const contractAddress = '0x'; // Please add your deployed contract address here
const biconomyAPIKey = ''; // add your api  key from the dashboard
const parentChainId = ''; // chain id of the network tx is signed on
const maticProvider = 'https://testnetv3.matic.network';

// Define EIP712 domain params
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
  verifyingContract: contractAddress,
};

// Enable metamask & initialize Web3 providers (metamask inpage provider for web3 and biconomy provider for getWeb3)
window.ethereum.enable().catch((error) => {
  console.log(error);
});

const web3 = new Web3(window.ethereum);
const biconomy = new Biconomy(new Web3.providers.HttpProvider(maticProvider), {
  apiKey: biconomyAPIKey,
  debug: true,
});
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

// const contract = new getWeb3.eth.Contract(abi, contractAddress);
const amount = '1000000000000000000';
const recipient = 'Add your recipient address here';
const contract = new getWeb3.eth.Contract(abi, contractAddress);
const amount = '1000000000000000000';
const recipient = 'Add your recipient address here';

// Define functions to execute the transaction
const metaTransfer = async () => {
  let functionSignature = contract.methods
    .transfer(recipient, amount)
    .encodeABI();
  executeMetaTransaction(functionSignature);
};

const executeMetaTransaction = async (functionSignature) => {
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

const getSignatureParameters = (signature) => {
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

// Define App() function
function App() {
  return (
    <div>
      <h3> MetaToken </h3>
      <React.Fragment>
        {''}
        <button onClick={() => metaTransfer()} size="small">
          Transfer
        </button>
      </React.Fragment>
    </div>
  );
}

export default App;
