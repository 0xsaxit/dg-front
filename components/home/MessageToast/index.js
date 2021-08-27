import { useState, useEffect, useContext } from 'react';
import Web3 from 'web3';
import { GlobalContext } from '../../../store';
import Global from '../../Constants';
import styles from './MessageToast.module.scss';
import cn from 'classnames';

const MessageToast = (props) => {

  const [state, dispatch] = useContext(GlobalContext);
  const [message, setMessage] = useState('');
  const [isMobile, setMobile] = useState(false);
  const [pause, setPause] = useState(false);

  let isSafari = false;
  let web3 = {};
  const [show, setShow] = useState(false);

  const makeTimeout = () => {
      setShow(true);
      let timer = setTimeout(() => {
        setShow(false);
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
  }

  useEffect(() => {
    makeTimeout();

    if (window.safari !== undefined) {
      isSafari = true;
    }

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

    makeTimeout();
  }, []);

  useEffect(() => {
    if (state.dgWarningMsg) {
      setMessage('Transfer pending, Please remain on this page!');
      let timer = setTimeout(() => {
        setMessage('');
        dispatch({
          type: 'set_dgWarningMsg',
          data: false,
        });
      }, 1500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.dgWarningMsg]); 

  useEffect(() => {
    if (state.toastMessage!=='') {
      setMessage(state.toastMessage);
      setShow(true);

      let timer = setTimeout(() => {
        setMessage('');
        setShow(false);
        dispatch({
          type: 'show_toastMessage',
          data: '',
        });
      }, 5000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [state.toastMessage]);

  useEffect(() => {
    if (window.innerWidth < 499) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [isMobile]);

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
    // setMessage('');
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
        <div className={styles.container}>
            <div 
                className={
                    show ? 
                    cn(styles.message_bar_toast, styles.show) : 
                    cn(styles.message_bar_toast, styles.hide)
                }
            >
                <div className={styles.content}>
                    {message}
                </div>
            </div>
        </div>
    );
  } else {
    return null;
  }
};

export default MessageToast;
