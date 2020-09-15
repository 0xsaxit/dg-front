import React from 'react';
import { Table } from 'semantic-ui-react';
// import LogoSpinner from '../LogoSpinner';
// import mana from '../../static/images/mana.png';

let Global;
const INITIAL_STATE = {
  data: [],
  isRunningTransaction: false,
};

class Deposit extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  async componentDidMount() {
    Global = require('../Constants').default;
    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });

    await this.getUserData();
  }

  async getUserData() {
    const response = await this.getData();
    const json = await response.json();
    if (json.result !== 'false') {
      this.setState({ data: json.result });

      for (var i = 0; i < 3; i++) {
        if (json.result.length > 0) {
          var el = document.querySelector('.dataTable');
          if (!el) {
            // await Global.delay(1000);
            continue;
          }

          el.addEventListener('scroll', function (e) {
            (function (el) {
              el.classList.add('scrollTable');
              setTimeout(function () {
                el.classList.remove('scrollTable');
              }, 1000);
            })(el);
          });
        }
      }
    } else {
      this.setState({ data: [] });
    }
  }

  getData = () => {
    return fetch(`${Global.API_BASE_URL}/admin/getMachine`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
  };

  render() {
    const data = this.state.data;

    return (
      <div className="contentContainer" style={{ marginBottom: '-60px' }}>
        {/* <LogoSpinner
          show={this.state.isRunningTransaction}
          className="tx-history-spinner"
        /> */}
        <div className="account-other-inner-container">
          <h3 className="account-other-h3"> Machines </h3>
          <div id="tx-box-history" style={{ marginTop: '42px' }}>
            <Table id="header" singleLine fixed style={{ marginBottom: 0 }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ paddingLeft: '20px' }}>
                    Game
                  </Table.HeaderCell>
                  <Table.HeaderCell>Machine ID</Table.HeaderCell>
                  <Table.HeaderCell>Bets</Table.HeaderCell>
                  <Table.HeaderCell>Payout</Table.HeaderCell>
                  <Table.HeaderCell>Timestamp</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            {data.length != 0 ? (
              <div
                className="dataTable"
                style={{ height: 'calc(100vh - 280px)' }}
              >
                <Table singleLine fixed>
                  <Table.Header></Table.Header>
                  <Table.Body>
                    {data.map((row) => {
                      var bets = (
                        Number(row.totalBetAmount) / Global.FACTOR
                      ).toFixed(0);
                      var payouts = (
                        Number(row.totalAmountWin) / Global.FACTOR
                      ).toFixed(0);
                      var date = new Date(row.latestSessionDate);
                      var timestamp = date.toLocaleString();
                      timestamp = timestamp
                        .replace(timestamp.substr(-2), '')
                        .trim();
                      var game;
                      var machine_id = row.globalID.substr(
                        row.globalID.length - 3,
                        3
                      );
                      var row_type = row.globalID.substr(
                        row.globalID.length - 6,
                        3
                      );
                      if (row_type === '002') game = 'MANA Roulette';
                      else game = 'MANA Slots';
                      return (
                        <Table.Row>
                          <Table.Cell style={{ paddingLeft: '20px' }}>
                            <img
                              style={{ verticalAlign: 'middle' }}
                              className="image inline"
                              width="20px"
                              height="20px"
                              src={Global.ICON_MANA}
                            />
                            <span
                              style={{ textAlign: 'left', marginLeft: '10px' }}
                            >
                              {game}
                            </span>
                          </Table.Cell>
                          <Table.Cell>{machine_id}</Table.Cell>
                          <Table.Cell>{bets} MANA</Table.Cell>
                          <Table.Cell>{payouts} MANA</Table.Cell>
                          <Table.Cell>
                            {timestamp}
                            <i style={{ marginLeft: '5px' }}>&#x25B8;</i>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            ) : (
              <p
                style={{
                  lineHeight: 'calc(100vh - 310px)',
                  textAlign: 'center',
                  color: 'gray',
                }}
              >
                {' '}
                There are no deposits/withdrawals for this account{' '}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Deposit;