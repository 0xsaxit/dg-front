import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import { Button } from 'semantic-ui-react';
import Fetch, { API_BASE_URL } from 'common/Fetch';
import call from 'common/API';
import Aux from '../_Aux';
import ModalLoginTop from '../modal/ModalLoginTop';

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
      `${API_BASE_URL}/authentication/getWebAuthToken?address=${userAddress}&signature=${signature}&timestamp=${timestamp}`,
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

const ButtonStartConnect = () => {
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
    if (window.ethereum && window.ethereum.selectedAddress) {
      window.ethereum.on('accountsChanged', () => {
        assignToken();
      });

      const currentTimestamp = new Date().getTime() / 1000;
      const expiredTimestamp =
        Number(localStorage.getItem('expiretime')) || Number.MAX_SAFE_INTEGER;

      if (currentTimestamp > expiredTimestamp) {
        assignToken();
      }
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

  if (scrollState == 'top') {
    menuStyle = ['get-metamask'];
  } else {
    menuStyle = ['get-metamask-scroll'];
  }

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

      const currentTimestamp = new Date().getTime() / 1000;
      const expiredTimestamp =
        Number(localStorage.getItem('expiretime')) || Number.MAX_SAFE_INTEGER;

      if (
        !localStorage.getItem('token') ||
        currentTimestamp > expiredTimestamp
      ) {
        assignToken();
      }

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

  async function updateStatus(value, post) {
    if (post) {
      console.log('Posting user status to db: ' + value);

      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.;

      // update user status in database
      await Fetch.REGISTER(state.affiliateAddress);

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
    console.log('Get user status: ButtonStartConnect');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.;

      const jsonStatus = await Fetch.USER_STATUS(userAddress, '');

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: ButtonStartConnect');

      return false;
    }
  }

  return (
    <Aux>
      <Button
        onClick={() => openMetaMask()}
        style={{
          background: '#006EFF',
          height: '64px',
          borderRadius: '16px',
          width: '171px',
          color: 'white',
          fontSize: '23px',
          fontFamily: 'Larsseit-Bold',
          alignSelf: 'center',
          marginLeft: '4px',
        }}
      >
        Connect
      </Button>
    </Aux>
  );
};

export default ButtonStartConnect;
