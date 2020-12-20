import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_BP_TOKEN from '../components/ABI/ABIBalancerPoolToken';
import ABI_DG_KEEPER from '../components/ABI/ABIDGKeeper';
import Global from '../components/Constants';

// set treasury contract instance
async function treasuryContract(web3Default) {
  const addresses = await Global.ADDRESSES;

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
  const addresses = await Global.ADDRESSES;

  const DGPointerContract = new web3Default.eth.Contract(
    ABI_DG_POINTER,
    addresses.DG_POINTER_CONTRACT_ADDRESS
  );

  return DGPointerContract;
}

// set dg main contract instance
async function tokenContract(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGToken = new web3Default.eth.Contract(
    ABI_DG_TOKEN,
    // addresses.DG_TOKEN
    addresses.ROOT_TOKEN_ADDRESS_DG
  );

  return DGToken;
}

// set dg staking gov contract instance
async function stakingContractGov(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGStakingGov = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_GOVERNANCE
  );

  return DGStakingGov;
}

// set staking contract instance dg pool 1
async function stakingContract(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS
  );

  return DGStakingContract;
}

// set staking contract instance dg pool 2
async function stakingContractTwo(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGStakingContractTwo = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS_2
  );

  return DGStakingContractTwo;
}

// set staking contract instance dg uniswap
async function stakingContractThree(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGStakingContractThree = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS_3
  );

  return DGStakingContractThree;
}

// set staking contract instance bpt pool 1
async function BPTContract(web3Default) {
  const addresses = await Global.ADDRESSES;

  const BPTokenContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.BP_TOKEN_ADDRESS
  );

  return BPTokenContract;
}

// set staking contract instance bpt pool 2
async function BPTContractTwo(web3Default) {
  const addresses = await Global.ADDRESSES;

  const BPTokenContractTwo = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.BP_TOKEN_ADDRESS_2
  );

  return BPTokenContractTwo;
}

// set staking contract instance uniswap
async function UNIContract(web3Default) {
  const addresses = await Global.ADDRESSES;

  const UNIContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.UNI_TOKEN_ADDRESS
  );

  return UNIContract;
}

// set keeper contract instance
async function keeperContract(web3Default) {
  const addresses = await Global.ADDRESSES;

  const DGKeeperContract = new web3Default.eth.Contract(
    ABI_DG_KEEPER,
    addresses.DG_KEEPER_CONTRACT_ADDRESS
  );

  return DGKeeperContract;
}

// get user or contract token balance from MetaMask
async function balanceOfToken(tokenContract, userOrContractAddress, units) {
  // console.log('Get balance of token');

  try {
    const amount = await tokenContract.methods
      .balanceOf(userOrContractAddress)
      .call();

    let amountAdjusted = 0;
    if (units) {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(units);
    } else {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toString();
    }

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
  stakingContractTwo,
  stakingContractThree,
  BPTContract,
  BPTContractTwo,
  UNIContract,
  keeperContract,
  tokenContract,
  stakingContractGov,
};
