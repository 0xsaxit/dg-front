import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import Global from '../components/Constants';
import Fetch from '../common/Fetch';
import MetaTx from '../common/MetaTx';
import Transactions from '../common/Transactions';

function ActiveStatus() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [userAddress, setUserAddress] = useState('');
  const [web3, setWeb3] = useState({});
  const [getWeb3, setGetWeb3] = useState({});
  const [maticWeb3, setMaticWeb3] = useState({});
  const [biconomyReady, setBiconomyReady] = useState(false);

  // let getWeb3 = {};
  // let userAddress = '';
  let parentContract = {};

  // let web3 = {};
  // let maticWeb3 = {};

  let activeStatus = true;
  const sessionDuration = Global.CONSTANTS.ACTIVE_PERIOD;

  useEffect(() => {
    if (
      state.userStatus >= 6 &&
      state.networkID === Global.CONSTANTS.PARENT_NETWORK_ID
    ) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create treasury contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor
      setMaticWeb3(maticWeb3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor
      setGetWeb3(getWeb3);

      // (async function () {
      //   parentContract = await Transactions.treasuryContract(getWeb3);

      //   activeStatus = await Transactions.getActiveStatus(
      //     userAddress,
      //     maticWeb3
      //   );
      //   console.log('Active status: ' + activeStatus);
      //   dispatchActiveStatus(activeStatus);

      //   // if (!activeStatus) metaTransaction(); // MetaMask popup window
      // })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');

          // if (!activeStatus) metaTransaction(); // MetaMask popup window
          setBiconomyReady(true);

          // (async function () {
          //   parentContract = await Transactions.treasuryContract(getWeb3);

          //   activeStatus = await Transactions.getActiveStatus(
          //     userAddress,
          //     maticWeb3
          //   );
          //   console.log('Active status: ' + activeStatus);
          //   dispatchActiveStatus(activeStatus);

          //   if (!activeStatus) metaTransaction(); // MetaMask popup window
          // })();
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (biconomyReady) {
      (async function () {
        parentContract = await Transactions.treasuryContract(getWeb3);

        activeStatus = await Transactions.getActiveStatus(
          userAddress,
          maticWeb3
        );
        console.log('Active status: ' + activeStatus);
        dispatchActiveStatus(activeStatus);

        if (!activeStatus) metaTransaction(); // MetaMask popup window
      })();
    }
  }, [biconomyReady]);

  // update global state active status
  function dispatchActiveStatus(status) {
    dispatch({
      type: 'active_status',
      data: status,
    });
  }

  // post reauthorization to database
  function postAuthorization(txHash) {
    // console.log('Posting reauthorization transaction to db');

    Fetch.POST_HISTORY(
      userAddress,
      Global.CONSTANTS.MAX_AMOUNT,
      'Reauthorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must re-authoriza signature after 12 dormant hours
  async function metaTransaction() {
    try {
      console.log('Session Duration: ' + sessionDuration);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = parentContract.methods
        .enableAccount(sessionDuration)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        1,
        functionSignature,
        parentContract,
        userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        const activeStatus = await Transactions.getActiveStatus(
          userAddress,
          maticWeb3
        );
        console.log('Active status (updated): ' + activeStatus);

        dispatchActiveStatus(activeStatus);
        postAuthorization(txHash);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return null;
}

export default ActiveStatus;
