import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Icon, Divider } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentTransactions from './ContentTransactions';

const History = (props) => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [dataPage, setDataPage] = useState([]);
  const [maximumCount, setMaximumCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataType, setDataType] = useState('Balances');
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    if (window.web3) {
      const frameHeight = window.innerHeight;
      setMaximumCount(Math.floor(frameHeight * 0.01575));

      setProcessing(false);
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function setPageData(type) {
    setDataType(type);
    setUserData(type, 1);
  }

  function topLinks() {
    return (
      <div>
        <div className="account-other-tabs">
          <div style={{ marginLeft: '0px' }}>
            <p className="account-other-p">
              {dataType == 'Balances' ? (
                <b className="account-hover active">BALANCES</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('Balances')}
                >
                  BALANCES
                </abbr>
              )}

              {dataType == 'Play' ? (
                <b className="account-hover active">GAME HISTORY</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('Play')}
                >
                  GAME HISTORY
                </abbr>
              )}

              {dataType == 'History' ? (
                <b className="account-hover active">DEPOSITS/WITHDRAWALS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('History')}
                >
                  DEPOSITS/WITHDRAWALS
                </abbr>
              )}
            </p>
          </div>
        </div>

        <Divider style={{ marginTop: '21px', paddingBottom: '12px' }} />
      </div>
    );
  }

  function pagination() {
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;

    let totalRows = 0;
    if (dataType === 'History') {
      totalRows = dataHistory.length;
    } else if (dataType === 'Play') {
      totalRows = dataPlay.length;
    }

    return (
      <div className="pagination" style={{ paddingTop: '12px' }}>
        {currentPage > 1 ? (
          <Icon
            name="caret left"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => setUserData(dataType, previousPage)}
          />
        ) : (
          <Icon name="caret left" style={{ color: '#aaaaaa' }} />
        )}

        <span
          className="spanbox"
          style={{ padding: '6px 15px', display: 'inline-block' }}
        >
          Page {currentPage}
        </span>

        {totalRows > maximumCount * currentPage ? (
          <Icon
            name="caret right"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => setUserData(dataType, nextPage)}
          />
        ) : (
          <Icon name="caret right" style={{ color: '#aaaaaa' }} />
        )}
      </div>
    );
  }

  function setUserData(type, page) {
    let result = [];
    const indexStart = (page - 1) * maximumCount;
    const indexEnd = indexStart + maximumCount;

    if (type === 'Balances') {
      result = true;
    } else if (type === 'History') {
      result = dataHistory.slice(indexStart, indexEnd);
    } else if (type === 'Play') {
      result = dataPlay.slice(indexStart, indexEnd);
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
              There is no transaction history for this account
            </div>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  }

  return (
    <div className="main-container">
      {processing ? <Spinner background={0} /> : null}

      <div className="page-container">
        <div className="account-other-inner-container">
          {topLinks()}

          <div id="tx-box-history-2">
            <Table id="header" singleLine fixed>
              <ContentTransactions content={'Labels'} type={dataType} />

              {!processing ? (
                dataPage !== 'false' ? (
                  <ContentTransactions content={dataType} dataPage={dataPage} />
                ) : (
                  noTxHistory()
                )
              ) : null}
            </Table>
          </div>

          {pagination()}
        </div>
      </div>
    </div>
  );
};

export default History;
