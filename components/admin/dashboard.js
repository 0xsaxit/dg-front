import React from 'react';
import { Redirect } from 'react-router-dom';
import mana from '../../static/images/mana.png';
import LogoSpinner from '../LogoSpinner';
import spin from '../../static/images/spin.gif';
import { Table, Dropdown } from 'semantic-ui-react';
import ModalFunds from './ModalFunds';

let Global;
var USER_ADDRESS;

const INITIAL_STATE = {
  manaSlotBalance: 0,
  manaSlotPayout: 0,
  manaSlotVolume: 0,
  manaRouletteBalance: 0,
  manaRoulettePayout: 0,
  manaRouletteVolume: 0,
  ethMaticGasBalance: 0,
  ethRopstenGasBalance: 0,
  username: '',
  period: 7,
  isRunningTransaction: false,
  loading: true,
};

class Dashboard extends React.Component {
  showSpinner = () => this.setState({ isRunningTransaction: true });
  hideSpinner = () => this.setState({ isRunningTransaction: false });

  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

    if (window.web3) {
      USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    }

    // this.maticWeb3 = new window.Web3(
    //   new window.Web3.providers.HttpProvider('https://testnet2.matic.network')
    // );
  }

  async componentDidMount() {
    Global = require('../constant').default;

    if (window.web3) {
      this.maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );
    }

    let object = this;
    window.ethereum.on('accountsChanged', async function (accounts) {
      await object.getUserData();
    });
    await this.getUserData();
  }

  async getUserData() {
    this.setState({ isRunningTransaction: true });
    this.verifyNetwork();
    this.getEthBalance();

    // Get Mana Slot Contract Data
    let page = 1;
    let slotVolume = 0;
    let slotPayout = 0;
    let rouletteVolume = 0;
    let roulettePayout = 0;
    let response = await this.getData();
    let json = await response.json();
    // while (json.result !== 'false') {
    json.result.map((row) => {
      var row_type = row.globalID.substr(row.globalID.length - 6, 3);
      if (row_type !== '002') {
        slotVolume = slotVolume + Number(row.totalBetAmount) / Global.FACTOR;
        slotPayout = slotPayout + Number(row.totalAmountWin) / Global.FACTOR;
      } else {
        rouletteVolume =
          rouletteVolume + Number(row.totalBetAmount) / Global.FACTOR;
        roulettePayout =
          roulettePayout + Number(row.totalAmountWin) / Global.FACTOR;
      }
    });
    // }
    this.setState({
      manaSlotVolume: Math.round(slotVolume),
      manaSlotPayout: Math.round(slotPayout),
      manaRouletteVolume: Math.round(rouletteVolume),
      manaRoulettePayout: Math.round(roulettePayout),
      isRunningTransaction: false,
      loading: false,
    });
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

  getTokenBalance = async (isMatic) => {
    try {
      var amountSlot, amountRoulette;

      // if (isMatic)
      //   amount = await Global.balanceOfToken(Global.MATIC_TOKEN);
      // else
      //   amount = await Global.balanceOfToken(Global.ROPSTEN_TOKEN);
      amountSlot = await Global.balanceOfToken(
        Global.MATIC_TOKEN,
        this.maticWeb3,
        Global.TREASURY_SLOTS_ADDRESS
      );
      amountRoulette = await Global.balanceOfToken(
        Global.MATIC_TOKEN,
        this.maticWeb3,
        Global.TREASURY_ROULETTE_ADDRESS
      );
      this.setState({
        manaSlotBalance: window.web3.fromWei(amountSlot, 'ether').toFixed(0),
        manaRouletteBalance: window.web3
          .fromWei(amountRoulette, 'ether')
          .toFixed(0),
      });
    } catch (err) {
      console.log(err);
    }
  };

  getEthBalance = () => {
    try {
      var Obj = this;
      window.web3.eth.getBalance(Global.RELAY_ADDR, function (err, amount) {
        if (err) return;

        Obj.setState({
          ethRopstenGasBalance: window.web3.fromWei(amount, 'ether').toFixed(8),
        });
      });
      this.maticWeb3.eth.getBalance(Global.RELAY_ADDR, function (err, amount) {
        if (err) {
          console.log(err);
          return;
        }

        Obj.setState({
          ethMaticGasBalance: window.web3.fromWei(amount, 'ether').toFixed(8),
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork(async (err, network) => {
      if (network === Global.MATIC_NETWORK_ID) {
        this.isMatic = true;
        await this.getTokenBalance(true);
      } else {
        this.isMatic = false;
        await this.getTokenBalance(false);
      }
    });
  };

  onDeposit = () => {
    this.props.history.push('/adeposit/');
  };

  onWithdraw = () => {
    this.props.history.push('/awithdraw/');
  };

  onChangePeriod = async (e, d) => {
    this.setState({ period: d.value });

    await this.getUserData(d.value);
  };

  // onMenuClick = (index) => {
  //   if (index >= 5 && index <= 9) return;
  //   localStorage.setItem('selectedMenu', index);
  //   this.setState({ selectedMenu: index });
  //   this.props.onMenuSelected(index);
  // };

  render() {
    const data = [
      {
        name: 'MANA Slots',
        image: mana,
        unit: 'MANA',
        balance: this.state.manaSlotBalance,
        volume: this.state.manaSlotVolume,
        payout: this.state.manaSlotPayout,
        enabled: 1,
      },
      {
        name: 'MANA Roulette',
        image: mana,
        unit: 'MANA',
        balance: this.state.manaRouletteBalance,
        volume: this.state.manaRouletteVolume,
        payout: this.state.manaRoulettePayout,
        enabled: 1,
      },
      // {
      //   name: 'MANA Blackjack',
      //   image: mana,
      //   unit: 'MANA',
      //   balance: 0,
      //   volume: 0,
      //   payout: 0,
      //   enabled: 1
      // },
    ];

    const period = [
      { key: 1, text: '1 day', value: 1 },
      { key: 2, text: '7 days', value: 7 },
      { key: 3, text: '1 month', value: 30 },
      { key: 4, text: '6 months', value: 180 },
      { key: 5, text: '1 year', value: 365 },
    ];

    return (
      <div className="contentContainer" style={{ marginBottom: '-90px' }}>
        <div className="account-other-inner-container">
          <h3 className="account-other-h3"> Admin </h3>
          <div style={{ marginLeft: '3px' }}>
            <span className="tx-history-select">
              <p className="mouseCursor">House Gas:</p>
              <p className="mouseCursor" style={{ paddingLeft: '3px' }}>
                {' '}
                {this.state.ethMaticGasBalance} ETH{' '}
              </p>
            </span>
            <Dropdown
              style={{ float: 'right', marginTop: '-42px' }}
              inline
              compact
              direction="left"
              options={period}
              value={this.state.period}
              onChange={this.onChangePeriod}
            />
          </div>
          <div id="tx-box-history" style={{ marginTop: '20px' }}>
            <Table id="header" singleLine fixed style={{ marginBottom: 0 }}>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Game</Table.HeaderCell>
                  <Table.HeaderCell className="adminTablePadding">
                    Volume
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adminTablePadding">
                    Payouts
                  </Table.HeaderCell>
                  <Table.HeaderCell className="adminTablePadding">
                    Balance
                  </Table.HeaderCell>
                  <Table.HeaderCell style={{ width: '280px' }}>
                    Manage
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
            </Table>
            <div
              className="dataTable"
              style={{ height: 'calc(100vh - 400px)' }}
            >
              <Table singleLine fixed>
                <Table.Header></Table.Header>
                <Table.Body>
                  {data.map((row) => {
                    return (
                      <Table.Row key={row.name}>
                        <Table.Cell style={{ paddingLeft: '20px' }}>
                          <img
                            style={{ verticalAlign: 'middle' }}
                            className="image inline"
                            width="20px"
                            height="20px"
                            src={row.image}
                          />
                          <span
                            style={{ textAlign: 'left', marginLeft: '10px' }}
                          >
                            {row.name}
                          </span>
                        </Table.Cell>
                        <Table.Cell>
                          {row.volume} {row.unit}
                        </Table.Cell>
                        <Table.Cell className="admin-dashboard-table-padding">
                          {row.payout} {row.unit}
                        </Table.Cell>
                        <Table.Cell className="admin-dashboard-table-padding2">
                          {row.balance} {row.unit}
                        </Table.Cell>
                        <Table.Cell style={{ width: '280px' }}>
                          {row.enabled == 1 ? (
                            <div>
                              <span className="tx-history-select">
                                <ModalFunds
                                  showSpinner={this.props.showSpinner}
                                  hideSpinner={this.props.hideSpinner}
                                  modalType={'Deposit'}
                                  gameType={row.name}
                                />
                                <ModalFunds
                                  showSpinner={this.props.showSpinner}
                                  hideSpinner={this.props.hideSpinner}
                                  modalType={'Withdraw'}
                                  gameType={row.name}
                                />
                              </span>
                            </div>
                          ) : (
                            <div>
                              <ModalFunds
                                showSpinner={this.props.showSpinner}
                                hideSpinner={this.props.hideSpinner}
                                modalType={'Deposit'}
                                gameType={row.name}
                              />
                              <ModalFunds
                                showSpinner={this.props.showSpinner}
                                hideSpinner={this.props.hideSpinner}
                                modalType={'Withdraw'}
                                gameType={row.name}
                              />
                            </div>
                          )}
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;
