import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';
import ABI_CHILD_TOKEN_DAI from '../ABI/ABIChildTokenDAI';
import Global from '../Constants';
import Fetch from '../../common/Fetch';
import MetaTx from '../../common/MetaTx';

function ButtonApproveMANA() {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [userAddress, setUserAddress] = useState('');
  const [tokenContract, setTokenContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [spenderAddress, setSpenderAddress] = useState('');
  const [value, setValue] = useState(0);

  // if the user has also authorized MANA set status value to 8, otherwise 6
  useEffect(() => {
    if (state.userStatus >= 4) {
      if (state.userStatus === 7) {
        setValue(8);
      } else {
        setValue(6);
      }
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      // (async function () {
      //   const addresses = await Global.ADDRESSES;

      const spenderAddress = Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS;
      setSpenderAddress(spenderAddress);

      const tokenContract = new getWeb3.eth.Contract(
        ABI_CHILD_TOKEN_DAI,
        Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
      );

      setTokenContract(tokenContract);
      // })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve DAI');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

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
    console.log('Posting DAI authorization transaction to db: MAX_AMOUNT');

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
        3,
        functionSignature,
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
  }

  return (
    <Aux>
      <span>
        <Button
          className="balances-authorize-button"
          id="balances-padding-correct"
          onClick={() => metaTransaction()}
        >
          ENABLE DAI GAMEPLAY
        </Button>
      </span>
    </Aux>
  );
}

export default ButtonApproveMANA;
