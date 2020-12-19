import Global from '../components/Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API
const sigUtil = require('eth-sig-util');
let childTokenAddressMANA = '';
let childTokenAddressDAI = '';
let treasuryAddress = '';
let dgPointerAddress = '';
let arrayDomainType = [];
let arrayDomainData = [];
let metaTransactionType = [];

(async function () {
  if (window.ethereum) {
    // console.log('foo');

    const userAddress = window.web3.currentProvider.selectedAddress;

    if (userAddress) {
      // console.log('foo foo');

      const addresses = await Global.ADDRESSES;

      childTokenAddressMANA = addresses.CHILD_TOKEN_ADDRESS_MANA;
      childTokenAddressDAI = addresses.CHILD_TOKEN_ADDRESS_DAI;
      treasuryAddress = addresses.TREASURY_CONTRACT_ADDRESS;
      dgPointerAddress = addresses.DG_POINTER_CONTRACT_ADDRESS;

      const domainTypeToken = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'bytes32' },
      ];

      const domeinTypeTreasury = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ];

      arrayDomainType.push(domainTypeToken);
      arrayDomainType.push(domeinTypeTreasury);
      arrayDomainType.push(domeinTypeTreasury);
      arrayDomainType.push(domainTypeToken);

      metaTransactionType.push(
        { name: 'nonce', type: 'uint256' },
        { name: 'from', type: 'address' },
        { name: 'functionSignature', type: 'bytes' }
      );

      const domainDataTokenMANA = {
        name: '(PoS) Decentraland MANA',
        version: '1',
        verifyingContract: childTokenAddressMANA,
        salt:
          '0x' +
          Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
      };

      const domainDataTreasury = {
        name: 'Treasury',
        version: 'v4.0',
        chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
        verifyingContract: treasuryAddress,
      };

      const domainDataDGPointer = {
        name: 'NEW',
        version: '5.0',
        chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
        verifyingContract: dgPointerAddress,
      };

      const domainDataTokenDAI = {
        name: '(PoS) Dai Stablecoin',
        version: '1',
        verifyingContract: childTokenAddressDAI,
        salt:
          '0x' +
          Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
      };

      arrayDomainData.push(domainDataTokenMANA);
      arrayDomainData.push(domainDataTreasury);
      arrayDomainData.push(domainDataDGPointer);
      arrayDomainData.push(domainDataTokenDAI);
    }
  }
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// execute functions on Matic Network from Mainnet using Biconomy PoS meta-transactions API
function executeMetaTransaction(
  i,
  functionSignature,
  contractInstance,
  userAddress,
  web3Default
) {
  return new Promise(async (resolve, reject) => {
    console.log('Execute Biconomy PoS meta-transaction');
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Verify contract: ' + arrayDomainData[i].verifyingContract);

    try {
      let nonce = await contractInstance.methods.getNonce(userAddress).call();

      let message = {};
      message.nonce = parseInt(nonce);
      message.from = userAddress;
      message.functionSignature = functionSignature;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: arrayDomainType[i],
          MetaTransaction: metaTransactionType,
        },
        domain: arrayDomainData[i],
        primaryType: 'MetaTransaction',
        message: message,
      });

      console.log('Domain data: ');
      console.log(arrayDomainData[i]);

      await web3Default.eth.currentProvider.send(
        {
          jsonrpc: '2.0',
          id: 999999999999,
          method: 'eth_signTypedData_v4',
          params: [userAddress, dataToSign],
        },

        async (error, response) => {
          let { r, s, v } = getSignatureParameters(
            response.result,
            web3Default
          );

          const recovered = sigUtil.recoverTypedSignature_v4({
            data: JSON.parse(dataToSign),
            sig: response.result,
          });

          console.log('User signature: ' + response.result);
          console.log('Recovered address: ' + recovered);
          console.log('r: ' + r);
          console.log('s: ' + s);
          console.log('v: ' + v);

          try {
            const ret = await contractInstance.methods
              .executeMetaTransaction(userAddress, functionSignature, r, s, v)
              .send({
                from: userAddress,
              });

            console.log('Execute Meta-Transactions done');
            resolve(ret.transactionHash);
          } catch (error) {
            console.log('Execute Meta-Transactions failed: ', error);
            reject(false);
          }
        }
      );
    } catch (error) {
      console.log('Execute Meta-Transactions failed: ', error);
      reject(false);
    }
  });
}

function getSignatureParameters(signature, web3Default) {
  if (!web3Default.utils.isHexStrict(signature)) {
    throw new Error(
      'Given value "'.concat(signature, '" is not a valid hex string.')
    );
  }

  const r = signature.slice(0, 66);
  const s = '0x'.concat(signature.slice(66, 130));
  let v = '0x'.concat(signature.slice(130, 132));
  v = web3Default.utils.hexToNumber(v);

  if (![27, 28].includes(v)) v += 27;
  return {
    r: r,
    s: s,
    v: v,
  };
}

export default { executeMetaTransaction };
