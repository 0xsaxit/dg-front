import Global from '../components/Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API
const sigUtil = require('eth-sig-util');
let childTokenAddress = '';
let contractAddress = '';
let domainArray = [];
let domainType = [];
let metaTransactionType = [];

(async function () {
  const addresses = await Global.API_ADDRESSES;

  childTokenAddress = addresses.CHILD_TOKEN_ADDRESS_MANA;
  contractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

  domainType.push(
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
  );

  metaTransactionType.push(
    { name: 'nonce', type: 'uint256' },
    { name: 'from', type: 'address' },
    { name: 'functionSignature', type: 'bytes' }
  );

  const domainDataToken = {
    name: 'Dummy ERC20',
    version: '1',
    chainId: Global.PARENT_NETWORK_ID,
    verifyingContract: childTokenAddress,
  };

  const domainDataTreasury = {
    name: 'Treasury',
    version: 'v3.0',
    chainId: Global.PARENT_NETWORK_ID,
    verifyingContract: contractAddress,
  };

  domainArray.push(domainDataToken);
  domainArray.push(domainDataTreasury);
})();

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// execute functions on Matic Network from Mainnet using Biconomy PoS meta-transactions API
function executeMetaTransaction(
  i,
  functionSignature,
  sessionDuration,
  tokenContract,
  userAddress,
  web3Default
) {
  return new Promise(async (resolve, reject) => {
    console.log('Execute Biconomy PoS meta-transaction');
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Chain ID: ' + domainArray[i].chainId);
    console.log('Verify contract: ' + domainArray[i].verifyingContract);

    try {
      let nonce = await tokenContract.methods.getNonce(userAddress).call();

      let message = {};
      message.nonce = parseInt(nonce);
      message.from = userAddress;
      message.functionSignature = functionSignature;

      const dataToSign = JSON.stringify({
        types: {
          EIP712Domain: domainType,
          MetaTransaction: metaTransactionType,
        },
        domain: domainArray[i],
        primaryType: 'MetaTransaction',
        message: message,
      });

      console.log('Domain data: ');
      console.log(domainArray[i]);

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

          let ret;

          try {
            if (i === 0) {
              ret = await tokenContract.methods
                .executeMetaTransaction(userAddress, functionSignature, r, s, v)
                .send({
                  from: userAddress,
                });
            } else if (i === 1) {
              ret = await tokenContract.methods
                .executeMetaTransaction(
                  userAddress,
                  functionSignature,
                  sessionDuration,
                  r,
                  s,
                  v
                )
                .send({
                  from: userAddress,
                });
            }

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
