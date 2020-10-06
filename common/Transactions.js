import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import Global from '../components/Constants';

// return treasury contract for Biconomy API meta-transaction calls
async function getTreasuryContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;
  const treasuryContractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

  const treasuryContract = new web3Default.eth.Contract(
    ABI_TREASURY_CONTRACT,
    treasuryContractAddress
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

// get user or contract token balance from MetaMask
function balanceOfToken(tokenContract, userOrContractAddress) {
  return new Promise(async (resolve, reject) => {
    console.log('Get balance of token');

    try {
      tokenContract.balanceOf(userOrContractAddress, async function (
        err,
        amount
      ) {
        if (err) {
          console.log('Get balance failed', err);
          reject(false);
        }

        const amountAdjusted = (amount / Global.CONSTANTS.FACTOR)
          .toFixed(0)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        resolve(amountAdjusted);
      });
    } catch (error) {
      console.log('Get balance failed', error);
      reject(false);
    }
  });
}

export default {
  getTreasuryContract,
  getActiveStatus,
  balanceOfToken,
};
