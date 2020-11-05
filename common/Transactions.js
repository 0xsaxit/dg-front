import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import Global from '../components/Constants';

// set treasury contract instance
async function treasuryContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const treasuryContract = new web3Default.eth.Contract(
    ABI_TREASURY_CONTRACT,
    addresses.TREASURY_CONTRACT_ADDRESS
  );

  return treasuryContract;
}

// get user's active status (true or false) from smart contract
async function getActiveStatus(userAddress, web3Default) {
  console.log("Get user's active status from smart contract");

  const parentContract = await treasuryContract(web3Default);

  try {
    const activeStatus = await parentContract.methods
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

  const DGPointerContract = new web3Default.eth.Contract(
    ABI_DG_POINTER,
    addresses.DG_POINTER_CONTRACT_ADDRESS
  );

  return DGPointerContract;
}

// get user or contract token balance from MetaMask
async function balanceOfToken(tokenContract, userOrContractAddress, units) {
  console.log('Get balance of token');

  try {
    const amount = await tokenContract.methods
      .balanceOf(userOrContractAddress)
      .call();

    const amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(units);
    // .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return amountAdjusted;
  } catch (error) {
    console.log('Get balance failed', error);
  }
}

export default {
  treasuryContract,
  getActiveStatus,
  balanceOfToken,
  pointerContract,
};
