import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Global from '../Constants';
import Transactions from '../../common/Transactions';

function ButtonPause(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isPaused, setIsPaused] = useState(false);
  const [pauseContract, setPauseContract] = useState('');
  const [web3, setWeb3] = useState({});

  useEffect(() => {
    setIsPaused(props.isPaused);
  }, [props.isPaused]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      (async function () {
        if (!isPaused) {
          if (pauseContract === 'pause') {
            const txHash = await pauseUnpause(true);
            console.log('Pause tx hash: ' + txHash);

            // start querying the treasury contract for paused status
            if (txHash) props.dataInterval();
          }
        } else {
          if (pauseContract === 'unpause') {
            const txHash = await pauseUnpause(false);
            console.log('Unpause tx hash: ' + txHash);

            // start querying the treasury contract for paused status
            if (txHash) props.dataInterval();
          }
        }
      })();
    }
  }, [state.userStatus, isPaused, pauseContract]);

  function pauseUnpause(toggle) {
    return new Promise(async (resolve, reject) => {
      if (toggle) {
        console.log('Pause all games registered to Treasury contract');
      } else {
        console.log('Unpause all games registered to Treasury contract');
      }

      try {
        const parentContract = await Transactions.treasuryContract(web3);

        if (toggle) {
          parentContract.pause(
            {
              gasLimit: web3.toHex(Global.CONSTANTS.GAS_LIMIT),
              gasPrice: web3.toHex(Global.CONSTANTS.GAS_AMOUNT),
            },
            async function (err, hash) {
              if (err) {
                console.log('Pause failed: ' + err);
                reject(false);
              }

              resolve(hash);
            }
          );
        } else {
          parentContract.unpause(
            {
              gasLimit: web3.toHex(Global.CONSTANTS.GAS_LIMIT),
              gasPrice: web3.toHex(Global.CONSTANTS.GAS_AMOUNT),
            },
            async function (err, hash) {
              if (err) {
                console.log('Unpause failed: ' + err);
                reject(false);
              }

              resolve(hash);
            }
          );
        }
      } catch (error) {
        console.log('Pause or unpause status error: ' + error);
      }
    });
  }

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
