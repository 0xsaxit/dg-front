import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Divider, Grid, Button } from 'semantic-ui-react';
import Web3 from 'web3';
import Spinner from '../Spinner';
import ButtonPause from './ButtonPause';
import ContentAdmin from './ContentAdmin';
import Pagination from './Pagination';
import Aux from '../_Aux';
import Global from '../Constants';

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
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object

      const treasuryContract = Global.getTreasuryContract(maticWeb3);

      setUserData('balances', 1);

      // get treasury contract's paused status (true or false)
      (async function () {
        const pauseStatus = await treasuryContract.methods.paused().call();
        setIsPaused(pauseStatus);

        console.log('Pause status: ' + pauseStatus);
      })();
    }
  }, [state.userStatus, isPaused]);

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
                  <ButtonPause isPaused={isPaused} />
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <div style={{ marginLeft: '0px' }}>
            <p className="account-other-p">
              {dataType == 'balances' ? (
                <b className="account-hover active">BALANCES</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('balances')}
                >
                  BALANCES
                </abbr>
              )}

              {dataType == 'machines' ? (
                <b className="account-hover active">MACHINE HISTORY</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('machines')}
                >
                  MACHINE HISTORY
                </abbr>
              )}

              {dataType == 'history' ? (
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
    let overlay = 0;

    if (type === 'balances') {
      result = true;
      overlay = 2;
    } else if (type === 'history') {
      result = dataHistory.slice(indexStart, indexEnd);
      overlay = 0;
    } else if (type === 'machines') {
      result = dataMachines.slice(indexStart, indexEnd);
      overlay = 0;
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
