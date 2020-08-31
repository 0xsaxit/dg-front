import React from 'react';
import { Table } from 'semantic-ui-react';
// import mana from '../../static/images/mana.png';
// import LogoSpinner from '../LogoSpinner';

let Global;
const INITIAL_STATE = {
  data: [],
};

class History extends React.Component {
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
    return fetch(`${Global.API_BASE_URL}/admin/getHistory`, {
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
          <h3 className="account-other-h3"> Transaction History </h3>
          <div id="tx-box-history" style={{ marginTop: '42px' }}>
            <Table id="header" singleLine fixed style={{ marginBottom: 0 }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell style={{ paddingLeft: '20px' }}>
                    Game
                  </Table.HeaderCell>
                  <Table.HeaderCell>MachineID</Table.HeaderCell>
                  <Table.HeaderCell>Player</Table.HeaderCell>
                  <Table.HeaderCell>Bet</Table.HeaderCell>
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
                      var date = new Date(row.createdAt);
                      var timestamp = date.toLocaleString();
                      timestamp = timestamp
                        .replace(timestamp.substr(-2), '')
                        .trim();
                      var game;

                      if (row.betAmount) {
                        var amount = Number(row.betAmount) / Global.FACTOR;
                        var payout = Number(row.amountWin) / Global.FACTOR;
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
                                src={Global.IMAGES.ICON_MANA}
                              />
                              <span
                                style={{
                                  textAlign: 'left',
                                  marginLeft: '10px',
                                }}
                              >
                                {game}
                              </span>
                            </Table.Cell>
                            <Table.Cell>{machine_id}</Table.Cell>
                            <Table.Cell>
                              <a
                                style={{ color: 'gray' }}
                                target="_blank"
                                href={
                                  Global.MATIC_EXPLORER +
                                  `/address/${row.address}`
                                }
                              >
                                {row.address.substr(0, 6) +
                                  '...' +
                                  row.address.substr(-4)}
                              </a>
                            </Table.Cell>
                            <Table.Cell className="admin-tx-table-padding">
                              {amount} MANA
                            </Table.Cell>
                            <Table.Cell className="admin-tx-table-padding2">
                              {payout} MANA
                            </Table.Cell>
                            <Table.Cell>
                              {timestamp}{' '}
                              <i style={{ marginLeft: '5px' }}>&#x25B8;</i>
                            </Table.Cell>
                          </Table.Row>
                        );
                      }
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
                There is no transaction history for this account{' '}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default History;
