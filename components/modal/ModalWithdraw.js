import React from 'react';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ContentWithdraw from './ContentWithdraw';
import SwitchRPC from './SwitchRPC';
import Global from '../constants';

let web3 = {};
// let tokenAddressRopsten = '';
// let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  // tokenAddressRopsten = addresses.ROPSTEN_TOKEN_ADDRESS;
  // spenderAddress = addresses.PARENT_CONTRACT_ADDRESS;
}
getAddresses();

class ModalWithdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: Global.DEFAULT_AMOUNT,
      transactionHash: '',
      networkID: 0,
      isValidBurn: 0,
      userStepValue: 0,
      isValidExit: 0,
      tokenBalanceL1: 0,
      tokenBalanceL2: 0,
      modalOpen: false,
    };

    this.userAddress = '';
    this.maticWeb3 = {};
    this.tokenContract = {};
  }

  async componentDidMount() {
    this.userAddress = window.web3.currentProvider.selectedAddress;

    // set maticWeb3 provider, get token balances, and verify user/set userStepValue
    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );
    await this.getTokenBalance();
    await this.checkUserVerify();

    // initialize Web3 providers (MetaMask provider for web3 and Biconomy provider for getWeb3)
    web3 = new Web3(window.ethereum);
    const biconomy = new Biconomy(
      new Web3.providers.HttpProvider(Global.MATIC_URL),
      {
        apiKey: Global.BICONOMY_API_KEY,
        debug: true,
      }
    );
    const getWeb3 = new Web3(biconomy);
    this.tokenContract = Global.getTokenContract(getWeb3, 'child');

    biconomy
      .onEvent(biconomy.READY, () => {
        console.log('Mexa is Ready: withdraw');
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.error(error);
      });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on main net and Matic networks, and drop-down list function
  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({ tokenBalanceL1: amount1 });
      this.setState({ tokenBalanceL2: amount2 });
    } catch (err) {
      console.log(err);
    }
  };

  onChangeAmount = (e, d) => {
    this.setState({ amount: d.value });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal
  getTrigger = () => {
    return (
      <Button content="Withdraw" id="depositButton" onClick={this.handleOpen} />
    );
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // burn tokens on Matic Network
  burnOnMatic = async () => {
    try {
      this.props.showSpinner();

      console.log('burn amount: ' + this.state.amount);
      console.log('token contract: ');
      console.log(this.tokenContract);

      const amountWei = web3.utils.toWei(this.state.amount + '');

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = this.tokenContract.methods
        .withdraw(amountWei)
        .encodeABI();

      let txHash = await Global.executeMetaTransaction(
        functionSignature,
        this.tokenContract,
        this.userAddress,
        web3
      );

      console.log('returned transaction hash: ' + txHash);

      if (txHash == false) {
        console.log('burn failed');

        this.setState({ isValidBurn: 1 }); // invalid burn
        this.props.hideSpinner();

        return;
      } else {
        let ret = await this.updateHistory(
          this.state.amount,
          'Burn',
          'Confirmed',
          txHash,
          1
        );
        if (!ret) this.networkErrror(); // network error

        this.setState({ transactionHash: txHash }); // set transaction hash and advance to next step
        this.setState({ userStepValue: 6.5 }); // advance to hash step

        this.setState({ isValidBurn: 2 }); // valid burn
      }

      this.props.hideSpinner();
    } catch (error) {
      console.log(error);

      this.setState({ isValidBurn: 1 }); // invalid burn
      this.props.hideSpinner();
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  exitToMainnet = async () => {
    try {
      this.props.showSpinner();

      let txHash = await Global.exitToMainnet(
        this.state.transactionHash,
        this.userAddress
      );

      console.log('returned transaction hash: ' + txHash);

      if (txHash == false) {
        console.log('exit failed');

        this.setState({ isValidExit: 1 }); // invalid exit
        this.props.hideSpinner();

        return;
      } else {
        let ret = await this.updateHistory(
          this.state.amount,
          'Exit',
          'In Progress',
          txHash,
          1
        );
        if (!ret) this.networkErrror(); // network error

        this.setState({ transactionHash: txHash }); // set transaction hash for confimation

        this.setState({ userStepValue: 7 }); // advance to submite proof of burn step
        this.setState({ isValidExit: 2 }); // valid exit
      }

      this.props.hideSpinner();
    } catch (error) {
      console.log(error);

      this.setState({ isValidExit: 1 }); // invalid exit
      this.props.hideSpinner();
    }
  };

  networkError = () => {
    console.log('network error');

    this.props.hideSpinner();
    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // goToTxHistory = () => {
  //   console.log('go to transaction history page...');
  // };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and deposit status in database
  checkUserVerify = async () => {
    try {
      const response = await this.getUserStatus();
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
          return;
        }

        // const response = await this.getWithdrawExist();
        // const json = await response.json();
        // if (json.status === 'ok') {
        // set the transaction in the database
        // this.setState({ transactionHash: json.result });

        let stepValue = parseInt(json.result);
        this.setState({ userStepValue: stepValue });

        console.log('userStepValue status: ' + stepValue);

        // this.setState({ transactionHash: '' });
      }
    } catch (error) {
      console.log('step value error withdraw: ' + error);
    }
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

  getWithdrawTransaction = (txid) => {
    return fetch(`${Global.BASE_URL}/order/checkHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        txHash: txid,
      }),
    });
  };

  getWithdrawExist = () => {
    return fetch(`${Global.BASE_URL}/order/existWithdraw`, {
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

  updateHistory = async (amount, type, state, txHash, step) => {
    try {
      const response = await this.postHistory(
        amount,
        type,
        state,
        txHash,
        step
      );
      const json = await response.json();
      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log('update history error: ' + error);
    }

    return false;
  };

  postHistory = async (amount, type, state, txHash, step) => {
    return fetch(`${Global.BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        amount,
        type,
        state,
        txHash,
        step,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  verifyNetwork = async () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network) }); // set network ID
    });
  };

  switchRPC = () => {
    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <SwitchRPC />
      </Modal>
    );
  };

  nextStep = () => {
    let value;

    if (this.state.userStepValue <= 6) {
      value = 6.5;
    } else if (this.state.userStepValue == 6.5) {
      value = 7;
    } else if (this.state.userStepValue == 7) {
      value = 6;
    }

    this.setState({ userStepValue: value });
  };

  render() {
    this.verifyNetwork(); // verify user is on correct network
    if (this.state.networkID !== 3) return this.switchRPC();

    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              {this.state.userStepValue <= 6 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // burn tokens on matic chain and store transaction hash for use while generating burn proof
                <Grid.Column>
                  <ContentWithdraw
                    content={'burn'} // content type
                    isValidBurn={this.state.isValidBurn}
                    amount={this.state.amount}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    onChangeAmount={this.onChangeAmount}
                    burnOnMatic={this.burnOnMatic}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 6.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // tell user to check transaction history page after about 5 minutes
                <Grid.Column>
                  <ContentWithdraw
                    content={'hash'} // content type
                    transactionHash={this.state.transactionHash}
                    // goToTxHistory={this.goToTxHistory}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 7 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // call exit function on RootChainManager contract to submit proof of burn transaction
                // this call made after checkpoint is submitted for the block containing burn transaction
                <Grid.Column>
                  <ContentWithdraw
                    content={'exit'} // content type
                    isValidExit={this.state.isValidExit}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    transactionHash={this.state.transactionHash}
                    exitToMainnet={this.exitToMainnet}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : null}
            </Grid>
          </div>
        </div>
      </Modal>
    );
  }
}

export default ModalWithdraw;
