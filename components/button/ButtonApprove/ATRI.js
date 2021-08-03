import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button } from 'semantic-ui-react';
import ABI_CHILD_TOKEN_ATRI from 'components/ABI/ABIChildTokenATRI';
import Global from 'components/Constants';
import Fetch from 'common/Fetch';
import MetaTx from 'common/MetaTx';
import styles from './ButtonApprove.module.scss';

function ATRI({ passed = false }) {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [tokenContract, setTokenContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [spenderAddress, setSpenderAddress] = useState('');

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      const spenderAddress = Global.ADDRESSES.TREASURY_CONTRACT_ADDRESS;
      setSpenderAddress(spenderAddress);

      const tokenContract = new getWeb3.eth.Contract(
        ABI_CHILD_TOKEN_ATRI,
        Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI
      );

      setTokenContract(tokenContract);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve ATRI');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  async function dispatchActiveStatus(txHash) {
    console.log('Updating active status to true');

    // update global state active status
    dispatch({
      type: 'active_status',
      data: true,
    });

    // dispatch({
    //   type: 'update_status',
    //   data: value,
    // });

    // update user's token array in database
    console.log("Updating user's token array in database: ATRI");

    await Fetch.UPDATE_TOKEN_ARRAY(state.userAddress, 3);

    // update global state user information
    const refresh = !state.updateInfo;

    dispatch({
      type: 'update_info',
      data: refresh,
    });

    // post authorization to database
    console.log('Posting ATRI authorization transaction to db: MAX_AMOUNT');

    Fetch.POST_HISTORY(
      state.userAddress,
      Global.CONSTANTS.MAX_AMOUNT,
      'ATRI Authorization',
      'Confirmed',
      txHash,
      state.userStatus
    );
  }

  // Biconomy API meta-transaction. User must authorize treasury contract to access their funds
  async function metaTransaction() {
    try {
      dispatch({
        type: 'set_atriLoading',
        data: true,
      });

      console.log('authorize amount: ' + Global.CONSTANTS.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.CONSTANTS.MAX_AMOUNT)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        5,
        functionSignature,
        tokenContract,
        state.userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');

        dispatch({
          type: 'set_atriLoading',
          data: false,
        });
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        dispatchActiveStatus(txHash);

        dispatch({
          type: 'set_atriLoading',
          data: false,
        });
      }
    } catch (error) {
      console.log('Biconomy metatransaction error: ' + error);

      dispatch({
        type: 'set_atriLoading',
        data: false,
      });
    }
  }

  return (
    <Button
      className={styles.enabled_button}
      onClick={() => metaTransaction()}
      disabled={!passed}
    >
      Enable ATRI
    </Button>
  );
}

export default ATRI;
