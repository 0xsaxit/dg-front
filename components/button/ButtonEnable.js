import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import MetaTx from '../../common/MetaTx';
import Aux from '../_Aux';
import Transactions from '../../common/Transactions';

function ButtonEnable() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [transaction, setTransaction] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [treasuryContract, setTreasuryContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [maticWeb3, setMaticWeb3] = useState({});

  // let userAddress = '';
  // let treasuryContract = {};
  // let web3 = {};
  // let maticWeb3 = {};
  const sessionDuration = Global.CONSTANTS.ACTIVE_PERIOD;

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const maticWeb3 = new Web3(
        new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object
      setMaticWeb3(maticWeb3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      (async function () {
        const treasuryContract = await Transactions.getTreasuryContract(
          getWeb3
        );

        // if (transaction) metaTransaction(); // MetaMask popup window
        setTreasuryContract(treasuryContract);
      })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  function dispatchActiveStatus(status, txHash) {
    // update global state active status
    dispatch({
      type: 'active_status',
      data: status,
    });

    // post reauthorization to database
    console.log('Posting reauthorization transaction to db');

    Fetch.POST_HISTORY(
      userAddress,
      Global.CONSTANTS.MAX_AMOUNT,
      'Reauthorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must re-authorize treasury contract after dormant period
  async function metaTransaction() {
    try {
      console.log('Session Duration: ' + sessionDuration);

      // const treasuryContract = await Transactions.getTreasuryContract(getWeb3);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = treasuryContract.methods
        .enableAccount(sessionDuration)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        1,
        functionSignature,
        sessionDuration,
        treasuryContract,
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
        dispatchActiveStatus(activeStatus, txHash);
      }
    } catch (error) {
      console.log(error);
    }

    // setTransaction(false);
  }

  return (  
    <Aux>
      <span>
        <Button
          className="account-connected-play-button"
          onClick={() => metaTransaction()}
        >
          AUTHORIZE
        </Button>
      </span>

      <Button
        className="account-connected-play-button-mobile"
        onClick={() => metaTransaction()}
      >
        AUTHORIZE
      </Button>
    </Aux>
  );
}

export default ButtonEnable;
