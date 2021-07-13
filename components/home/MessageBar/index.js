import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from 'store';
import Global from 'components/Constants';

import styles from './MessageBar.module.scss';

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
    if (window.innerWidth < 499) {
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
    } else if (isMobile) {
       setMessage('Please configure metamask on a desktop browser');
    } else if (!isMobile && state.networkID !== Global.CONSTANTS.PARENT_NETWORK_ID) {
      setMessage('Please switch your Network to Ethereum Mainnet');
    } else if (!isMobile && pause && !state.userInfo.tokenArray.includes(true)) {
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
      <div className={styles.mobile_message_bar} id="message-bar">
        {message}
      </div>
    );
  } else {
    return null;
  }
};

export default MessageBar;
