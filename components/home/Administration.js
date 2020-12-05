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

const Administration = () => {
  // get player/machine transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.adminHistory[0];
  const dataMachines = state.adminHistory[1];

  // define local variables
  const [maximumCount, setMaximumCount] = useState(0);
  const [dataType, setDataType] = useState('balances');
  const [dataLength, setDataLength] = useState(0);
  const [dataPage, setDataPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [parentContract, setParentContract] = useState({});
  // const [maticWeb3, setMaticWeb3] = useState({});
  const [instances, setInstances] = useState(false);

  // let maticWeb3 = {};
  // let treasuryContract = {};

  useEffect(() => {
    if (state.userStatus) {
      const frameHeight = window.innerHeight;
      setMaximumCount(Math.floor(frameHeight * 0.01575));
    }
  }, [state.userStatus]);

  useEffect(() => {
    const allTransactions = state.transactions[0].length;
    const allParcelData = Object.keys(state.parcelDataAll).length;

    if (allTransactions && allParcelData) {
      setIsLoading(false);
    }
  }, [state.transactions, state.parcelDataAll]);

  useEffect(() => {
    if (state.userStatus) {
      // maticWeb3 = new Web3(
      //   new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
      // ); // pass Matic provider to maticWeb3 object

      // initialize maticWeb3 provider and create treasury contract instance
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor
      // setMaticWeb3(maticWeb3);

      (async function () {
        const parentContract = await Transactions.treasuryContract(
          state.addresses,
          maticWeb3
        );
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
    // maticWeb3 = new Web3(
    //   new window.Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL)
    // ); // pass Matic provider to maticWeb3 object

    // treasuryContract = await Transactions.treasuryContract(maticWeb3);

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
                    <p className="welcome-text" style={{ paddingLeft: '0px' }}>
                      Matic ETH balance
                    </p>
                    <p className="earn-text" style={{ paddingTop: '9px' }}>
                      {state.ethBalance}
                    </p>
                  </span>

                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="welcome-text">Treasury Balances</p>
                    <p
                      className="earn-text"
                      style={{ paddingLeft: '21px', paddingTop: '9px' }}
                    >
                      {state.adminBalances[0][0]} DAI
                    </p>
                    <p
                      className="earn-text"
                      style={{ paddingLeft: '21px', marginTop: '-21px' }}
                    >
                      {state.adminBalances[0][1]} MANA
                    </p>
                  </span>
                </span>

                <span
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '-87px',
                    marginBottom: '60px',
                  }}
                >
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
                <b className="account-hover active">GAME BALANCES</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setUserData('balances', 1)}
                >
                  GAME BALANCES
                </abbr>
              )}

              {dataType === 'machines' ? (
                <b className="account-hover active">MACHINE HISTORY</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setUserData('machines', 1)}
                >
                  MACHINE HISTORY
                </abbr>
              )}

              {dataType === 'history' ? (
                <b className="account-hover active">TRANSACTIONS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setUserData('history', 1)}
                >
                  TRANSACTIONS
                </abbr>
              )}

              {dataType === 'nft' ? (
                <b className="account-hover active">NFT HOLDERS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setUserData('nft', 1)}
                >
                  NFT HOLDERS
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
    if (!isLoading) {
      let result = [];
      const indexStart = (page - 1) * maximumCount;
      const indexEnd = indexStart + maximumCount;
      let dataLength = 0;

      if (type === 'balances') {
        result = true;
        dataLength = 0;
      } else if (type === 'history') {
        result = dataHistory.slice(indexStart, indexEnd);
        dataLength = dataHistory.length;
      } else if (type === 'machines') {
        result = dataMachines.slice(indexStart, indexEnd);
        dataLength = dataMachines.length;
      } else if (type === 'nft') {
        result = state.parcelDataAll.slice(indexStart, indexEnd);
        dataLength = state.parcelDataAll.length;
      }

      setDataType(type);
      setDataPage(result);
      setDataLength(dataLength);
      setCurrentPage(page);
    }
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
      {isLoading ? (
        <Spinner background={0} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container">
            {topLinks()}

            <div id="tx-box-history-2">
              {dataPage !== 'false' ? (
                <table className="account-table">
                  <ContentAdmin content={'labels'} type={dataType} />
                  <ContentAdmin
                    content={dataType}
                    dataPage={dataPage}
                    adminBalances={state.adminBalances}
                  />
                </table>
              ) : (
                noTxHistory()
              )}
            </div>

            {dataType !== 'balances' ? (
              <Pagination
                currentPage={currentPage}
                dataType={dataType}
                dataLength={dataLength}
                maximumCount={maximumCount}
                setUserData={setUserData}
              />
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default Administration;
