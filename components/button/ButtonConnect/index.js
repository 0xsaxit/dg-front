import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Fetch from 'common/Fetch';
import call from 'common/API';
import Aux from 'components/_Aux';
import ModalLoginTop from 'components/modal/ModalLoginTop';

import styles from './ButtonConnect.module.scss';

const assignToken = async () => {
  const userAddress = window.ethereum.selectedAddress;
  if (userAddress) {
    const timestamp = Date.now();

    const msg = window.web3.utils.utf8ToHex(
      `Decentral Games Login\nTimestamp: ${timestamp}`
    );
    const signature = await window.web3.eth.personal.sign(
      msg,
      window.ethereum.selectedAddress,
      null
    );

    const token = await call(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/getWebAuthToken?address=${userAddress}&signature=${signature}&timestamp=${timestamp}`,
      'GET',
      false
    );

    localStorage.setItem('token', token);
    localStorage.setItem(
      'expiretime',
      Number(new Date().getTime() / 1000 + 12 * 3600)
    );
  }
};

const ButtonConnect = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [binance, setBinance] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();
  let listener = null;

  useEffect(() => {
    if (window.ethereum && window.ethereum.selectedAddress) {
      window.ethereum.on('accountsChanged', () => {
        assignToken();
      });

      const currentTimestamp = new Date().getTime() / 1000;
      const expiredTimestamp =
        Number(localStorage.getItem('expiretime')) || Number.MAX_SAFE_INTEGER;

      if (currentTimestamp > expiredTimestamp) {
        openMetaMask();
      }
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('expiretime');
    }

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

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  async function openMetaMask() {
    if (metamaskEnabled) {
      // open MetaMask for login then get the user's wallet address
      await window.ethereum.enable();
      userAddress = window.ethereum.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress,
      });

      await assignToken();

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress,
      });

      // set global user status based on value stored in database
      // if new wallet update user status to 4 both locally and in the database
      // (/websiteLogin API call will return error with new wallet address)
      const response = await getUserStatus();

      console.log('!!!!');
      console.log(response);

      if (response) {
        updateStatus(response, false);
      } else {
        updateStatus(4, true);
      }
    }
  }

  async function updateStatus(value, post) {
    if (post) {
      console.log('Posting user status to db: ' + value);

      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.;

      // update user status in database
      await Fetch.REGISTER(userAddress, '', state.affiliateAddress);
      console.log('????');
      console.log(state.affiliateAddress);

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

  async function getUserStatus() {
    console.log('Get user status: Connect');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.;

      const jsonStatus = await Fetch.USER_STATUS(userAddress, '');

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
        <span className={styles.main_right_panel}>
          <Button
            color="blue"
            className={cn(
              styles.metamask_button,
              binance ? styles.binance_top : ''
            )}
            onClick={() => openMetaMask()}
          >
            <img
              src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
              className={styles.metamask_icon}
            />
            Connect Metamask
          </Button>
          <a
            href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
            target="_blank"
            className={styles.get_metamask}
          >
            ?
          </a>
        </span>
      ) : (
        <ModalLoginTop />
      )}
    </Aux>
  );
};

export default ButtonConnect;