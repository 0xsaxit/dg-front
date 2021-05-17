import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Divider } from 'semantic-ui-react';
import Web3 from 'web3';
import Link from 'next/link';
import ContentAdmin from '../content/ContentAdmin';
import Global from '../Constants';
import Transactions from '../../common/Transactions';

const Administration = (props) => {
  // get smart contract balances and user status' from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [ethBalance, setEthBalance] = useState(0);
  const [dataPage, setDataPage] = useState('');

  const [isPausedTreasury, setIsPausedTreasury] = useState(false);

  const [parentContract, setParentContract] = useState({});
  const [instances, setInstances] = useState(false);

  const dataType = props.dataType;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.dataType === 'balances') {
      setEthBalance(state.ethBalance);
      setDataPage(state.adminBalances);
    } else if (props.dataType === 'users') {
      setDataPage(state.usersList);
    }
  }, [state.ethBalance, state.adminBalances, state.usersList]);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // initialize maticWeb3 provider and create treasury contract instance
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      (async function () {
        const parentContract = await Transactions.treasuryContract(maticWeb3);
        setParentContract(parentContract);

        setInstances(true);
      })();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get treasury contract's and all games' paused status (true or false)
  // useEffect(() => {
  //   if (instances) {
  //     (async () => {
  //       const pauseStatusTreasury = await parentContract.methods
  //         .paused()
  //         .call();
  //       setIsPausedTreasury(pauseStatusTreasury);

  //       console.log('Pause status (Treasury): ' + pauseStatusTreasury);

  //       // const pauseStatusSlots = await parentContract.methods.paused().call();
  //       // setIsPausedSlots(pauseStatusSlots);

  //       console.log('Pause status (Treasury): ' + pauseStatusTreasury);
  //     })();
  //   }
  // }, [instances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // ping the treasury contract for pause status
  // async function dataInterval() {
  //   async function fetchData() {
  //     const responseTreasury = await parentContract.methods.paused().call();
  //     console.log('Response status: ' + responseTreasury);
  //     console.log('Current status: ' + isPausedTreasury);

  //     if (response !== isPausedTreasury) {
  //       // display the pause status confirmation
  //       // if (!response) {
  //       //   dispatch({
  //       //     type: 'token_pings',
  //       //     data: 5,
  //       //   });
  //       // } else {
  //       //   dispatch({
  //       //     type: 'token_pings',
  //       //     data: 6,
  //       //   });
  //       // }

  //       // change the button type (pause or unpause)
  //       setIsPaused(responseTreasury);
  //       console.log('Pause status (updated): ' + responseTreasury);

  //       clearInterval(interval);
  //     }
  //   }

  //   // call token contract every 1 second to get new pause status
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function topLinks() {
    return (
      <div className="account-other-tabs">
        <div style={{ marginLeft: '0px' }}>
          <p className="account-other-p">
            {dataType === 'balances' ? (
              <span className="account-hover active">
                <b style={{ marginRight: '4px', paddingTop: '1px' }}>
                  GAME BALANCES
                </b>
              </span>
            ) : (
              <Link href="/admin">
                <span className="account-hover">
                  <b style={{ marginRight: '4px', paddingTop: '1px' }}>
                    GAME BALANCES
                  </b>
                </span>
              </Link>
            )}

            {dataType === 'users' ? (
              <span className="account-hover active">
                <b style={{ marginRight: '4px', paddingTop: '1px' }}>
                  USERS LIST
                </b>
              </span>
            ) : (
              <Link href="/admin/users">
                <span className="account-hover">
                  <b style={{ marginRight: '4px', paddingTop: '1px' }}>
                    USERS LIST
                  </b>
                </span>
              </Link>
            )}
          </p>
        </div>

        <Divider className="tab-divider" />
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="page-container">
        <div className="account-other-inner-container">
          {topLinks()}

          <div id="tx-box-history-2">
            <table className="account-table">
              {dataPage ? (
                <ContentAdmin
                  content={dataType}
                  ethBalance={ethBalance}
                  data={dataPage}
                  // isPausedTreasury={isPausedTreasury}
                  // dataInterval={dataInterval}
                />
              ) : null}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Administration;
