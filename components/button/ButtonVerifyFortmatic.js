import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button, Image } from 'semantic-ui-react';
import Fetch from '../../common/Fetch';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

const ButtonVerifyFortmatic = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  async function openFortmatic() {

    const fm = new Fortmatic('pk_live_C9EC08967C16ABA1');
    window.web3 = new Web3(fm.getProvider());

    web3.eth.getCoinbase((error, coinbase) => {
      if (error) throw error;
      userAddress = coinbase.toLowerCase();
    });
    
    // open MetaMask for login then get the user's wallet address
    await web3.currentProvider.enable();

    console.log('???');
    console.log(userAddress);
    console.log(fm.getProvider());


    // dispatch wallet provider as metmask
    dispatch({
      type: 'update_provider',
      data: fm.getProvider(), // something like this
    })

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
      <div className="wallet-card" onClick={() => openFortmatic()}>
        <span style={{ display: 'flex' }}>
          <Image 
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1615581511/spaces_-Lj7HukBJLlR6jbx0-eP_avatar_y2ijet.png" 
            className="wallet-image-2"
          />
          <span>
            <h3 className="wallet-h3"> Fortmatic </h3>
            <p> Using your email address </p>
          </span>
        </span>
      </div>
    </span>
  );
};

export default ButtonVerifyFortmatic;