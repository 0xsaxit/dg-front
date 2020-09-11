import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Divider, Grid, Button } from 'semantic-ui-react';

import Web3 from 'web3'; // ******************************************

import Spinner from '../Spinner';

import ButtonPaused from './ButtonPaused';

import ContentAdmin from './ContentAdmin';
import Pagination from './Pagination';
import Aux from '../_Aux';
import Global from '../Constants';

const Admin = () => {
  // get user's transaction history from the Context API store
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
  // const [paused, setPaused] = useState(false);

  // let web3 = {};
  // const web3 = new Web3();
  let maticWeb3 = {};
  // let treasuryContract = {};

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
      // web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      maticWeb3 = new Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      ); // pass Matic provider to maticWeb3 object

      // maticWeb3 = new window.Web3(
      //   new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      // );

      // treasuryContract = Global.getTreasuryContract(web3);
      // treasuryContract = web3.eth
      //   .contract(Global.ABIs.TREASURY_CONTRACT)
      //   .at(Global.TREASURY_CONTRACT_ADDRESS);

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
  // get treasury contract's paused status (true or false)
  // async function getPauseStatus() {
  //   console.log('Get pause status');

  //   // const addresses = await Global.API_ADDRESSES;

  //   // const TREASURY_CONTRACT = new maticWeb3.eth.Contract(
  //   //   Global.ABIs.TREASURY_CONTRACT,
  //   //   addresses.TREASURY_CONTRACT_ADDRESS
  //   // );

  //   const treasuryContract = Global.getTreasuryContract(maticWeb3);
  //   // const treasuryContract = Global.getTreasuryContract(web3);

  //   try {
  //     const pauseStatus = await treasuryContract.methods.paused().call();

  //     return pauseStatus;
  //   } catch (error) {
  //     console.log('Pause status error: ' + error);
  //   }
  // }

  // async function pauseContract() {
  //   console.log('Pause all games registered to Treasury contract');

  //   // const treasuryContract = Global.getTreasuryContract(maticWeb3);

  //   const PARENT_CONTRACT = web3.eth
  //     .contract(Global.ABIs.TREASURY_CONTRACT)
  //     .at(Global.API_ADDRESSES.TREASURY_CONTRACT_ADDRESS);

  //   try {
  //     const pause = await PARENT_CONTRACT.pause();

  //     console.log('Contract paused:');
  //     console.log(pause);
  //   } catch (error) {
  //     console.log('Pause status error: ' + error);
  //   }
  // }

  // async function unPauseContract() {
  //   console.log('Un-pause all games registered to Treasury contract');

  //   // const treasuryContract = Global.getTreasuryContract(maticWeb3);

  //   const PARENT_CONTRACT = web3.eth
  //     .contract(Global.ABIs.TREASURY_CONTRACT)
  //     .at(Global.API_ADDRESSES.TREASURY_CONTRACT_ADDRESS);

  //   try {
  //     const unPause = await PARENT_CONTRACT.unpause();

  //     console.log('Contract un-paused:');
  //     console.log(unPause);
  //   } catch (error) {
  //     console.log('Un-pause status error: ' + error);
  //   }
  // }

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
                  <ButtonPaused isPaused={isPaused} />
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
