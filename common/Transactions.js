import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_BP_TOKEN from '../components/ABI/ABIBalancerPoolToken';
import ABI_DG_KEEPER from '../components/ABI/ABIDGKeeper';
import Global from '../components/Constants';

// set treasury contract instance
async function treasuryContract(web3Default) {
  const treasuryContract = new web3Default.eth.Contract(
    ABI_TREASURY_CONTRACT,
    Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS
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
  const DGPointerContract = new web3Default.eth.Contract(
    ABI_DG_POINTER,
    Global.ADDRESSES.DG_POINTER_CONTRACT_ADDRESS
  );

  return DGPointerContract;
}

// set DG staking governance contract instance
async function stakingContractGovernance(web3Default) {
  const DGStakingGovernance = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    Global.ADDRESSES.DG_STAKING_GOVERNANCE_ADDRESS
  );

  return DGStakingGovernance;
}

// set staking contract instance DG pool 1
async function stakingContractPool1(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    Global.ADDRESSES.DG_STAKING_CONTRACT_ADDRESS
  );

  return DGStakingContract;
}

// set staking contract instance DG pool 2
async function stakingContractPool2(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    Global.ADDRESSES.DG_STAKING_CONTRACT_ADDRESS_2
  );

  return DGStakingContract;
}

// set staking contract instance DG uniswap
async function stakingContractUniswap(web3Default) {
  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    Global.ADDRESSES.DG_STAKING_CONTRACT_ADDRESS_3
  );

  return DGStakingContract;
}

// set staking contract instance BPT pool 1
async function BPTContract1(web3Default) {
  const BPTokenContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    Global.ADDRESSES.BP_TOKEN_ADDRESS
  );

  return BPTokenContract;
}

// set staking contract instance BPT pool 2
async function BPTContract2(web3Default) {
  const BPTokenContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    Global.ADDRESSES.BP_TOKEN_ADDRESS_2
  );

  return BPTokenContract;
}

// set staking contract instance uniswap
async function uniswapContract(web3Default) {
  const UNIContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    Global.ADDRESSES.UNI_TOKEN_ADDRESS
  );

  return UNIContract;
}

// set DG keeper contract instance
async function keeperContract(web3Default) {
  const DGKeeperContract = new web3Default.eth.Contract(
    ABI_DG_KEEPER,
    Global.ADDRESSES.DG_KEEPER_CONTRACT_ADDRESS
  );

  return DGKeeperContract;
}

// get user or contract token balance from MetaMask
async function balanceOfToken(tokenContract, userOrContractAddress, units) {
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

// amount user has earned from smart contract
async function balanceEarned(tokenContract, userAddress, units) {
  try {
    const amount = await tokenContract.methods.earned(userAddress).call();

    let amountAdjusted = 0;
    if (units) {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toFixed(units);
    } else {
      amountAdjusted = (amount / Global.CONSTANTS.FACTOR).toString();
    }

    return amountAdjusted;
  } catch (error) {
    console.log('Get amount earned failed', error);
  }
}

// get total supply of token in contract
async function getTotalSupply(tokenContract) {
  const supply = await tokenContract.methods.totalSupply().call();
  const supplyAdjusted = supply / Global.CONSTANTS.FACTOR;

  return supplyAdjusted;
}

export default {
  treasuryContract,
  getActiveStatus,
  pointerContract,
  stakingContractGovernance,
  stakingContractPool1,
  stakingContractPool2,
  stakingContractUniswap,
  BPTContract1,
  BPTContract2,
  uniswapContract,
  keeperContract,
  balanceOfToken,
  balanceEarned,
  getTotalSupply,
};
