import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

function ButtonEnable() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [transaction, setTransaction] = useState(false);

  let userAddress = '';
  let treasuryContract = {};
  let web3 = {};
  let maticWeb3 = {};
  const sessionDuration = Global.ACTIVE_PERIOD;

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

      if (transaction) metaTransaction(); // MetaMask popup window
    }
  }, [state.userStatus, transaction]);

  function dispatchActiveStatus(status, txHash) {
    // update global state active status
    dispatch({
      type: 'active_status',
      data: status,
    });

    // post reauthorization to database
    console.log('Posting reauthorization transaction to db');

    Global.FETCH.POST_HISTORY(
      userAddress,
      Global.MAX_AMOUNT,
      'Reauthorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must re-authoriza treasury contract after dormant period
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

        const activeStatus = await Global.getActiveStatus(
          userAddress,
          maticWeb3
        );
        console.log('Active status (updated): ' + activeStatus);
        dispatchActiveStatus(activeStatus, txHash);
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
      AUTHORIZE
    </Button>
  );
}

export default ButtonEnable;
