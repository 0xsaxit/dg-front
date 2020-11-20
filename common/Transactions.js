import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_BP_TOKEN from '../components/ABI/ABIBalancerPoolToken';
import ABI_DG_KEEPER from '../components/ABI/ABIDGKeeper';
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

// set staking contract instance
async function stakingContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS
  );

  return DGStakingContract;
}

// set staking contract instance
async function BPTContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const BPTokenContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.BP_TOKEN_ADDRESS
  );

  return BPTokenContract;
}

// set keeper contract instance
async function keeperContract(web3Default) {
  const addresses = await Global.API_ADDRESSES;

  const DGKeeperContract = new web3Default.eth.Contract(
    ABI_DG_KEEPER,
    addresses.DG_KEEPER_CONTRACT_ADDRESS
  );

  return DGKeeperContract;
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
  stakingContract,
  BPTContract,
  keeperContract,
};
