import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking.json';
import Global from '../components/Constants';

// return treasury contract for Biconomy API meta-transaction calls
async function getTreasuryContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;
  // const treasuryContractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

  const treasuryContract = new web3Default.eth.Contract(
    ABI_TREASURY_CONTRACT,
    addresses.TREASURY_CONTRACT_ADDRESS
  );

  return treasuryContract;
}

// get user's active status (true or false) from smart contract
async function getActiveStatus(userAddress, web3Default) {
  console.log("Get user's active status from smart contract");

  const treasuryContract = await getTreasuryContract(web3Default);

  try {
    const activeStatus = await treasuryContract.methods
      .isEnabled(userAddress)
      .call();

    return activeStatus;
  } catch (error) {
    console.log('No active status found: ' + error);
  }
}

// set pointer contract instance
async function pointerContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const DG_POINTER_CONTRACT = new web3Default.eth.Contract(
    ABI_DG_POINTER,
    addresses.DG_POINTER_ADDRESS
  );

  // const DG_POINTER_CONTRACT = web3Default.eth
  //   .contract(ABI_DG_POINTER)
  //   .at(addresses.DG_POINTER_ADDRESS);

  return DG_POINTER_CONTRACT;
}

// set staking contract instance
async function stakingContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const DG_STAKING_CONTRACT = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_ADDRESS
  );

  return DG_STAKING_CONTRACT;
}

// get user or contract token balance from MetaMask
async function balanceOfToken2(tokenContract, userOrContractAddress, units) {
  console.log('Get balance of token 2');

  try {
    const amount = await tokenContract.methods
      .balanceOf(userOrContractAddress)
      .call();

    const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return amountAdjusted;
  } catch (error) {
    console.log('Get balance failed', error);
  }
}

// get user or contract token balance from MetaMask
// function balanceOfToken(tokenContract, userOrContractAddress, units) {
//   return new Promise(async (resolve, reject) => {
//     console.log('Get balance of token');

//     try {
//       tokenContract.balanceOf(userOrContractAddress, async function (
//         err,
//         amount
//       ) {
//         if (err) {
//           console.log('Get balance failed', err);
//           reject(false);
//         }

//         const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
//           .toFixed(units)
//           .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//         resolve(amountAdjusted);
//       });
//     } catch (error) {
//       console.log('Get balance failed', error);
//       reject(false);
//     }
//   });
// }

export default {
  getTreasuryContract,
  getActiveStatus,
  balanceOfToken2,
  // balanceOfToken,
  pointerContract,
  stakingContract,
};
