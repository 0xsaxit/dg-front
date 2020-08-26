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
        'Use Chrome browser with MetaMask enabled to play'
      );
    } else if (state.networkID !== 5) {
      setMessage('Decentral Games is currently in beta. Please switch MetaMask to Goerli Network.'); // Ethereum Mainnet
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
