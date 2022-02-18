import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';
import { Button } from 'semantic-ui-react';
import { GlobalContext } from '@/store';
import Fetch, { API_BASE_URL } from 'common/Fetch';
import call from 'common/API';
import Aux from 'components/_Aux';
import { useMediaQuery } from 'hooks';
import ModalLoginTop from 'components/modal/ModalLoginTop';
import styles from './ButtonConnect.module.scss';
import Global from 'components/Constants';
import Web3 from 'web3';
import WalletConnectProvider from '@walletconnect/web3-provider';

export const assignToken = async (dispatch, accountSwitch = false) => {
  // Clear token and expiretime to be safe
  localStorage.removeItem('token');
  localStorage.removeItem('expiretime');

  console.log('Getting new access token...');

  const userAddress = window.ethereum?.selectedAddress;

  if (userAddress && document.visibilityState === 'visible') {
    const timestamp = Date.now();

    const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

    const msg = web3.utils.utf8ToHex(`Decentral Games Login\nTimestamp: ${timestamp}`);
    const signature = await web3.eth.personal.sign(msg, window.ethereum?.selectedAddress, null);

    const token = await call(`${API_BASE_URL}/authentication/getWebAuthToken?address=${userAddress}&signature=${signature}&timestamp=${timestamp}`, 'GET', false);

    localStorage.setItem('token', token);

    // Token expires 12 hours and 1 seconds from time it's set
    localStorage.setItem('expiretime', Number(timestamp / 1000 + 12 * 3600));

    dispatch({
      type: 'set_userLoggedIn',
      data: true
    });

    if (accountSwitch) {
      window.location.reload();
    }
  }
};

const ButtonConnect = props => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');
  const [binance, setBinance] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  let listener = null;

  useEffect(() => {
    if (window.ethereum && window.ethereum?.selectedAddress) {
      window.addEventListener('load', function () {
        window.ethereum.on('accountsChanged', () => {
          if (window.ethereum?.selectedAddress) {
            dispatch({
              type: 'user_address',
              data: window.ethereum?.selectedAddress
            });
          }

          assignToken(dispatch, true);
        });
      });
    } else {
      // User doesn't have MetaMask installed, clear token
      localStorage.removeItem('token');
      localStorage.removeItem('expiretime');
    }

    if (router.pathname.includes('binance')) {
      setBinance(true);
    } else {
      setBinance(false);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    listener = document.addEventListener('scroll', () => {
      const scrolled = document.scrollingElement.scrollTop;

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

    setLoading(false);
  });

  const getWalletConnectProvider = () => {
    return new WalletConnectProvider({
      rpc: Global.constants.MATIC_RPC,
      chainId: Global.constants.MATIC_CHAIN_ID,
      qrcodeModalOptions: {
        mobileLinks: ['rainbow', 'metamask', 'ledger', 'argent', 'trust']
      }
    });
  };

  const connectMobileWallet = async dispatch => {
    window.localStorage.removeItem('walletconnect');
    const provider = getWalletConnectProvider();
    provider.updateRpcUrl(Global.constants.MATIC_CHAIN_ID);
    const web3 = new Web3(provider);
    dispatch({
      type: 'web3_provider',
      data: web3
    });

    provider.on('accountsChanged', async accounts => {
      const address = accounts[0];
      console.log('Wallet connected:', address);

      // dispatch({
      //   type: 'update_status',
      //   data: 2,
      // });
      updateStatus(4, true);
    });

    try {
      await provider.enable();
    } catch {
      console.log('Error connecting to wallet');
    }
  };

  const connectDesktopWallet = async dispatch => {
    if (metamaskEnabled) {
      // the only way to be able to click on this button with a user status >= 4 is to have clicked in the "disconnect" button in ModalPopUp
      if (state.userStatus >= 4) {
        // will re-prompt to select an account, even if metamask is already enabled in the site
        // works for users that are "disconnected" but want to switch accounts
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      } else {
        // otherwise do the usual
        await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      }

      userAddress = window.ethereum?.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress
      });

      await assignToken(dispatch);

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress
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
  };

  const connectWallet = async dispatch => {
    if (window.ethereum) {
      // dispatch({
      //   type: 'update_status',
      //   data: 3,
      // });
      connectDesktopWallet(dispatch);
    } else {
      connectMobileWallet(dispatch);
    }
  };

  async function openMetaMask() {
    if (metamaskEnabled) {
      // open MetaMask for login then get the user's wallet address

      // the only way to be able to click on this button with a user status >= 4 is to have clicked in the "disconnect" button in ModalPopUp
      if (state.userStatus >= 4) {
        // will re-prompt to select an account, even if metamask is already enabled in the site
        // works for users that are "disconnected" but want to switch accounts
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      } else {
        // otherwise do the usual
        await window.ethereum.request({
          method: 'eth_requestAccounts',
          params: [
            {
              eth_accounts: {}
            }
          ]
        });
      }

      userAddress = window.ethereum?.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress
      });

      await assignToken(dispatch);

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress
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

      // update user status in database
      await Fetch.REGISTER(state.affiliateAddress);

      // update global state user status after fetch is complete
      dispatch({
        type: 'update_status',
        data: value
      });
    } else {
      // update global state user status immediately
      dispatch({
        type: 'update_status',
        data: value
      });
    }

    // user will be updated either way, but only if response is truthy (line 150)
    dispatch({
      type: 'set_userLoggedIn',
      data: true
    });
  }

  async function upateVerified(arg) {
    if (arg > 0 && arg < 20 && window.location.hostname.includes(Global.CONSTANTS.VERIFY_URL)) {
      dispatch({
        type: 'user_verify',
        data: false
      });
    }
  }

  async function getUserStatus() {
    console.log('Get user status: ButtonConnect');

    try {
      const jsonStatus = await Fetch.USER_STATUS(userAddress, '');

      await upateVerified(jsonStatus.status);

      if (jsonStatus?.status == undefined || jsonStatus.status == -1) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: ButtonConnect');

      return false;
    }
  }

  const tablet = useMediaQuery('(max-width: 992px)');
  const isPhone = useMediaQuery('(min-width: 600px)');

  return (
    <Aux>
      {props.showAlternateButton ? (
        // eslint-disable-next-line react/react-in-jsx-scope
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
            marginLeft: '4px'
          }}
        >
          Connect
        </Button>
      ) : metamaskEnabled ? (
        // eslint-disable-next-line react/react-in-jsx-scope
        <div className={styles.main_right_panel}>
          <Button
            color="blue"
            className={cn(
              // AMNESIA_COMMENT: amnesia_button class should be removed after we are done with amnesia
              state.isAmnesiaPage && styles.amnesia_button,
              styles.metamask_button,
              binance ? styles.binance_top : ''
            )}
            // onClick={() => openMetaMask()}
            onClick={() => {
              connectWallet(dispatch);
            }}
          >
            <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" className={styles.metamask_icon} />
            {tablet ? 'Connect' : 'Connect MetaMask'}
          </Button>
          {isPhone && (
            <a href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask" target="_blank" className={styles.get_metamask} rel="noreferrer">
              ?
            </a>
          )}
        </div>
      ) : (
        <div className={styles.main_right_panel}>
          <ModalLoginTop />

          {/* Help Button */}
          {isPhone && (
            <a href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask" target="_blank" className={styles.get_metamask} rel="noreferrer">
              ?
            </a>
          )}
        </div>
      )}
    </Aux>
  );
};

export default ButtonConnect;
