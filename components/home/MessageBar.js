import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';

const MessageBar = () => {
  // get user's network and location from the Context API store
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
        'You must login to MetaMask to play games with crypto. You may still play our free play games'
      );
    } else if (state.networkID !== 1) {
      setMessage('Please switch MetaMask to Ethereum Mainnet');
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
          color: '#cc0000',
          textAlign: 'center',
          padding: '10px 0',
          fontSize: '18px',
          fontWeight: 500,
          backgroundColor: '#cdcdcd',
          height: '40px',
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
