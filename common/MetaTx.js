import Global from '../components/Constants';

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
// EIP712 domain params for Biconomy API
const sigUtil = require('eth-sig-util');
let childTokenAddressMANA = '';
let childTokenAddressDAI = '';
let childTokenAddressUSDT = '';
let childTokenAddressATRI = '';
let childTokenAddressWETH = '';
let childTokenAddressICE = '';
let childTokenAddressDG = '';
let accessoriesContract = '';
let treasuryAddress = '';
let dgPointerAddress = '';
let dgPointerAddressNew = '';
let iceRegistrantAddress = '';
let arrayDomainType = [];
let arrayDomainData = [];
let metaTransactionType = [];

childTokenAddressMANA = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA;
childTokenAddressDAI = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI;
childTokenAddressUSDT = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT;
childTokenAddressATRI = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI;
childTokenAddressWETH = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH;
childTokenAddressICE = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE;
childTokenAddressDG = Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG;
accessoriesContract = Global.ADDRESSES.COLLECTION_V2_ADDRESS;
treasuryAddress = Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS;
dgPointerAddress = Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS;
dgPointerAddressNew = Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS_NEW;
iceRegistrantAddress = Global.ADDRESSES.ICE_REGISTRANT_ADDRESS;

const domainTypeToken = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'verifyingContract', type: 'address' },
  { name: 'salt', type: 'bytes32' },
];

const domainTypeTreasury = [
  { name: 'name', type: 'string' },
  { name: 'version', type: 'string' },
  { name: 'chainId', type: 'uint256' },
  { name: 'verifyingContract', type: 'address' },
];

arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeTreasury);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeToken);
arrayDomainType.push(domainTypeTreasury);

metaTransactionType.push(
  { name: 'nonce', type: 'uint256' },
  { name: 'from', type: 'address' },
  { name: 'functionSignature', type: 'bytes' }
);

const domainDataTokenMANA = {
  name: '(PoS) Decentraland MANA',
  version: '1',
  verifyingContract: childTokenAddressMANA,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
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
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataTokenUSDT = {
  name: '(PoS) Tether USD',
  version: '1',
  verifyingContract: childTokenAddressUSDT,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataTokenATRI = {
  name: 'Atari (PoS)',
  version: '1',
  verifyingContract: childTokenAddressATRI,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataTokenWETH = {
  name: 'Wrapped Ether',
  version: '1',
  verifyingContract: childTokenAddressWETH,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataDGPointerNew = {
  name: 'NEW',
  version: 'V6',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: dgPointerAddressNew,
};

const domainDataTokenICE = {
  name: 'IceToken',
  version: 'v1.2',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: childTokenAddressICE,
};

const domainDataTokenDG = {
  name: 'decentral.games (PoS)',
  version: '1',
  verifyingContract: childTokenAddressDG,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataAccessories = {
  name: 'Decentraland Collection',
  version: '2',
  verifyingContract: accessoriesContract,
  salt: '0x' + Global.CONSTANTS.MATIC_NETWORK_ID.toString(16).padStart(64, '0'),
};

const domainDataICERegistrant = {
  name: 'IceRegistrant',
  version: 'v1.3',
  chainId: Global.CONSTANTS.PARENT_NETWORK_ID,
  verifyingContract: iceRegistrantAddress,
};

arrayDomainData.push(domainDataTokenMANA);
arrayDomainData.push(domainDataTreasury);
arrayDomainData.push(domainDataDGPointer);
arrayDomainData.push(domainDataTokenDAI);
arrayDomainData.push(domainDataTokenUSDT);
arrayDomainData.push(domainDataTokenATRI);
arrayDomainData.push(domainDataTokenWETH);
arrayDomainData.push(domainDataDGPointerNew);
arrayDomainData.push(domainDataTokenICE);
arrayDomainData.push(domainDataTokenDG);
arrayDomainData.push(domainDataAccessories);
arrayDomainData.push(domainDataICERegistrant);

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
    console.log('Execute Biconomy PoS meta-transaction: ' + i);
    console.log('Function signature: ' + functionSignature);
    console.log('User address: ' + userAddress);
    console.log('Verify contract: ' + arrayDomainData[i].verifyingContract);

    try {
      // console.log('contract instance...');
      // console.log(contractInstance);

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
            console.log(ret);
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
