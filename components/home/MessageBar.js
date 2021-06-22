import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from '../../store';
import Global from '../Constants';

const MessageBar = () => {
  // get user's network, location, and active status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [message, setMessage] = useState('');
  const [isMobile, setMobile] = useState(false);
  const [pause, setPause] = useState(false);

  let isSafari = false;
  let web3 = {};

  useEffect(() => {
    let timer = setTimeout(() => setPause(true), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      isSafari = true;
    }
  }, []);

  useEffect(() => {
    if (typeof window.orientation !== 'undefined') {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [isMobile]);

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

  useEffect(() => {
    if (isSafari) {
      setMessage('Please use Brave, Chrome, or Firefox to play games');
    } else if (state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID) {
      setMessage('Please switch your Network to Ethereum Mainnet');
    } else if (pause && !state.userInfo.tokenArray.includes(true)) {
      setMessage(
        `Make sure you've enabled cypto gameplay on your account page`
      );
    } else if (!state.activeStatus) {
      setMessage(
        'To ensure the security of your funds, a reauthorization signature is required after 12 dormant hours'
      );
    } else {
      setMessage('');
    }
  }, [
    isSafari,
    state.networkID,
    state.userStatus,
    state.activeStatus,
    state.userInfo,
  ]);

  if (state.userStatus === 3) {
    return null;
  } else if (message !== '') {
    return (
      <div
        id="message-bar"
        className="mobile-message-bar"
        style={{
          fontFamily: 'Larsseit-Regular',
          color: 'white',
          textAlign: 'center',
          padding: '10px 30px 9px 30px',
          fontSize: '14px',
          letterSpacing: '0.5px',
          fontWeight: 500,
          backgroundColor: '#006EFF',
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
