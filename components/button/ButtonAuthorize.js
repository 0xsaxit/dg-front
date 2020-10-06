import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';
import ABI_CHILD_TOKEN from '../ABI/ABIChildToken';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import MetaTx from '../../common/MetaTx';

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
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      // tokenContract = Global.getTokenContract('child', getWeb3);

      (async function () {
        const addresses = await Global.API_ADDRESSES;

        tokenContract = new getWeb3.eth.Contract(
          ABI_CHILD_TOKEN,
          addresses.CHILD_TOKEN_ADDRESS_MANA
        );
      })();

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

  function dispatchActiveStatus(txHash) {
    console.log('Updating user status to: ' + value);

    // update global state active status
    dispatch({
      type: 'active_status',
      data: true,
    });

    // update global state user status
    dispatch({
      type: 'update_status',
      data: value,
    });

    // update user status in database
    console.log('Posting user status to db: ' + value);
    Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);

    // post authorization to database
    console.log('Posting authorization transaction to db: MAX_AMOUNT');

    Fetch.POST_HISTORY(
      userAddress,
      Global.CONSTANTS.MAX_AMOUNT,
      'Authorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must authorize treasury contract to access their funds
  async function metaTransaction() {
    try {
      console.log('authorize amount: ' + Global.CONSTANTS.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.CONSTANTS.MAX_AMOUNT)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        0,
        functionSignature,
        '',
        tokenContract,
        userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        dispatchActiveStatus(txHash);
      }
    } catch (error) {
      console.log(error);
    }

    setTransaction(false);
  }

  return (
    <Aux>
      <span>
        <Button
          className="account-connected-play-button"
          onClick={() => setTransaction(true)}
        >
          AUTHORIZE
        </Button>
      </span>

      <Button
        className="account-connected-play-button-mobile"
        onClick={() => setTransaction(true)}
      >
        AUTHORIZE
      </Button>
    </Aux>
  );
}

export default ButtonAuthorize;
