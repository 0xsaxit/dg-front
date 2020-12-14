import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Fetch from '../../common/Fetch';

const ButtonVerify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

  // define local variables
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

      // set global user status based on value stored in database. if no value present
      // update user status to 4 both locally and in the database
      const response = await getUserStatus();

      if (response) {
        updateStatus(response, false);
      } else {
        updateStatus(4, true);
      }
    }
  }

  function updateStatus(value, post) {
    // update global state user status
    dispatch({
      type: 'update_status',
      data: value,
    });

    // update user status in database
    if (post) {
      console.log('Posting user status to db: ' + value);

      Fetch.USER_VERIFY(userAddress, value, state.affiliateAddress);
    }
  }

  async function getUserStatus() {
    const response = await Fetch.USER_STATUS(userAddress);
    const json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        return false;
      }

      const stepValue = parseInt(json.result);
      return stepValue;
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
