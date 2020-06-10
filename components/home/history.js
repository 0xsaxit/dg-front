import React from 'react';
import { Table, Icon } from 'semantic-ui-react';
import Fade from 'react-reveal/Fade';
// import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import Spinner from '../Spinner';
import mana from '../../static/images/mana.png';
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
    this.pageCount = 0;
  }

  async componentDidMount() {
    // dynamically size transaction window
    const frameHeight = window.innerHeight;
    this.pageCount = Math.floor(frameHeight * 0.0195);

    this.userAddress = window.web3.currentProvider.selectedAddress;
    await this.getUserData(this.state.dataType, this.state.currentPage);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and onboard status in database
  getUserData = async (type, page) => {
    // console.log('get user data...');
    // console.log(type);

    this.showSpinner(1);

    let response = await this.getUserStatus();
    let json = await response.json();

    if (json.status === 'ok') {
      if (json.result === 'false') {
        console.log('no data returned'); // *****
        return;
      }

      let stepValue = parseInt(json.result);

      if (stepValue > 3) {
        this.setState({ isDashboard: true });
      } else {
        console.log('step value less than 4'); // *****
      }

      this.showSpinner(0);
    }

    // get either user's gameplay data or their transaction data
    if (type == 'Play') {
      response = await this.getPlayData(page);
    } else {
      response = await this.getHistoryData(page);
    }
    json = await response.json();

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
        // address: '0x5aae39aed818b07235dc8bedbf5698bb4f299ef3'.toLowerCase(),
        address: window.web3.currentProvider.selectedAddress,
        limit: this.pageCount,
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
        limit: this.pageCount,
        page: page,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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
    // console.log('foo foo foo..');
    // console.log(this.state.dataType);

    return (
      <Fade bottom distance="20px" duration="600">
        <h3 className="account-other-h3"> Transaction History </h3>

        {this.state.dataType == 'History' ? (
          <div>
            <b className="account-hover">DEPOSITS/WITHDRAWALS</b> |
            <abbr className="account-hover" onClick={() => this.handlePlay()}>
              GAMEPLAY
            </abbr>
          </div>
        ) : (
          <div>
            <abbr
              className="account-hover"
              onClick={() => this.handleHistory()}
            >
              DEPOSITS/WITHDRAWALS
            </abbr>
            | <b className="account-hover">GAMEPLAY</b>
          </div>
        )}
      </Fade>
    );
  };

  labels = () => {
    return (
      <Table id="header" singleLine fixed style={{ marginBottom: 0 }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell style={{ paddingLeft: '20px' }}>
              ACTION
            </Table.HeaderCell>
            <Table.HeaderCell>AMOUNT</Table.HeaderCell>
            <Table.HeaderCell>RESULT</Table.HeaderCell>
            <Table.HeaderCell>DATE</Table.HeaderCell>
            <Table.HeaderCell>TX HASH</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      </Table>
    );
  };

  pagination = () => {
    const previousPage = 1; // this.state.currentPage - 1;
    const nextPate = 1; // this.state.currentPage + 1;

    return (
      <div
        className="pagination"
        style={{ paddingTop: '12px', marginLeft: '-18px' }}
      >
        {/* <MdKeyboardArrowLeft
          size="2.825em"
          style={{ paddingTop: '24px' }}
          className={'spanbox mouseCursor'}
          onClick={this.getUserData(this.state.dataType, previousPage)}
        /> */}
        <Icon name="caret left" style={{ color: '#2085F4' }} />

        <span
          className="spanbox"
          style={{ padding: '6px 15px', display: 'inline-block' }}
        >
          Page {this.state.currentPage}
        </span>

        {/* <MdKeyboardArrowRight
          style={{ paddingTop: '21px' }}
          size="2em"
          className={'spanbox mouseCursor'}
          onClick={this.getUserData(this.state.dataType, nextPate)}
        /> */}
        <Icon name="caret right" style={{ color: '#2085F4' }} />
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
<<<<<<< HEAD
            {this.topLinks()}

=======
            <Fade bottom distance="20px" duration="600">
              <div className="account-other-tabs">
                <h3 className="account-other-h3"> Transaction History </h3>
                <div style={{ marginLeft: '3px' }}>
                  {this.state.historyState == 0 ? (
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
>>>>>>> 02b9cf5abda158431ecfe78e99a8f4d8b8e0d619
            <Fade bottom distance="20px" duration="600" delay="200">
              <div id="tx-box-history-2">
                {this.labels()}

                {console.log('data...')}
                {console.log(this.state.data)}

                {this.state.data !== 'false' ? (
                  <Table>
                    <Table.Header></Table.Header>
                    <Table.Body>
                      {this.state.data.map((row) => {
                        // if (row !== undefined) {
                        const date = new Date(row.createdAt);
                        const timestamp = date.toLocaleString();
                        const amount = row.amount;

                        let sign = '+';
                        if (row.type !== 'Deposit') sign = '-';

                        return (
                          <Table.Row>
                            <Table.Cell style={{ paddingLeft: '20px' }}>
                              <img
                                src={mana}
                                style={{
                                  width: '18px',
                                  paddingRight: '3px',
                                  verticalAlign: 'middle',
                                  marginTop: '-3px',
                                }}
                              />
                              {row.type}
                            </Table.Cell>

                            <Table.Cell>
                              {sign}
                              {amount} MANA
                            </Table.Cell>

                            <Table.Cell className="table-status">
                              {row.status}
                            </Table.Cell>

                            <Table.Cell className="table-status2">
                              {timestamp}
                            </Table.Cell>

                            <Table.Cell className="table-status3">
                              <a
                                style={{
                                  color: '#2085F4',
                                  maxWidth: '120px',
                                  display: 'inline-block',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  verticalAlign: 'middle',
                                }}
                                target="_blank"
                                href={Global.MATIC_EXPLORER + `/tx/${row.txid}`}
                              >
                                {row.txid}
                              </a>
                              <Icon
                                name="caret right"
                                style={{ color: '#2085F4' }}
                              />
                            </Table.Cell>

                            <Table.Cell className="table-status2">
                              button...
                            </Table.Cell>
                          </Table.Row>
                        );
                        // }
                      })}
                    </Table.Body>
                  </Table>
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
