import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Divider, Grid } from 'semantic-ui-react';
import Web3 from 'web3';
import Spinner from '../Spinner';
import ButtonPause from '../button/ButtonPause';
import ContentAdmin from '../content/ContentAdmin';
import Pagination from './Pagination';
import Aux from '../_Aux';
import Global from '../Constants';
import Transactions from '../../common/Transactions';

const Admin = () => {
  // get player/machine transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.adminHistory[0];
  const dataMachines = state.adminHistory[1];

  // define local variables
  const [maximumCount, setMaximumCount] = useState(0);
  const [dataType, setDataType] = useState('balances');
  const [dataPage, setDataPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  let maticWeb3 = {};
  let treasuryContract = {};

  useEffect(() => {
    if (state.userStatus) {
      const frameHeight = window.innerHeight;
      setMaximumCount(Math.floor(frameHeight * 0.01575));
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.transactions[0].length) {
      setIsLoading(false);
    }
  }, [state.transactions]);

  useEffect(() => {
    if (state.userStatus) {
      maticWeb3 = new Web3(
        new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object

      // get treasury contract's paused status (true or false)
      (async function () {
        treasuryContract = await Transactions.getTreasuryContract(maticWeb3);

        // console.log('treasury instance 1...');
        // console.log(treasuryContract);

        const pauseStatus = await treasuryContract.methods.paused().call();
        setIsPaused(pauseStatus);

        console.log('Pause status: ' + pauseStatus);
      })();
    }
  }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // ping the treasury contract for pause status
  async function dataInterval() {
    maticWeb3 = new Web3(
      new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
    ); // pass Matic provider to maticWeb3 object

    // const treasuryContract = Transactions.getTreasuryContract(maticWeb3);

    // console.log('treasury instance 2...');
    // console.log(treasuryContract);

    // (async function () {
    treasuryContract = await Transactions.getTreasuryContract(maticWeb3);
    // })();

    async function fetchData() {
      const response = await treasuryContract.methods.paused().call();

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
  function setPageData(type) {
    setDataType(type);
    setUserData(type, 1);
  }

  function topLinks() {
    return (
      <Aux>
        <div className="account-other-tabs">
          <Grid className="account-connected-grid">
            <Grid.Row>
              <Grid.Column
                floated="right"
                width={16}
                className="balances-column zero"
              >
                <span style={{ display: 'flex' }}>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="welcome-text">Treasury Ballances</p>
                    <div style={{ color: 'red' }}>
                      {state.adminBalances[0][0]}
                    </div>{' '}
                    DAI
                    <div style={{ color: 'red' }}>
                      {state.adminBalances[0][1]}
                    </div>{' '}
                    MANA{' '}
                  </span>
                </span>

                <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <ButtonPause
                    isPaused={isPaused}
                    dataInterval={dataInterval}
                  />
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <div style={{ marginLeft: '0px' }}>
            <p className="account-other-p">
              {dataType === 'balances' ? (
                <b className="account-hover active">BALANCES</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('balances')}
                >
                  BALANCES
                </abbr>
              )}

              {dataType === 'machines' ? (
                <b className="account-hover active">MACHINE HISTORY</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('machines')}
                >
                  MACHINE HISTORY
                </abbr>
              )}

              {dataType === 'history' ? (
                <b className="account-hover active">TRANSACTIONS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('history')}
                >
                  TRANSACTIONS
                </abbr>
              )}
            </p>
          </div>
        </div>

        <Divider className="tab-divider" />
      </Aux>
    );
  }

  function setUserData(type, page) {
    let result = [];
    const indexStart = (page - 1) * maximumCount;
    const indexEnd = indexStart + maximumCount;

    if (type === 'balances') {
      result = true;
    } else if (type === 'history') {
      result = dataHistory.slice(indexStart, indexEnd);
    } else if (type === 'machines') {
      result = dataMachines.slice(indexStart, indexEnd);
    }

    setDataPage(result);
    setCurrentPage(page);
  }

  function noTxHistory() {
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan={5}>
            <div className="account-other-inner-p">
              Please swith MetaMask to admin account
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? <Spinner background={0} /> : null}

      <div className="page-container">
        <div className="account-other-inner-container">
          {topLinks()}

          {dataType !== 'balances' ? (
            <Aux>
              <div id="tx-box-history-2">
                <table className="account-table">
                  <ContentAdmin content={'labels'} type={dataType} />

                  {dataPage !== 'false' ? (
                    <ContentAdmin content={dataType} dataPage={dataPage} />
                  ) : (
                    noTxHistory()
                  )}
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                dataType={dataType}
                data1={dataHistory}
                data2={dataMachines}
                maximumCount={maximumCount}
                setUserData={setUserData}
              />
            </Aux>
          ) : (
            <div id="tx-box-history-2">
              <table className="account-table">
                <ContentAdmin content={dataType} dataPage={dataPage} />
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
