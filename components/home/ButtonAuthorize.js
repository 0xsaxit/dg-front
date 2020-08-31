import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;
  spenderAddress = addresses.TREASURY_CONTRACT_ADDRESS;
}
getAddresses();

function ButtonAuthorize() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [transaction, setTransaction] = useState(false);

  let userAddress = '';
  let tokenContract = {};
  let web3 = {};
  const value = 7;

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
      tokenContract = Global.getTokenContract('child', getWeb3);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });

      if (transaction) metaTransaction(); // MetaMask popup window
    }
  }, [state.userStatus, transaction]);

  // dispatch user's active status
  function dispatchActiveStatus() {
    console.log('Updating user status to: ' + value);

    // update global state user status
    dispatch({
      type: 'active_status',
      data: value,
    });

    // update user status in database
    console.log('Posting user status to db: ' + value);
    Global.FETCH.USER_VERIFY(userAddress, value);
  }

  // Biconomy API meta-transaction. User must re-authoriza signature after 12 dormant hours
  async function metaTransaction() {
    try {
      console.log('authorize amount: ' + Global.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.MAX_AMOUNT)
        .encodeABI();

      const txHash = await Global.executeMetaTransaction(
        0,
        functionSignature,
        '',
        tokenContract,
        userAddress,
        web3
      );

      if (txHash == false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        dispatchActiveStatus();
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Button
      className="account-connected-play-button"
      onClick={() => setTransaction(true)}
    >
      AUTHORIZE GAMEPLAY
    </Button>
  );
}

export default ButtonAuthorize;
