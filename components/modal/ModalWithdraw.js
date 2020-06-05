import React from 'react';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';

// import ABIChildToken from '../ABI/ABIChildToken';

import ContentWithdraw from './ContentWithdraw';
import SwitchRPC from './switchRPC';
import Global from '../constants';

let web3 = {};
let tokenAddressRopsten = '';
// let tokenAddressMatic = '';
let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  tokenAddressRopsten = addresses.ROPSTEN_TOKEN_ADDRESS;
  // tokenAddressMatic = addresses.MATIC_TOKEN_ADDRESS;
  spenderAddress = addresses.PARENT_CONTRACT_ADDRESS;
}
getAddresses();

class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: Global.DEFAULT_AMOUNT,
      userStepValue: 0,
      networkID: 0,
      isValidBurn: 0,
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

    // set maticWeb3 provider, get token balances, and set userStepValue
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
    // this.tokenContract = new getWeb3.eth.Contract(
    //   ABIChildToken,
    //   tokenAddressMatic
    // );

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
  checkUserVerify = async () => {
    try {
      const response = await this.getUserStatus();
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
        }

        let stepValue = parseInt(json.result);
        console.log('userStepValue status: ' + stepValue);

        this.setState({ userStepValue: stepValue });
      }
    } catch (error) {
      console.log('step value error: ' + error);
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

      await Global.executeMetaTransaction(
        functionSignature,
        this.tokenContract,
        this.userAddress,
        web3
      );

      // await this.postUserVerify(6); // update verify to 'deposit'
      this.setState({ userStepValue: 6 }); // advance to exit step

      // await this.postUserAuthState(this.props.authvalue); // update authorize to 4
      this.setState({ isValidBurn: 2 }); // valid burn

      // setTimeout(this.props.update, 5000); // set user token balance from MetaMask
      this.props.hideSpinner();

      console.log('burn foo foo foo...');
    } catch (error) {
      console.log(error);
      this.setState({ isValidBurn: 1 }); // invalid burn

      this.props.hideSpinner();
    }
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
    if (this.state.userStepValue < 6) {
      value = this.state.userStepValue + 1;
    } else {
      value = 5;
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
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // call exit function on RootChainManager conract to submit proof of burn transaction
                // this call made after checkpoint is submitted for the block containing burn transaction
                <Grid.Column>
                  <ContentWithdraw
                    content={'exit'} // content type
                    isValidExit={this.state.isValidExit}
                    exitToMainnet={this.exitToMainnet}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              )}
            </Grid>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Withdraw;
