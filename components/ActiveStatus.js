import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import Global from './Constants';

function ActiveStatus() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  let treasuryContract = {};
  let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // initialize Web3 providers and create token contract instance
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor
      treasuryContract = Global.getTreasuryContract(getWeb3);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });

      (async function () {
        const activeStatus = await getActiveStatus();
        console.log('Active status: ' + activeStatus);

        if (activeStatus === 0) metaTransaction();

        console.log('here here here... ' + activeStatus);

        // dispatch user's active status
        dispatch({
          type: 'active_status',
          data: activeStatus,
        });
      })();
    }
  }, [state.userStatus]);

  //
  async function getActiveStatus() {
    try {
      const TREASURY_CONTRACT = new web3.eth.Contract(
        Global.ABIs.TREASURY_CONTRACT,
        Global.API_ADDRESSES.TREASURY_CONTRACT_ADDRESS
      );

      //   const activeStatus = await TREASURY_CONTRACT.methods
      //     .tokenOfOwnerByIndex(userAddress, 0) // ***********************************
      //     .call();

      //   return activeStatus;

      return 0;
    } catch (error) {
      console.log('No active status found: ' + error);

      return false;
    }
  }

  // Biconomy API meta-transaction. User must re-authoriza signature after 12 dormant hours
  async function metaTransaction() {
    try {
      const addresses = await Global.API_ADDRESSES;
      const spenderAddress = addresses.TREASURY_CONTRACT_ADDRESS;

      console.log('Matic RPC: ' + Global.MATIC_URL);
      console.log('user address: ' + userAddress);
      console.log('spender (treasury) address: ' + spenderAddress);
      console.log('authorize amount: ' + Global.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = treasuryContract.methods
        .enableAccount(1)
        .encodeABI();

      const txHash = await Global.executeMetaTransaction(
        1,
        functionSignature,
        treasuryContract,
        userAddress,
        web3
      );

      if (txHash == false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // dispatch user's active status
        dispatch({
          type: 'active_status',
          data: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

export default ActiveStatus;
