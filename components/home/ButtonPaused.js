import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';

// import Web3 from 'web3';

import { Button } from 'semantic-ui-react';
import Global from '../Constants';

function ButtonPaused(props) {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [paused, setPaused] = useState('');

  let web3 = {};
  let maticWeb3 = {};

  useEffect(() => {
    if (state.userStatus) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      maticWeb3 = new Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object

      console.log('paused...');
      console.log(props.isPaused);

      console.log('paused');
      console.log(paused);

      if (!props.isPaused) {
        if (paused === 'pause') Global.pauseContract(true, web3);
      } else {
        if (paused === 'unpause') Global.pauseContract(false, web3);
      }
    }
  }, [state.userStatus, props.isPaused, paused]);

  if (!props.isPaused) {
    return (
      <Button
        className="account-connected-play-button"
        onClick={() => setPaused('pause')}
      >
        PAUSE GAMES
      </Button>
    );
  } else {
    return (
      <Button
        className="account-connected-play-button"
        onClick={() => setPaused('unpause')}
      >
        UNPAUSE GAMES
      </Button>
    );
  }
}

export default ButtonPaused;
