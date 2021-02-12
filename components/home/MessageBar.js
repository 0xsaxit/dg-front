import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { useRouter } from 'next/router';
import { GlobalContext } from '../../store';
import Global from '../Constants';

const MessageBar = () => {
  // get user's network, location, and active status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = useState('');
  const [adminError, setAdminError] = useState(false);

  let isSafari = false;
  let web3 = {};
  const router = useRouter();

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      isSafari = true;
    }
  }, []);

  // get network ID
  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async () => {
        const networkID = await web3.eth.net.getId();

        dispatch({
          type: 'network_id',
          data: networkID,
        });
      })();
    }
  }, []);

  // notify admins to switch to Matic Network
  useEffect(() => {
    if (router.pathname === '/admin') {
      if (state.networkID !== Global.CONSTANTS.MATIC_NETWORK_ID) {
        setAdminError(true);
      } else {
        setAdminError(false);
      }
    }
  }, [state.networkID]);

  const account = <a href="/account"> here </a>;

  useEffect(() => {
    if (isSafari) {
      setMessage('Please use Brave, Chrome or Firefox to play games');
    } else if (!state.networkID) {
      setMessage('Please enable MetaMask to play games, for help, click "Get Started"');
    } else if (!state.userStatus) {
      setMessage('Please log in to MetaMask to play games, for help, click "Get Started"');
    } else if (adminError) {
      setMessage(
        'You must switch to Matic Network to deposit and withdraw funds'
      );
    } else if (state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID) {
      setMessage('Please switch your MetaMask Network to Ethereum Mainnet');

      // } else if (!state.userStatus === 4) {
      //   setMessage(
      //     'You must reside in a whitelisted jurisdiction to play games with crypto. You may still play free play games.'
      //   );
    } else if (state.userStatus === 4) {
      setMessage(
        `Need help? Click "Get Started". Make sure you've enabled MANA and DAI gameplay in your account!`
      );
    } else if (!state.activeStatus) {
      setMessage(
        'To ensure the security of your funds, a reauthorization signature is required after 12 dormant hours'
      );
    } else if (state.userStatus === 6) {
      setMessage(
        'You must authorize the MANA token contract on your account page to play games with MANA'
      );
    } else if (state.userStatus === 7) {
      setMessage(
        'You must authorize the DAI token contract on on your account page to play games with DAI'
      );
    } else {
      setMessage('');
    }
  }, [
    isSafari,
    state.networkID,
    state.userStatus,
    adminError,
    state.activeStatus,
  ]);

  if (state.userStatus === 3) {
    return null;
  } else if (message !== '') {
    return (
      <div
        id="message-bar"
        className="mobile-message-bar"
        style={{
          fontFamily: 'Montserrat, sans-serif',
          color: 'white',
          textAlign: 'center',
          padding: '10px 30px 9px 30px',
          fontSize: '14px',
          letterSpacing: '0.5px',
          fontWeight: 500,
          backgroundColor: '#2085f4',
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
