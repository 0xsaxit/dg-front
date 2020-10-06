import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import ABI_TREASURY_CONTRACT from '../ABI/ABITreasury';
import Global from '../Constants';

function ButtonPause(props) {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isPaused, setIsPaused] = useState(false);
  const [pauseContract, setPauseContract] = useState('');

  let web3 = {};
  let contractAddress = {};

  useEffect(() => {
    setIsPaused(props.isPaused);
  }, [props.isPaused]);

  useEffect(() => {
    if (state.userStatus) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async function () {
        const addresses = await Global.API_ADDRESSES;
        contractAddress = addresses.TREASURY_CONTRACT_ADDRESS;

        if (!isPaused) {
          if (pauseContract === 'pause') {
            const txHash = await pauseUnpause(true, web3);
            console.log('Pause tx hash: ' + txHash);

            // start querying the treasury contract for paused status
            if (txHash) props.dataInterval();
          }
        } else {
          if (pauseContract === 'unpause') {
            const txHash = await pauseUnpause(false, web3);
            console.log('Unpause tx hash: ' + txHash);

            // start querying the treasury contract for paused status
            if (txHash) props.dataInterval();
          }
        }
      })();
    }
  }, [state.userStatus, isPaused, pauseContract]);

  function pauseUnpause(toggle, web3Default) {
    return new Promise(async (resolve, reject) => {
      if (toggle) {
        console.log('Pause all games registered to Treasury contract');
      } else {
        console.log('Unpause all games registered to Treasury contract');
      }

      try {
        const PARENT_CONTRACT = web3Default.eth
          .contract(ABI_TREASURY_CONTRACT)
          .at(contractAddress);

        if (toggle) {
          PARENT_CONTRACT.pause(
            {
              gasLimit: web3Default.toHex(Global.CONSTANTS.GAS_LIMIT),
              gasPrice: web3Default.toHex(Global.CONSTANTS.GAS_AMOUNT),
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
          PARENT_CONTRACT.unpause(
            {
              gasLimit: web3Default.toHex(Global.CONSTANTS.GAS_LIMIT),
              gasPrice: web3Default.toHex(Global.CONSTANTS.GAS_AMOUNT),
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
