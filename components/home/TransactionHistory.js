import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Table, Icon, Divider, Grid } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentTransactions from './ContentTransactions';
// import Global from '../Constants';

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

  // const [playBalance, setPlayBalance] = useState('');
  // const [avatarName, setAvatarName] = useState('');
  // const [address, setAddress] = useState('');

  // let userAddress = '';

  useEffect(() => {
    if (state.userStatus) {
      const frameHeight = window.innerHeight;
      setMaximumCount(Math.floor(frameHeight * 0.01575));
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.transactions[0].length) {
      setProcessing(false);
    }
  }, [state.transactions]);

  useEffect(() => {
    setUserData('Balances', 1);
  }, []);

  // close balances overlay on leaving page
  useEffect(() => {
    return () => {
      balancesOverlay(0);
    };
  }, []);

  // get user's play balance, wallet address, and avatar name
  // useEffect(() => {
  //   if (state.userStatus) {
  //     userAddress = window.web3.currentProvider.selectedAddress;

  //     (async function () {
  //       let response = await Global.FETCH.PLAYER_INFO(userAddress);
  //       let json = await response.json();

  //       console.log('Play balance: ' + json.playBalance);
  //       console.log('Wallet address: ' + json.address);
  //       console.log('Avatar name: ' + json.avatarName);

  //       setAddress(json.address);
  //       setAvatarName(json.avatarName);
  //       // setPlayBalance(json.playBalance);
  //     })();
  //   }
  // }, [state.userStatus]);

  // async function getPlayerInfo(userAddress) {
  //   let fetchURL =
  //     'https://api.decentral.games/admin/getUser?address=' + userAddress;
  //   console.log(fetchURL);
  //   return fetch(fetchURL, {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }

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
  function setPageData(type) {
    setDataType(type);
    setUserData(type, 1);
  }

  function topLinks() {
    return (
      <div>
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
                      <div>
                        <p className="account-name">
                          {state.userInfo[1].substr(0, 2) +
                            '...' +
                            state.userInfo[1].substr(-7)}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="account-name">{state.userInfo[0]}</p>
                      </div>
                    )}
                  </span>
                  {/*<Button
                    href="https://play.decentraland.org/?position=-120%2C135&realm=fenrir-amber"
                    className="account-connected-play-button"
                  >
                    Play now
                  </Button>*/}
                </span>
              </Grid.Column>
            </Grid.Row>
          </Grid>

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
                <b className="account-hover active">TRANSFERS</b>
              ) : (
                <abbr
                  className="account-hover"
                  onClick={() => setPageData('History')}
                >
                  TRANSFERS
                </abbr>
              )}
            </p>
          </div>
        </div>

        <Divider className="tab-divider" />
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
    let overlay = 0;

    if (type === 'Balances') {
      result = true;
      overlay = 2;
    } else if (type === 'History') {
      result = dataHistory.slice(indexStart, indexEnd);
      overlay = 0;
    } else if (type === 'Play') {
      result = dataPlay.slice(indexStart, indexEnd);
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
            <table className="account-table">
              <ContentTransactions content={'Labels'} type={dataType} />

              {!processing ? (
                dataPage !== 'false' ? (
                  <ContentTransactions content={dataType} dataPage={dataPage} />
                ) : (
                  noTxHistory()
                )
              ) : null}
            </table>
          </div>

          {pagination()}
        </div>
      </div>
    </div>
  );
};

export default History;
