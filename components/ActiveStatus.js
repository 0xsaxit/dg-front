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
  let maticWeb3 = {};
  const sessionDuration = 60; // 3600 == 1 hour

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // initialize Web3 providers and create token contract instance
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      maticWeb3 = new Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object
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
        dispatchActiveStatus(activeStatus);

        if (!activeStatus) metaTransaction(); // MetaMask popup window
      })();
    }
  }, [state.userStatus]);

  // dispatch user's active status
  function dispatchActiveStatus(status) {
    dispatch({
      type: 'active_status',
      data: status,
    });
  }

  // get user's active status (true or false) from smart contract
  async function getActiveStatus() {
    const addresses = await Global.API_ADDRESSES;

    const TREASURY_CONTRACT = new maticWeb3.eth.Contract(
      Global.ABIs.TREASURY_CONTRACT,
      addresses.TREASURY_CONTRACT_ADDRESS
    );

    try {
      const activeStatus = await TREASURY_CONTRACT.methods
        .isEnabled(userAddress)
        .call();

      return activeStatus;
    } catch (error) {
      console.log('No active status found: ' + error);
    }
  }

  // Biconomy API meta-transaction. User must re-authoriza signature after 12 dormant hours
  async function metaTransaction() {
    try {
      console.log('Session Duration: ' + sessionDuration);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = treasuryContract.methods
        .enableAccount(sessionDuration)
        .encodeABI();

      const txHash = await Global.executeMetaTransaction(
        1,
        functionSignature,
        sessionDuration,
        treasuryContract,
        userAddress,
        web3
      );

      if (txHash == false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        const activeStatus = await getActiveStatus();
        console.log('Active status (updated): ' + activeStatus);
        dispatchActiveStatus(activeStatus);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

export default ActiveStatus;
