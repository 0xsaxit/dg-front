import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
// import { Form, Input } from 'semantic-ui-react';
import ContentModal from './ContentModal';
import Global from '../Constants';

const DepositFunds = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amount, setAmount] = useState(0);
  const [transaction, setTransaction] = useState(false);

  let userAddress = '';
  let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      if (transaction && amount) {
        depositFunds(); // MetaMask popup window
      } else {
        setTransaction(false);
      }
    }
  }, [state.userStatus, transaction, amount]);

  // function inputChange(e) {
  //   const valueWei = e.target.value * Global.FACTOR;
  //   setAmount(valueWei);
  // }

  async function depositFunds() {
    props.showModal(false); // close the modal

    const txHash = await Global.depositToParent(
      props.gameTypeInt,
      0,
      amount,
      userAddress,
      web3
    );
    console.log('Tx Hash: ' + txHash);

    initializePings();
  }

  // start pinging the token contract for deposit confirmation
  function initializePings() {
    console.log('Ping token contract');

    dispatch({
      type: 'token_pings',
      data: 1,
    });
  }

  return <ContentModal type={'DEPOSIT'} />;
};

export default DepositFunds;
