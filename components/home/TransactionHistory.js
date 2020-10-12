import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Divider, Grid, Button } from 'semantic-ui-react';
import ButtonAuthorize from '../button/ButtonAuthorize';
import ButtonEnable from '../button/ButtonEnable';
import Spinner from '../Spinner';
import ContentTransactions from '../content/ContentTransactions';
import Pagination from './Pagination';
import Aux from '../_Aux';

const History = () => {
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const dataHistory = state.transactions[0];
  const dataPlay = state.transactions[1];

  // define local variables
  const [maximumCount, setMaximumCount] = useState(0);
  const [dataType, setDataType] = useState('balances');
  const [dataLength, setDataLength] = useState(0);
  const [dataPage, setDataPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  // const [doneLoading, setDoneLoading] = useState(true);

  // useEffect(() => {
  //   if (document.readyState === 'complete') {
  //     setDoneLoading(false);
  //   }
  // });

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
    balancesOverlay(2);
  }, []);

  // close balances overlay on leaving page
  useEffect(() => {
    return () => {
      balancesOverlay(0);
    };
  }, []);

  // display or remove the balances overlay
  function balancesOverlay(toggle) {
    dispatch({
      type: 'balances_overlay',
      data: toggle,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  // function setPageData(type) {
  //   if (!isLoading) {
  //     setUserData(type, 1);
  //   }
  // }

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
                  <span className="avatar-picture">
                    <a
                      href="https://play.decentraland.org/?OPEN_AVATAR_EDITOR&"
                      target="_blank"
                    >
                      <img
                        className="avatar-picture"
                        src={`https://events.decentraland.org/api/profile/${state.userInfo[1]}/face.png`}
                        style={{
                          width: '72px',
                          display: 'flex',
                          border: '1px solid rgb(227, 232, 238)',
                          borderRadius: '100%',
                          boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                        }}
                      />
                      <span className="avatar-edit"> edit </span>
                    </a>
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <p className="welcome-text"> Account Connected </p>
                    {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                      <p className="account-name">
                        {state.userInfo[1].substr(0, 4) +
                          '...' +
                          state.userInfo[1].substr(-4)}
                      </p>
                    ) : (
                      <p className="account-name">{state.userInfo[0]}</p>
                    )}
                  </span>
                </span>

                <span
                  style={{ display: 'flex', justifyContent: 'flex-end' }}
                  className="account-authorize-span"
                >
                  {state.userStatus === 6 ? (
                    <ButtonAuthorize />
                  ) : state.userStatus === 7 ? (
                    <ButtonEnable />
                  ) : (
                    <Button disabled className="account-connected-play-button">
                      AUTHORIZE
                    </Button>
                  )}
                </span>

                <Divider className="DG-mobile-divider" />

                <span className="account-authorize-span-mobile">
                  {state.userStatus === 6 ? (
                    <ButtonAuthorize />
                  ) : state.userStatus === 7 ? (
                    <ButtonEnable />
                  ) : (
                    <Button
                      disabled
                      className="account-connected-play-button-mobile"
                    >
                      AUTHORIZE
                    </Button>
                  )}
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
                  onClick={() => setUserData('balances', 1)}
                >
                  BALANCES
                </abbr>
              )}

              {dataType === 'play' ? (
                <b className="account-hover active">GAME HISTORY</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setUserData('play', 1)}
                >
                  GAME HISTORY
                </abbr>
              )}

              {dataType === 'history' ? (
                <span>
                  <b className="account-hover active" id="account-txs-tab">
                    TRANSACTIONS
                  </b>
                  <b
                    className="account-hover active"
                    id="account-txs-tab-mobile"
                  >
                    TXS
                  </b>
                </span>
              ) : (
                <span>
                  <abbr
                    className="account-hover"
                    id="account-txs-tab"
                    onClick={() => setUserData('history', 1)}
                  >
                    TRANSACTIONS
                  </abbr>
                  <abbr
                    className="account-hover"
                    id="account-txs-tab-mobile"
                    onClick={() => setUserData('history', 1)}
                  >
                    TXS
                  </abbr>
                </span>
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
      let overlay = 0;
      let dataLength = 0;

      if (type === 'balances') {
        result = true;
        overlay = 2;
        dataLength = 0;
      } else if (type === 'history') {
        result = dataHistory.slice(indexStart, indexEnd);
        overlay = 0;
        dataLength = dataHistory.length;
      } else if (type === 'play') {
        result = dataPlay.slice(indexStart, indexEnd);
        overlay = 0;
        dataLength = dataPlay.length;
      }

      setDataType(type);
      setDataPage(result);
      setDataLength(dataLength);
      setCurrentPage(page);
      balancesOverlay(overlay);
    }
  }

  function noTxHistory() {
    return (
      <div className="account-other-inner-p" style={{ paddingTop: '20px' }}>
        There is no transaction history for this account
      </div>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? (
        <Spinner background={3} />
      ) : (
        <div className="page-container">
          <div className="account-other-inner-container">
            {topLinks()}

            <div id="tx-box-history-2">
              {dataPage !== 'false' ? (
                <table className="account-table">
                  <ContentTransactions content={'labels'} type={dataType} />
                  <ContentTransactions content={dataType} dataPage={dataPage} />
                </table>
              ) : (
                noTxHistory()
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              dataType={dataType}
              dataLength={dataLength}
              maximumCount={maximumCount}
              setUserData={setUserData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
