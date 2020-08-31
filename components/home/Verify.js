import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

const Verify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [network, setNetwork] = useState(false);

  let userAddress = '';

  useEffect(() => {
    // updateStatus(1, false); // using Safari browser, set userStatus = 1

    if (window.safari !== undefined) {
      // updateNetwork(false); // MetaMask is not logged in, set networkID = 2
      updateStatus(1, false); // using Safari browser, set userStatus = 1
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      window.web3.version.getNetwork((err, network) => {
        const networkInt = parseInt(network);

        // console.log('network int');
        // console.log(networkInt);

        updateNetwork(networkInt);
      });
    }
  }, []);

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

  function updateNetwork(networkInt) {
    dispatch({
      type: 'network_id',
      data: networkInt,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function openMetaMask() {
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
    <span className="right-menu-items">
      <Button
        content="CONNECT METAMASK"
        color="blue"
        className="metamask-button"
        onClick={() => openMetaMask()}
      />
    </span>
  );
};

export default Verify;
