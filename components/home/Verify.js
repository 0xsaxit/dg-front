import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

const Verify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (window.web3) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false); 
    }
  })

  async function openMetaMask() {
    if (window.web3) {
      // open MataMask for login then get the user's wallet address
      await window.ethereum.enable();
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

      Global.FETCH.USER_VERIFY(userAddress, value);
    }
  }

  async function getUserStatus() {
    const response = await Global.FETCH.USER_STATUS(userAddress);
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
    <span className="right-menu-items outter">
      {metamaskEnabled ? 
        <span className="right-menu-items">
          <Button
            content="CONNECT METAMASK"
            color="blue"
            className="metamask-button"
            onClick={() => openMetaMask()}
          />
        </span>
      : <span className="right-menu-items">
          <Button
            content="CONNECT METAMASK"
            color="blue"
            className="metamask-button"
            onClick={() => openMetaMask()}
          />
        </span> }
    </span>
  );
};

export default Verify;
