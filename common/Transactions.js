// import { useState, useEffect, useContext } from 'react';
// import { GlobalContext } from '../store';

import ABI_TREASURY_CONTRACT from '../components/ABI/ABITreasury';
import ABI_DG_POINTER from '../components/ABI/ABIDGPointer';
import ABI_DG_STAKING from '../components/ABI/ABIDGStaking';
import ABI_BP_TOKEN from '../components/ABI/ABIBalancerPoolToken';
import ABI_DG_KEEPER from '../components/ABI/ABIDGKeeper';
import Global from '../components/Constants';

// import ADDRESSES from './Addresses';

// set treasury contract instance
async function treasuryContract(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');
  // const [state, dispatch] = useContext(GlobalContext);

  const treasuryContract = new web3Default.eth.Contract(
    ABI_TREASURY_CONTRACT,
    addresses.TREASURY_CONTRACT_ADDRESS
  );

  return treasuryContract;
}

// get user's active status (true or false) from smart contract
async function getActiveStatus(addresses, userAddress, web3Default) {
  console.log("Get user's active status from smart contract");

  const parentContract = await treasuryContract(addresses, web3Default);

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
async function pointerContract(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const DGPointerContract = new web3Default.eth.Contract(
    ABI_DG_POINTER,
    addresses.DG_POINTER_CONTRACT_ADDRESS
  );

  return DGPointerContract;
}

// set staking contract instance dg pool 1
async function stakingContract(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const DGStakingContract = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS
  );

  return DGStakingContract;
}

// set staking contract instance dg pool 2
async function stakingContractTwo(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const DGStakingContractTwo = new web3Default.eth.Contract(
    ABI_DG_STAKING,
    addresses.DG_STAKING_CONTRACT_ADDRESS_2
  );

  return DGStakingContractTwo;
}

// set staking contract instance bpt pool 1
async function BPTContract(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const BPTokenContract = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.BP_TOKEN_ADDRESS
  );

  return BPTokenContract;
}

// set staking contract instance bpt pool 2
async function BPTContractTwo(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const BPTokenContractTwo = new web3Default.eth.Contract(
    ABI_BP_TOKEN,
    addresses.BP_TOKEN_ADDRESS_2
  );

  return BPTokenContractTwo;
}

// set keeper contract instance
async function keeperContract(addresses, web3Default) {
  // const addresses = await ADDRESSES('foo');

  const DGKeeperContract = new web3Default.eth.Contract(
    ABI_DG_KEEPER,
    addresses.DG_KEEPER_CONTRACT_ADDRESS
  );

  return DGKeeperContract;
}

// get user or contract token balance from MetaMask
async function balanceOfToken(tokenContract, userOrContractAddress, units) {
  console.log('Get balance of token');

  // console.log('address: ' + userOrContractAddress);

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
  BPTContract,
  BPTContractTwo,
  keeperContract,
};
