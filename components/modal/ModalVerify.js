import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

const ModalVerify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  let isBrowserMetaMask = 0;

  useEffect(() => {
    if (window.web3) {
      userAddress = window.web3.currentProvider.selectedAddress;
      isBrowserMetaMask = 1;

      console.log('user address 1: ' + userAddress); // null
      console.log('metamask 1: ' + isBrowserMetaMask); // 1
    }
  });

  async function onMetaMask() {
    if (!window.ethereum) {
      console.log('MetaMask not present...');
    } else {
      await window.ethereum.enable(); // open MataMask for login

      console.log('user address 2: ' + userAddress);
      console.log('metamask 2: ' + isBrowserMetaMask);

      // set the user's wallet address and update user status to 4
      // userAddress = window.web3.currentProvider.selectedAddress;
      updateStatus(4);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // update user status to 4 both locally and in the database
  function updateStatus(step) {
    console.log('Updating user status to: ' + step);

    // update global state user status
    dispatch({
      type: 'update_status',
      data: step,
    });

    // update user status in database
    postUserVerify(step);
  }

  function postUserVerify(step) {
    return fetch(`${Global.API_BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
        verifyStep: step,
      }),
    });
  }

  return (
    <Button
      content="CONNECT METAMASK"
      color="blue"
      className="metamask-button"
      onClick={onMetaMask}
    />
  );
};

export default ModalVerify;
