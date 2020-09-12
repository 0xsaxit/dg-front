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

              // setIsPaused(true);

              // start querying the treasury contract for paused status
              props.dataInterval(false);
            }
          }
        } else {
          if (pauseContract === 'unpause') {
            const txHash = await Global.pauseContract(false, web3);

            if (txHash) {
              console.log('Un-pause tx hash: ' + txHash);

              // setIsPaused(false);

              // start querying the treasury contract for paused status
              props.dataInterval(true);
            }
          }
        }
      })();
    }
  }, [state.userStatus, isPaused, pauseContract]);

  // function dataInterval(currentStatus) {
  //   maticWeb3 = new Web3(
  //     new window.Web3.providers.HttpProvider(Global.MATIC_URL)
  //   ); // pass Matic provider to maticWeb3 object

  //   const treasuryContract = Global.getTreasuryContract(maticWeb3);

  //   async function fetchData() {
  //     const response = await treasuryContract.methods.paused().call();

  //     // as soon as the balance updates on Matic display deposit confirmation
  //     if (response !== currentStatus) {
  //       console.log('Treasury contract pause status: ' + response);

  //       setIsPaused(response);

  //       clearInterval(interval);
  //     }
  //   }

  //   // call token contract every 3 seconds to get new balances
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 3000);

  //   return () => clearInterval(interval);
  // }

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
