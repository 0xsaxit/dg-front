import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';

const MessageBar = () => {
  // get user's network, location, and active status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = useState('');

  // const [loggedIn, setLoggedIn] = useState(false);

  let isSafari = false;

  // let loggedIn = false;

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      isSafari = true;
    }
  }, []);

  // get network ID
  useEffect(() => {
    if (window.web3) {
      window.web3.version.getNetwork((err, network) => {
        const networkInt = parseInt(network);

        dispatch({
          type: 'network_id',
          data: networkInt,
        });
      });
    }
  }, []);

  // check for MetaMask login
  useEffect(() => {
    if (window.ethereum) {
      const address = window.web3.currentProvider.selectedAddress;

      if (address) {
        // setLoggedIn(true);
        // loggedIn = true;

        dispatch({
          type: 'is_loggedIn',
          data: true,
        });
      }
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (isSafari) {
      setMessage('Please use a Chrome browser with Metamask to play games');
    } else if (!state.networkID) {
      setMessage('Please enable MetaMask to play games');
    } else if (!state.isLoggedIn) {
      setMessage('Please log in to MetaMask to play games');
    } else if (state.networkID !== 5) {
      setMessage(
        'Decentral Games is currently in beta. Please switch MetaMask to Goerli Network.'
      );
    } else if (!state.userStatus === 4) {
      setMessage(
        'You must reside in a whitelisted jurisdiction to play games with crypto. You may still play our free play games'
      );
    } else if (state.userStatus === 6) {
      setMessage(
        'You must authorize the Decentral Games smart contract on Matic Network to play games'
      );
    } else if (!state.activeStatus) {
      setMessage(
        'To ensure the security of your funds, we require a reauthorization signature after 12 dormant hours'
      );
    } else {
      setMessage('');
    }
  }, [
    state.isSafari,
    state.networkID,
    state.isLoggedIn,
    state.userStatus,
    state.activeStatus,
  ]);

  if (message !== '') {
    return (
      <div
        className="mobile-message-bar"
        style={{
          fontFamily: 'Graphik, sans-serif',
          color: 'white',
          textAlign: 'center',
          padding: '10px 30px 9px 30px',
          fontSize: '14px',
          letterSpacing: '0.5px',
          fontWeight: 500,
          backgroundColor: '#2185f4',
          minHeight: '38px',
        }}
      >
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default MessageBar;
