import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';

const MessageBar = () => {
  // get user's network and location from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = React.useState('');

  useEffect(() => {
    if (state.userStatus) {
      window.web3.version.getNetwork((err, network) => {
        const networkInt = parseInt(parseInt(network));

        dispatch({
          type: 'network_id',
          data: networkInt,
        });
      });
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (!state.networkID) {
      setMessage(
        'You must login to MetaMask to play games with crypto. You may still play our free play games'
      );
    } else if (state.networkID !== 1) {
      setMessage('Please switch MetaMask to Ethereum Mainnet');
    } else if (!state.location) {
      setMessage(
        'You must reside in a whitelisted jurisdiction to play games with crypto. You may still play our free play games'
      );
    } else {
      setMessage('');
    }
  }, [state.networkID, state.location]);

  //   function getMessage() {
  //     if (!state.networkID) {
  //       setMessage('You must login to MetaMask to view your NFTs');
  //     } else if (state.networkID !== 1) {
  //       setMessage('Please switch MetaMask to Ethereum Mainnet');
  //     } else if (!state.location) {
  //       setMessage(
  //         'You must reside in a whitelisted jurisdiction to play games with crypto. You may still play our free play games'
  //       );
  //     }
  //   }

  if (message !== '') {
    // console.log('message: ' + message);

    return (
      <div
        style={{
          color: 'white',
          textAlign: 'center',
          padding: '13px 0',
          fontSize: '18px',
          fontWeight: 500,
          backgroundColor: 'red',
          height: '45px',
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
