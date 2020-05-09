import React from 'react';
import { isMobile } from 'react-device-detect';
import { Grid, Divider } from 'semantic-ui-react';
import DepositFunds from './DepositFunds';
import WithdrawFunds from './WithdrawFunds';

let Global;

class ContractData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkID: 0,
      maticID: 0,
      userBalance: 0,
      contractFunds: 0,
      tokensSlots: 0,
      tokensRoulette: 0,
    };

    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider('https://testnet2.matic.network')
    );
  }

  componentDidMount() {
    Global = require('../constant').default;
    this.setState({ maticID: Global.MATIC_NETWORK_ID });

    this.getInitialBalances();
  }

  mobileRedirect = () => {
    if (isMobile) {
      return <Redirect to="/" />;
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify user is on Matic Network and get initial MANA balances from MetaMask and parent contract
  getInitialBalances = () => {
    window.web3.version.getNetwork(async (err, network) => {
      const networkID = parseInt(network);
      this.setState({ networkID: networkID });

      // get user's balance on Matic Network
      const userBalance = await Global.balanceOfToken(
        Global.MATIC_TOKEN,
        this.maticWeb3
      );
      this.setState({
        userBalance: window.web3
          .fromWei(userBalance, 'ether')
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });

      // get total funds in parent contract
      const contractFunds = await Global.getBalanceParent(
        'MANA',
        this.maticWeb3
      );
      this.setState({
        contractFunds: window.web3
          .fromWei(contractFunds, 'ether')
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });

      // get allocated tokens for slots
      const tokensSlots = await Global.getTokensGame(1, 'MANA', this.maticWeb3);
      this.setState({
        tokensSlots: window.web3
          .fromWei(tokensSlots, 'ether')
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });

      // get allocated tokens for roulette
      const tokensRoulette = await Global.getTokensGame(
        2,
        'MANA',
        this.maticWeb3
      );
      this.setState({
        tokensRoulette: window.web3
          .fromWei(tokensRoulette, 'ether')
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    });
  };

  render() {
    return (
      <div id="deposit">
        {this.mobileRedirect()}

        <div className="ui depositContainer">
          <Grid verticalAlign="middle" textAlign="center">
            <Grid.Row>
              <h3 className="modal-h3">
                {this.props.modalType}
                {this.props.modalType == 'Deposit'
                  ? ' to ' + this.props.gameType + ' Contract'
                  : ' from ' + this.props.gameType + ' Contract'}
              </h3>
            </Grid.Row>
            <Grid.Row>
              <p className="modal-p">
                Your current MANA token balance: {this.state.userBalance}
              </p>
            </Grid.Row>
            <Grid.Row>
              <p className="modal-p">
                Parent Contract MANA funds: {this.state.contractFunds}
              </p>
            </Grid.Row>
            <Grid.Row>
              {this.props.gameType == 'MANA Slots' ? (
                <p className="modal-p">
                  Slots Contract MANA funds: {this.state.tokensSlots}
                </p>
              ) : (
                <p className="modal-p">
                  Roulette Contract MANA funds: {this.state.tokensRoulette}
                </p>
              )}
            </Grid.Row>
            <Divider className="modal-divider" />
            <Grid.Row>
              {this.props.modalType == 'Deposit' ? (
                <DepositFunds gameType={this.props.gameType} />
              ) : (
                <WithdrawFunds gameType={this.props.gameType} />
              )}
            </Grid.Row>
            <Grid.Row>
              {this.state.networkID != this.state.maticID ? (
                <p className="modal-p-error">
                  Please switch MetaMask to Matic Network
                </p>
              ) : null}
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

export default ContractData;
