import React from 'react';
import { Table } from 'semantic-ui-react';
import ModalWithdraw from '../modal/ModalWithdraw';
import LogoSpinner from '../LogoSpinner';
import Spinner from '../Spinner';
import mana from '../../static/images/mana.png';
import { Icon } from 'semantic-ui-react';
import Fade from 'react-reveal/Fade';
import Menu from './menu';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

let Global;
const PAGE_COUNT = 20;
var USER_ADDRESS;
const INITIAL_STATE = {
  data: [],
  currentPage: 1,
  dataType: 'History',
  isRunningTransaction: false,
  nextAvail: true,
  beforeAvail: false,
  isLoadingData: false,
  historyState: 0,
  isLoading: true,
  isDashboard: false,
};

class History extends React.Component {
  showSpinner = () => this.setState({ isRunningTransaction: true });
  hideSpinner = () => this.setState({ isRunningTransaction: false });

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    let object = this;
    Global = require('../constant').default;
    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });

    await this.getUserData(this.state.dataType, this.state.currentPage);
  }

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: USER_ADDRESS,
      }),
    });
  };
  async getUserData(type, page) {
    this.setState({ isLoadingData: true });
    var response;
    response = await this.getUserVerify();
    let json = await response.json();
    if (json.status === 'ok') {
      if (json.result === 'false') {
        location.href = '/';
        return;
      }
      let stepValue = parseInt(json.result);
      if (stepValue > 3) {
        this.setState({ isDashboard: true });
      } else {
        location.href = '/';
      }
      this.setState({ isLoading: false });
    }
    if (type == 'Play') response = await this.getPlayData(page);
    else response = await this.getHistoryData(page);

    json = await response.json();
    var allData = [];
    var nextAvail = this.state.nextAvail;

    if (json.result !== 'false') {
      allData = json.result;

      for (var i = 0; i < 3; i++) {
        if (json.result.length > 0) {
          var el = document.querySelector('.dataTable');
          if (!el) {
            await Global.delay(1000);
            continue;
          }

          el.addEventListener('scroll', function (e) {
            (function (el) {
              el.classNameList.add('scrollTable');
              setTimeout(function () {
                el.classNameList.remove('scrollTable');
              }, 1000);
            })(el);
          });
        }
      }
    }

    if (json.result === 'false' || !json.result.length) {
      if (page > 1) nextAvail = false;
    } else nextAvail = true;

    if (allData.length > 0)
      this.setState({
        data: allData,
        isLoadingData: false,
        dataType: type,
        currentPage: page,
        nextAvail: nextAvail,
        beforeAvail: page == 1 ? false : true,
      });
    else if (this.state.dataType !== type)
      this.setState({
        data: allData,
        isLoadingData: false,
        dataType: type,
        currentPage: page,
        nextAvail: nextAvail,
        beforeAvail: page == 1 ? false : true,
      });
    else
      this.setState({
        isLoadingData: false,
        nextAvail: nextAvail,
        beforeAvail: this.state.currentPage == 1 ? false : true,
      });
  }

  handleHistory = () => {
    this.setState({ historyState: 0 });
    if (this.state.dataType !== 'History') this.getUserData('History', 1);
  };

  handlePlay = () => {
    this.setState({ historyState: 1 });
    if (this.state.dataType !== 'Play') this.getUserData('Play', 1);
  };

  nextPage = () => {
    if (this.state.nextAvail)
      this.getUserData(this.state.dataType, this.state.currentPage + 1);
  };

  previewPage = () => {
    if (this.state.beforeAvail)
      this.getUserData(this.state.dataType, this.state.currentPage - 1);
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
        limit: PAGE_COUNT,
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
        // address: '0x5aae39aed818b07235dc8bedbf5698bb4f299ef3'.toLowerCase(),
        address: window.web3.currentProvider.selectedAddress,
        limit: PAGE_COUNT,
        page: page,
      }),
    });
  };

  render() {
    const data = this.state.data;

    if (this.state.isLoading === true) {
      return (
        <div>
          <Spinner show={this.state.isLoading} />
        </div>
      );
    }
    return (
      <div>
        <Menu dashboard={this.state.isDashboard} />
        <div className="contentContainer">
          <LogoSpinner
            show={this.state.isRunningTransaction}
            className="tx-history-spinner"
          />
          <div className="account-other-inner-container">
            <Fade bottom distance="20px" duration="600">
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
            </Fade>
            <Fade bottom distance="20px" duration="600" delay="200">
              <div id="tx-box-history">
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
                {data.length != 0 && this.state.isLoadingData == false ? (
                  <div>
                    <div
                      className="dataTable"
                      style={{ height: 'calc(100vh - 280px)', padding: 0 }}
                    >
                      <Table singleLine fixed style={{ margin: 0, padding: 0 }}>
                        <Table.Header></Table.Header>
                        <Table.Body>
                          {data.map((row) => {
                            if (row != undefined) {
                              var action, amount, result;
                              var date = new Date(row.createdAt);
                              var timestamp = date.toLocaleString();

                              timestamp = timestamp
                                .replace(timestamp.substr(-2), '')
                                .trim();
                              // if (row.betAmount) returns undefined??
                              if (row.betAmount) {
                                amount =
                                  Number(row.betAmount) /
                                  10 ** Global.TOKEN_DECIMALS;
                                result =
                                  Number(row.amountWin) /
                                  10 ** Global.TOKEN_DECIMALS;
                                if (row.gameType === 2)
                                  action = 'MANA Roulette';
                                else action = 'MANA Slots';

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
                                      {action}
                                    </Table.Cell>
                                    <Table.Cell>-{amount} MANA</Table.Cell>
                                    <Table.Cell>+{result} MANA</Table.Cell>
                                    <Table.Cell id="gameplay-timestamp">
                                      {timestamp}
                                    </Table.Cell>
                                    <Table.Cell>
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
                                        href={
                                          Global.MATIC_EXPLORER +
                                          `/tx/${row.txid}`
                                        }
                                      >
                                        {row.txid}
                                      </a>
                                      <Icon
                                        name="caret right"
                                        style={{ color: '#2085F4' }}
                                      />
                                    </Table.Cell>
                                  </Table.Row>
                                );
                              } else {
                                if (row.type === 'Deposit')
                                  amount = `+${row.amount}`;
                                else amount = `-${row.amount}`;

                                if (row.status === 'Failed')
                                  return (
                                    <Table.Row
                                      style={{ background: '#fb9ca7' }}
                                    >
                                      <Table.Cell
                                        style={{ paddingLeft: '20px' }}
                                      >
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
                                      <Table.Cell style={{ color: 'white' }}>
                                        {amount} MANA
                                      </Table.Cell>
                                      <Table.Cell style={{ color: 'white' }}>
                                        {row.status}
                                      </Table.Cell>
                                      <Table.Cell
                                        style={{ color: 'white' }}
                                        id="ready-timestamp"
                                      >
                                        {timestamp}
                                      </Table.Cell>
                                      <Table.Cell>
                                        <ModalWithdraw
                                          isLink={1}
                                          tx={row.txid}
                                          showSpinner={this.showSpinner}
                                          hideSpinner={this.hideSpinner}
                                        />
                                      </Table.Cell>
                                    </Table.Row>
                                  );

                                if (row.status === 'Ready')
                                  return (
                                    <Table.Row
                                      style={{ background: '#8fe08f' }}
                                    >
                                      <Table.Cell
                                        style={{ paddingLeft: '20px' }}
                                      >
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
                                      <Table.Cell style={{ color: 'white' }}>
                                        {amount} MANA
                                      </Table.Cell>
                                      <Table.Cell
                                        style={{
                                          color: 'white',
                                          paddingLeft: '0px',
                                        }}
                                      >
                                        {row.status}
                                      </Table.Cell>
                                      <Table.Cell
                                        style={{ color: 'white' }}
                                        id="ready-timestamp"
                                      >
                                        {timestamp}
                                      </Table.Cell>
                                      <Table.Cell>
                                        <ModalWithdraw
                                          isLink={1}
                                          tx={row.txid}
                                          showSpinner={this.showSpinner}
                                          hideSpinner={this.hideSpinner}
                                        />
                                      </Table.Cell>
                                    </Table.Row>
                                  );

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
                                    <Table.Cell>{amount} MANA</Table.Cell>
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
                                        href={
                                          Global.MATIC_EXPLORER +
                                          `/tx/${row.txid}`
                                        }
                                      >
                                        {row.txid}
                                      </a>
                                      <Icon
                                        name="caret right"
                                        style={{ color: '#2085F4' }}
                                      />
                                    </Table.Cell>
                                  </Table.Row>
                                );
                              }
                            }
                          })}
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                ) : this.state.isLoadingData == false ? (
                  <p className="account-other-inner-p">
                    {' '}
                    There is no transaction history for this account.{' '}
                  </p>
                ) : (
                  <p style={{ height: 'calc(100vh - 310px)', margin: 0 }}></p>
                )}
                <div
                  className="pagination"
                  style={{ paddingTop: '12px', marginLeft: '-18px' }}
                >
                  <MdKeyboardArrowLeft
                    size="2.825em"
                    style={{ paddingTop: '24px' }}
                    className={`spanbox ${
                      this.state.beforeAvail ? 'mouseCursor' : 'disable'
                    }`}
                    onClick={this.previewPage}
                  />
                  <span
                    className="spanbox"
                    style={{ padding: '6px 15px', display: 'inline-block' }}
                  >
                    Page {this.state.currentPage}
                  </span>
                  <MdKeyboardArrowRight
                    style={{ paddingTop: '21px' }}
                    size="2em"
                    className={`spanbox ${
                      this.state.nextAvail ? 'mouseCursor' : 'disable'
                    }`}
                    onClick={this.nextPage}
                  />
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    );
  }
}

export default History;
