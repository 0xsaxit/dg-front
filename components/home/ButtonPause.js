import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';

function ButtonPause(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isPaused, setIsPaused] = useState(false);
  const [pauseContract, setPauseContract] = useState('');

  let web3 = {};
  let maticWeb3 = {};

  useEffect(() => {
    setIsPaused(props.isPaused);
  }, [props.isPaused]);

  useEffect(() => {
    if (state.userStatus) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async function () {
        if (!isPaused) {
          if (pauseContract === 'pause') {
            const txHash = await Global.pauseContract(true, web3);

            if (txHash) {
              console.log('Pause tx hash: ' + txHash);

              // start querying the treasury contract for paused status
              props.dataInterval();
            }
          }
        } else {
          if (pauseContract === 'unpause') {
            const txHash = await Global.pauseContract(false, web3);

            if (txHash) {
              console.log('Unpause tx hash: ' + txHash);

              // start querying the treasury contract for paused status
              props.dataInterval();
            }
          }
        }
      })();
    }
  }, [state.userStatus, isPaused, pauseContract]);

  if (!isPaused) {
    return (
      <Button
        className="account-connected-play-button"
        onClick={() => setPauseContract('pause')}
      >
        PAUSE GAMES
      </Button>
    );
  } else {
    return (
      <Button
        className="account-connected-play-button"
        onClick={() => setPauseContract('unpause')}
      >
        UNPAUSE GAMES
      </Button>
    );
  }
}

export default ButtonPause;
