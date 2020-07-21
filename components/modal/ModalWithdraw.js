import React from 'react';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentWithdraw from './ContentWithdraw';
import SwitchRPC from './SwitchRPC';
import Global from '../Constants';

let web3 = {};

class ModalWithdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: Global.DEFAULT_AMOUNT,
      transactionHash: '',
      networkID: 0,
      userStepValue: 0,
      isValidBurn: 0,
      isValidExit: 0,
      modalOpen: false,
      processing: false,
    };

    this.userAddress = '';
    this.tokenContract = {};
  }

  async componentDidMount() {
    if (window.web3) {
      // set user address and network ID
      this.userAddress = window.web3.currentProvider.selectedAddress;
      window.web3.version.getNetwork((err, network) => {
        this.setState({ networkID: parseInt(network) });
      });
    }

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
    this.tokenContract = Global.getTokenContract('child', getWeb3);

    biconomy
      .onEvent(biconomy.READY, () => {
        console.log('Mexa is Ready: Withdraw');
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.error(error);
      });
  }

  onChangeAmount = (e, d) => {
    this.setState({ amount: d.value });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal
  getTrigger = () => {
    if (this.props.isExit) {
      return (
        <a 
          className="account-withdraw-button" 
          onClick={this.submitHash}
          style={{ paddingLeft: '36px', paddingRight: '36px' }}
        >
          EXIT
        </a>
      );
    } else {
      return (
        <a className="account-withdraw-button" onClick={this.handleOpen}>
          WITHDRAW
        </a>
      );
    }
  };

  // set transaction hash and advance to submit proof of burn step
  submitHash = () => {
    this.setState({
      transactionHash: this.props.transactionHash,
      userStepValue: 9,
    });
    this.handleOpen();
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
      this.setState({ processing: true });

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
        this.setState({ processing: false });

        return;
      } else {
        let ret = await this.updateHistory(
          this.state.amount,
          'Exit',
          'In Progress',
          txHash
        );
        if (!ret) this.networkErrror(); // network error

        this.setState({ transactionHash: txHash }); // set transaction hash and advance to next step
        this.setState({ userStepValue: 8 }); // advance to the pending step
        this.setState({ isValidBurn: 2 }); // valid burn
      }

      this.setState({ processing: false });
    } catch (error) {
      console.log(error);

      this.setState({ isValidBurn: 1 }); // invalid burn
      this.setState({ processing: false });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  exitToMainnet = async () => {
    try {
      this.setState({ processing: true });

      let txHash = await Global.exitToMainnet(
        this.state.transactionHash,
        this.userAddress
      );

      console.log('returned transaction hash: ' + txHash);

      if (txHash == false) {
        console.log('exit failed');

        this.setState({ isValidExit: 1 }); // invalid exit
        this.setState({ processing: false });

        return;
      } else {
        let ret = await this.updateHistory(
          this.state.amount,
          'Exit',
          'Confirmed',
          this.state.transactionHash // update pending burn transaction
        );
        if (!ret) this.networkErrror(); // network error

        this.setState({ transactionHash: txHash }); // set transaction hash for confimation
        this.setState({ userStepValue: 10 }); // advance to exit confirmation step
        this.setState({ isValidExit: 2 }); // valid exit
      }

      this.setState({ processing: false });
    } catch (error) {
      console.log(error);

      this.setState({ isValidExit: 1 }); // invalid exit
      this.setState({ processing: false });
    }
  };

  networkError = () => {
    console.log('network error');

    this.setState({ processing: false });
    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and deposit status in database
  updateHistory = async (_amount, type, state, txHash) => {
    console.log('Writing to database: ' + state);

    try {
      const response = await this.postHistory(_amount, type, state, txHash);
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log('Update history error: ' + error);
    }

    return false;
  };

  postHistory = async (_amount, type, state, txHash) => {
    return fetch(`${Global.API_BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.userAddress,
        amount: _amount,
        type,
        state,
        txHash,
        step: this.state.userStepValue,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
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
    let value = 0;

    if (this.state.userStepValue < 9) {
      value = this.state.userStepValue + 1;
    } else {
      value = 7;
    }

    this.setState({ userStepValue: value });
  };

  render() {
    if (this.state.networkID !== Global.PARENT_NETWORK_ID)
      return this.switchRPC();

    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        {/* {this.state.spinner ? <Spinner background={1} /> : null} */}

        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              {this.state.userStepValue <= 7 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // burn tokens on Matic chain and store transaction hash for use when generating burn proof
                <Grid.Column>
                  <ContentWithdraw
                    content={'burn'} // content type
                    isValidBurn={this.state.isValidBurn}
                    amount={this.state.amount}
                    onChangeAmount={this.onChangeAmount}
                    burnOnMatic={this.burnOnMatic}
                    processing={this.state.processing}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 8 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // tell user to check transaction history page after 10 minutes
                <Grid.Column>
                  <ContentWithdraw
                    content={'pending'} // content type
                    transactionHash={this.state.transactionHash}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 9 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // call exit function on RootChainManager contract to submit proof of burn transaction
                // this call made after checkpoint is submitted for the block containing burn transaction
                <Grid.Column>
                  <ContentWithdraw
                    content={'exit'} // content type
                    isValidExit={this.state.isValidExit}
                    transactionHash={this.state.transactionHash}
                    exitToMainnet={this.exitToMainnet}
                    processing={this.state.processing}
                    nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 10 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // display exit confirmation hash
                <Grid.Column>
                  <ContentWithdraw
                    content={'confirmation'} // content type
                    transactionHash={this.state.transactionHash}
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
