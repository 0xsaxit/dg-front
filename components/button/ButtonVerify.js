import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Fetch from '../../common/Fetch';

const ButtonVerify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');

  let menuStyle = [];
  let listener = null;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    listener = document.addEventListener('scroll', (e) => {
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
    menuStyle = [
      'get-metamask'
    ];
  } else {
    menuStyle = [
      'get-metamask-scroll',
    ];
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

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress,
      });

      // set global user status based on value stored in database
      // if new wallet update user status to 4 both locally and in the database
      // (/verifyAddress API call will return error with new wallet address)
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
      await Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);

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
    try {
      const response = await Fetch.USER_STATUS(userAddress);
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        const stepValue = parseInt(json.result);
        return stepValue;
      }
    } catch {
      console.log('Unregistered wallet: Verify');

      return 0;
    }
  }

  return (
    <span>
      {metamaskEnabled ? (
        <span className="right-menu-items">
          <a 
            href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
            target="_blank"
            className={menuStyle[0]}
          > 
            What's Metamask?
          </a>
          <Button
            content="CONNECT METAMASK"
            color="blue"
            className="metamask-button"
            onClick={() => openMetaMask()}
          />
          <Button
            content="CONNECT"
            color="blue"
            className="metamask-mobile-button"
            id="balances-padding-correct"
            onClick={() => openMetaMask()}
          />
        </span>
      ) : null}
    </span>
  );
};

export default ButtonVerify;
