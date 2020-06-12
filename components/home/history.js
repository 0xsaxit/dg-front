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
      data: [],
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

    // set user address and populate transaction data container with initial values
    this.userAddress = window.web3.currentProvider.selectedAddress;
    await this.getUserData(this.state.dataType, this.state.currentPage);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and onboard status in database
  getUserData = async (type, page) => {
    let response = await this.getUserStatus();
    let json = await response.json();

    // move this outside of each individual component *************************************************
    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('no data returned');
        return;
      }

      let stepValue = parseInt(json.result);
      if (stepValue > 3) {
        this.setState({ isDashboard: true });
      }
    }
    // ************************************************************************************************

    // get either user's gameplay data or their transaction data
    if (type == 'Play') {
      response = await this.getPlayData(page);
    } else if (type == 'History') {
      response = await this.getHistoryData(page);
    }
    json = await response.json();

    // set new data values and reset processing flag to false
    const allData = json.result;
    this.setState({
      data: allData,
      processing: false,
      dataType: type,
      currentPage: page,
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

  getPlayData = (page) => {
    return fetch(`${Global.BASE_URL}/order/getPlayInfo`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
        limit: this.maximumCount,
        page: page,
      }),
    });
  };

  getHistoryData = (page) => {
    return fetch(`${Global.BASE_URL}/order/getHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
        limit: this.maximumCount,
        page: page,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  handleHistory = () => {
    this.setState({ processing: true });
    this.getUserData('History', 1);
  };

  handlePlay = () => {
    this.setState({ processing: true });
    this.getUserData('Play', 1);
  };

  showSpinner = (status) => {
    return (
      <div>
        <Spinner show={status} />
      </div>
    );
  };

  topLinks = () => {
    return (
      <Fade bottom distance="20px" duration="600">
        <div className="account-other-tabs">
          <h3 className="account-other-h3"> Transaction History </h3>
          <div style={{ marginLeft: '3px' }}>
            {this.state.dataType == 'History' ? (
              <p className="account-other-p">
                <b className="account-hover">Deposits/Withdrawals</b> |{' '}
                <abbr
                  className="account-hover"
                  onClick={() => this.handlePlay()}
                >
                  Gameplay{' '}
                </abbr>
              </p>
            ) : (
              <p className="account-other-p">
                <abbr
                  className="account-hover"
                  onClick={() => this.handleHistory()}
                >
                  Deposits/Withdrawals
                </abbr>{' '}
                | <b className="account-hover">Gameplay </b>
              </p>
            )}
          </div>
        </div>
      </Fade>
    );
  };

  pagination = () => {
    const numberOfRows = this.state.data.length;
    const currentPage = this.state.currentPage;
    const previousPage = currentPage - 1;
    const nextPate = currentPage + 1;

    console.log('maximum rows per page: ' + this.maximumCount);
    console.log('current number of rows: ' + numberOfRows);

    return (
      <div
        className="pagination"
        style={{ paddingTop: '12px', marginLeft: '-18px' }}
      >
        {currentPage > 1 ? (
          <Icon
            name="caret left"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => this.getUserData(this.state.dataType, previousPage)}
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

        {numberOfRows > this.maximumCount * currentPage ? (
          <Icon
            name="caret right"
            style={{ cursor: 'pointer', color: '#2085F4' }}
            onClick={() => this.getUserData(this.state.dataType, nextPate)}
          />
        ) : (
          <Icon name="caret right" style={{ color: '#aaaaaa' }} />
        )}
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.showSpinner(this.state.processing)}
        <Menu dashboard={this.state.isDashboard} />

        <div className="contentContainer">
          <div className="account-other-inner-container">
            {this.topLinks()}

            <Fade bottom distance="20px" duration="600" delay="200">
              <div id="tx-box-history-2">
                <ContentTransactions content={'labels'} />

                {this.state.data !== 'false' ? (
                  this.state.dataType === 'History' ? (
                    /////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////////////////////////////////////////////////////////////////////
                    <ContentTransactions
                      content={'history'} // content type
                      data={this.state.data}
                    />
                  ) : this.state.dataType === 'Play' ? (
                    /////////////////////////////////////////////////////////////////////////////////////////
                    /////////////////////////////////////////////////////////////////////////////////////////
                    <ContentTransactions
                      content={'gameplay'} // content type
                      data={this.state.data}
                    />
                  ) : null
                ) : (
                  <div className="account-other-inner-p">
                    There is no transaction history for this account
                  </div>
                )}

                {this.pagination()}
              </div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
