import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';

const MessageBar = () => {
  // get user's network, location, and active status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = useState('');

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
        'You must use Chrome browser with MetaMask enabled to play our games'
      );
    } else if (state.networkID !== 5) {
      setMessage('Please switch MetaMask to Goerli Network'); // Ethereum Mainnet
    } else if (!state.location) {
      setMessage(
        'You must reside in a whitelisted jurisdiction to play games with crypto. You may still play our free play games'
      );
    } else if (!state.activeStatus) {
      setMessage(
        'To ensure the security of your funds, we require a reauthorization signature after 12 dormant hours'
      );
    } else {
      setMessage('');
    }
  }, [state.networkID, state.location, state.activeStatus]);

  if (message !== '') {
    return (
      <div
        style={{
          fontFamily: 'Graphik, sans-serif',
          color: '#cc0000',
          textAlign: 'center',
          padding: '13px 0',
          fontSize: '17px',
          fontWeight: 500,
          backgroundColor: '#dddddd',
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
