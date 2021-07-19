import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from 'store';
import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react';
import Fetch from 'common/Fetch';
import Aux from 'components/_Aux';
import ModalLoginTop from 'components/modal/ModalLoginTop';

import styles from './ButtonConnect.module.scss';

const ButtonConnect = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [binance, setBinance] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  let menuStyle = [];
  let listener = null;

  useEffect(() => {
    if (router.pathname.includes('binance')) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    listener = document.addEventListener('scroll', e => {
      let scrolled = document.scrollingElement.scrollTop;
      if (scrolled >= 10) {
        if (scrollState !== 'amir') {
          setScrollState('amir');
        }
      } else {
        if (scrollState !== 'top') {
          setScrollState('top');
        }
      }
    });

    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, [scrollState]);

  if (scrollState == 'top') {
    menuStyle = ['get_metamask'];
  } else {
    menuStyle = ['get_metamask_scroll'];
  }

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  const openMetaMask = async () => {
    if (metamaskEnabled) {
      // open MetaMask for login then get the user's wallet address
      await window.ethereum.enable();
      userAddress = window.ethereum.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress,
      });

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress,
      });

      // set global user status based on value stored in database
      // if new wallet update user status to 4 both locally and in the database
      // (/websiteLogin API call will return error with new wallet address)
      const response = await getUserStatus();

      if (response) {
        updateStatus(response, false);
      } else {
        updateStatus(4, true);
      }
    }
  }

  const updateStatus = async (value, post) => {
    if (post) {
      console.log('Posting user status to db: ' + value);

      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      // update user status in database
      await Fetch.REGISTER(userAddress, '', state.affiliateAddress);

      // update global state user status after fetch is complete
      dispatch({
        type: 'update_status',
        data: value,
      });
    } else {
      // update global state user status immediately
      dispatch({
        type: 'update_status',
        data: value,
      });
    }
  }

  const getUserStatus = async () => {
    console.log('Get user status: Connect');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      const responseStatus = await Fetch.USER_STATUS(userAddress, '');
      const jsonStatus = await responseStatus.json();

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Connect');

      return false;
    }
  }

  return (
    <Aux>
      {metamaskEnabled ? (
        <span>
          <a
            href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
            target="_blank"
            className={menuStyle[0]}
            id="need-help-text"
            style={{ color: 'rgba(255, 255, 255)' }}
          >
            Need help?
          </a>
          <Button
            color="blue"
            className={
              binance ? styles.binanace_top : styles.metamask_button
            }
            onClick={() => openMetaMask()}
          >
            <span>
              <img
                className={styles.open_metamask_img}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
              />
              Connect Metamask
            </span>
          </Button>
          <Button
            color="blue"
            className={
              binance
                ? styles.binanace_top
                : styles.metamask_mobile_button
            }
            onClick={() => openMetaMask()}
          >
            <span>Connect</span>
          </Button>
        </span>
      ) : (
        <ModalLoginTop />
      )}
    </Aux>
  );
};

export default ButtonConnect;
