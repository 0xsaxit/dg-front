import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Divider } from 'semantic-ui-react';
import Web3 from 'web3';
import Link from 'next/link';
import ContentAdmin from '../content/ContentAdmin';
import Global from '../Constants';
import Transactions from '../../common/Transactions';

const Administration = (props) => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [dataPage, setDataPage] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [parentContract, setParentContract] = useState({});
  const [instances, setInstances] = useState(false);

  const dataType = props.dataType;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.dataType === 'balances') {
      setDataPage(state.adminBalances);
    } else if (props.dataType === 'users') {
      setDataPage([
        ['0x6ecf85221e1552b0592e82cbc2635097a3db273f', 'Chelep#273f', 4],
        ['0x847b811535be2b81f353394c46634c35410106e1', 'Jack#06e1', 18],
        ['0x1c183b78b4891b855c467e5866dad94a6a520eb5', 'adamsun#0eb5', 12],
      ]);
    }
  }, [state.adminBalances]);

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

  // get treasury contract's paused status (true or false)
  useEffect(() => {
    if (instances) {
      (async () => {
        const pauseStatus = await parentContract.methods.paused().call();
        setIsPaused(pauseStatus);

        console.log('Pause status: ' + pauseStatus);
      })();
    }
  }, [instances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // ping the treasury contract for pause status
  async function dataInterval() {
    async function fetchData() {
      const response = await parentContract.methods.paused().call();

      console.log('Response status: ' + response);
      console.log('Current status: ' + isPaused);

      if (response !== isPaused) {
        // display the pause status confirmation
        if (!response) {
          dispatch({
            type: 'token_pings',
            data: 5,
          });
        } else {
          dispatch({
            type: 'token_pings',
            data: 6,
          });
        }

        // change the button type (pause or unpause)
        setIsPaused(response);
        console.log('Pause status (updated): ' + response);

        clearInterval(interval);
      }
    }

    // call token contract every 1 second to get new pause status
    const interval = setInterval(() => {
      fetchData();
    }, 1000);

    return () => clearInterval(interval);
  }

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
                  USER STATUS LIST
                </b>
              </span>
            ) : (
              <Link href="/admin/users">
                <span className="account-hover">
                  <b style={{ marginRight: '4px', paddingTop: '1px' }}>
                    USER STATUS LIST
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
                  data={dataPage}
                  ethBalance={state.ethBalance}
                  adminBalances={state.adminBalances}
                  isPaused={isPaused}
                  dataInterval={dataInterval}
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
