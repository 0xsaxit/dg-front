import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Fetch from '../../common/Fetch';
import Aux from '../_Aux';

const ButtonPlayNow = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

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

  async function getUserStatus() {
    console.log('Get user status: Play Now');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      const responseStatus = await Fetch.USER_STATUS(userAddress, '');
      const jsonStatus = await responseStatus.json();

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Play Now');

      return false;
    }
  }

  return (
    <Aux>
      {metamaskEnabled ? (
        <Button
          content="PLAY NOW"
          color="blue"
          className="play-button verify"
          style={{ padding: '0 0 0 0' }}
          onClick={() => openMetaMask()}
        />
      ) : null}
    </Aux>
  );
};

export default ButtonPlayNow;