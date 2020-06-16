import React from 'react';
import { Icon } from 'semantic-ui-react';
import Fade from 'react-reveal/Fade';
import Spinner from '../Spinner';
import ContentTransactions from './ContentTransactions';
import Menu from './menu';
import Global from '../constants';

class History extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataHistory: [],
      dataPlay: [],
      dataPage: [],
      currentPage: 1,
      dataType: 'History',
      processing: true,
      isDashboard: false,
    };

    this.userAddress = '';
    this.maximumCount = 0;
  }

  async componentDidMount() {
    // dynamically size transaction data container
    const frameHeight = window.innerHeight;
    this.maximumCount = Math.floor(frameHeight * 0.0195);

    // set user address and populate transaction data with initial values (history)
    this.userAddress = window.web3.currentProvider.selectedAddress;
    this.getUserData();
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user's transaction history data and gameplay data
  getUserData = async () => {
    // later move this outside of each individual component *************************************************
    let response = await this.getUserStatus();
    let json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('no data returned');
      }

      let stepValue = parseInt(json.result);
      if (stepValue > 3) {
        this.setState({ isDashboard: true });
      }
    }
    // ************************************************************************************************

    const responseHistory = await this.getHistoryData();
    const jsonHistory = await responseHistory.json();
    const dataHistory = jsonHistory.result;
    const responsePlay = await this.getPlayData();
    const jsonPlay = await responsePlay.json();
    const dataPlay = jsonPlay.result;

    // set history, play, and page data, and reset processing flag to false
    const dataPage = dataHistory.slice(0, this.maximumCount);
    this.setState({
      dataHistory: dataHistory,
      dataPlay: dataPlay,
      dataPage: dataPage,
      processing: false,
    });
  };

  getUserStatus = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
      }),
    });
  };

  getHistoryData = () => {
    return fetch(`${Global.BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
        limit: 99999, // just grab all of the data
        page: 1,
      }),
    });
  };

  getPlayData = () => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
        limit: 99999, // just grab all of the data
        page: 1,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  setDataType = (type) => {
    this.setState({ dataType: type });
    this.setUserData(type, 1);
  };

  // showSpinner = (status) => {
  //   return <Spinner show={status} />;
  // };

  topLinks = () => {
    return (
      <Fade bottom distance="20px" duration="600">
        <div className="account-other-tabs">
          <h3 className="account-other-h3">Transaction History</h3>

          <div style={{ marginLeft: '3px' }}>
            {this.state.dataType == 'History' ? (
              <p className="account-other-p">
                <b className="account-hover">Deposits/Withdrawals</b> |{' '}
                <abbr
                  className="account-hover"
                  onClick={() => this.setDataType('Play')}
                >
                  Gameplay
                </abbr>
              </p>
            ) : (
              <p className="account-other-p">
                <abbr
                  className="account-hover"
                  onClick={() => this.setDataType('History')}
                >
                  Deposits/Withdrawals
                </abbr>{' '}
                | <b className="account-hover">Gameplay</b>
              </p>
            )}
          </div>
        </div>
      </Fade>
    );
  };

  pagination = () => {
    const currentPage = this.state.currentPage;
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const currentRows = this.state.dataPage.length;

    let totalRows = 0;
    if (this.state.dataType === 'History') {
      totalRows = this.state.dataHistory.length;
    } else if (this.state.dataType === 'Play') {
      totalRows = this.state.dataPlay.length;
    }

    console.log('current page number: ' + currentPage);
    console.log('maximum rows per page: ' + this.maximumCount);
    console.log('total number of rows: ' + totalRows);
    console.log('current number of rows: ' + currentRows);

    return (
      <div
        className="pagination"
        style={{ paddingTop: '12px', marginLeft: '-18px' }}
      >
        {currentPage > 1 ? (
          <Icon
            name="caret left"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => this.setUserData(this.state.dataType, previousPage)}
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

        {totalRows > this.maximumCount * currentPage ? (
          <Icon
            name="caret right"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => this.setUserData(this.state.dataType, nextPage)}
          />
        ) : (
          <Icon name="caret right" style={{ color: '#aaaaaa' }} />
        )}
      </div>
    );
  };

  setUserData = (type, page) => {
    let dataPage = [];
    const indexStart = (page - 1) * this.maximumCount;
    const indexEnd = indexStart + this.maximumCount;

    if (type === 'History') {
      dataPage = this.state.dataHistory.slice(indexStart, indexEnd);
    } else if (type === 'Play') {
      dataPage = this.state.dataPlay.slice(indexStart, indexEnd);
    }

    this.setState({ dataPage: dataPage, currentPage: page });
  };

  render() {
    return (
      <div>
        {this.state.processing ? <Spinner snow={0} /> : null}

        <Menu dashboard={this.state.isDashboard} />

        <div className="contentContainer">
          <div className="account-other-inner-container">
            {this.topLinks()}

            <Fade bottom distance="20px" duration="600" delay="200">
              <div id="tx-box-history-2">
                <ContentTransactions content={'labels'} />

                {!this.state.processing ? (
                  this.state.dataPage !== 'false' ? (
                    this.state.dataType === 'History' ? (
                      /////////////////////////////////////////////////////////////////////////////////////////
                      /////////////////////////////////////////////////////////////////////////////////////////
                      <ContentTransactions
                        content={'history'} // content type
                        dataPage={this.state.dataPage}
                      />
                    ) : this.state.dataType === 'Play' ? (
                      /////////////////////////////////////////////////////////////////////////////////////////
                      /////////////////////////////////////////////////////////////////////////////////////////
                      <ContentTransactions
                        content={'gameplay'} // content type
                        dataPage={this.state.dataPage}
                      />
                    ) : null
                  ) : (
                    <div className="account-other-inner-p">
                      There is no transaction history for this account
                    </div>
                  )
                ) : (
                  <div
                    className="account-other-inner-p"
                    style={{ paddingTop: '5vh', height: '15vh' }}
                  >
                    Loading...
                  </div>
                )}
              </div>

              <div>{this.pagination()}</div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
