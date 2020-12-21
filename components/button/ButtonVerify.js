import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Fetch from '../../common/Fetch';

const ButtonVerify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  // const [userAddress, setUserAddress] = useState('');

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
      // open MataMask for login then get the user's wallet address

      await window.ethereum.enable();
      // await window.eth_requestAccounts();

      userAddress = window.web3.currentProvider.selectedAddress;
      // setUserAddress(userAddress);

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
      console.log('Unregistered wallet');

      return 0;
    }
  }

  return (
    <span>
      {metamaskEnabled ? (
        <span className="right-menu-items">
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
