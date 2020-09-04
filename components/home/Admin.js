import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Divider } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentAdmin from './ContentAdmin';
import Pagination from './Pagination';
import Aux from '../_Aux';

const Admin = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0]; // ***********************************
  const dataMachines = state.transactions[1]; // **************************************

  // define local variables
  const [maximumCount, setMaximumCount] = useState(0);
  const [dataType, setDataType] = useState('balances');
  const [dataPage, setDataPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (state.transactions[0].length) {
      setIsLoading(false);
    }
  }, [state.transactions]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function setPageData(type) {
    setDataType(type);
  }

  function topLinks() {
    return (
      <Aux>
        <div className="account-other-tabs">
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
                <b className="account-hover active">TRANSFERS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('history')}
                >
                  TRANSFERS
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
    balancesOverlay(overlay);
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

          <div id="tx-box-history-2">
            <table className="account-table">
              <ContentAdmin content={'labels'} type={dataType} />

              {!isLoading ? (
                dataPage !== 'false' ? (
                  <ContentAdmin content={dataType} dataPage={dataPage} />
                ) : (
                  noTxHistory()
                )
              ) : null}
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            dataType={dataType}
            dataHistory={dataHistory}
            dataMachines={dataMachines}
            maximumCount={maximumCount}
            setUserData={setUserData}
          />
        </div>
      </div>
    </div>
  );
};

export default Admin;
