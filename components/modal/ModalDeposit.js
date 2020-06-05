import React from 'react';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';

// import ABIFAKEMana from '../ABI/ABIFAKEMana';
// import ABIChildToken from '../ABI/ABIChildToken';

import ModalSidebar from './ModalSidebar';
import ContentDeposit from './ContentDeposit';
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

class Deposit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: Global.DEFAULT_AMOUNT,
      isCustomAmount: 0,
      userStepValue: 0,
      networkID: 0,
      isValidDeposit: 0,
      isValidAuthorize: 0,
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
        console.log('Mexa is Ready: deposit');
      })
      .onEvent(biconomy.ERROR, (error, message) => {
        console.error(error);
      });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks, and drop-down list and input amount functions
  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

      this.setState({ tokenBalanceL1: amount1 });
      this.setState({ tokenBalanceL2: amount2 });
    } catch (error) {
      console.log(error);
    }
  };

  onChangeAmount = (e, d) => {
    if (d.value == -1) {
      this.setState({ amount: 0, isCustomAmount: 1 });
      return;
    }

    this.setState({ amount: d.value });
  };

  onChangeCustomAmount = async (e) => {
    let value = parseInt(e.target.value);

    if (String(value) != 'NaN') {
      this.setState({ amount: parseInt(e.target.value) });
    } else {
      this.setState({ amount: 0 });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal
  getTrigger = () => {
    return (
      <Button content="Deposit" id="depositButton2" onClick={this.handleOpen} />
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

        if (stepValue > 3) {
          if (stepValue == 5) {
            // indicate deposit success and set userStepValue to result
            this.setState({
              userStepValue: stepValue,
            });
          } else if (stepValue == 6) {
            // indicate authorization success and set userStepValue to result
            this.setState({
              userStepValue: stepValue,
            });
          } else {
            // indicate deposit success and set userStepValue to result
            this.setState({ userStepValue: stepValue });
          }
        } else {
          // indicate deposit success and set userStepValue to result
          this.setState({ userStepValue: stepValue });
        }
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
  // check the amount of tokens that user has allowed Matic Root contract to spend
  // authorize transfers to Matic Network, then deposit MANA to Matic Network
  depositToMatic = async () => {
    try {
      this.props.showSpinner();

      // check the amount of tokens that user has allowed Matic contract to spend
      let allowedAmount = await Global.getAllowedToken(
        tokenAddressRopsten,
        this.userAddress
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('allowed amount: ' + allowedAmount);
      const amountWei = web3.utils.toWei(this.state.amount + '');

      if (allowedAmount == 0) {
        await Global.approveToken(
          tokenAddressRopsten,
          Global.MAX_AMOUNT,
          this.userAddress
        );
      } else if (allowedAmount < this.state.amount) {
        await Global.approveToken(tokenAddressRopsten, 0, this.userAddress);
        await Global.approveToken(
          tokenAddressRopsten,
          Global.MAX_AMOUNT,
          this.userAddress
        );
      }

      // now deposit tokens from Mainnet to Matic Network
      const txHash = await Global.depositTokenToMatic(
        tokenAddressRopsten,
        amountWei,
        this.userAddress
      );
      if (txHash != false) {
        let ret = await this.updateHistory(
          this.state.amount,
          'Deposit',
          'In Progress',
          txHash
        );
        if (!ret) this.networkErrror(); // network error

        ret = await Global.getConfirmedTx(txHash); // return confirmation hash
        console.log('confirmation: ' + ret);

        if (ret.status == '0x0') {
          ret = await this.updateHistory(
            this.state.amount,
            'Deposit',
            'Failed',
            txHash
          );
        } else {
          ret = await this.updateHistory(
            this.state.amount,
            'Deposit',
            'Confirmed',
            txHash
          );

          console.log('updated database');
        }

        if (!ret) this.networkError(); // network error

        if (this.state.userStepValue < 6) {
          console.log('updating step value to 5');

          await this.postUserVerify(5); // update verify to 'authorize'
          this.setState({ userStepValue: 5 }); // advance to auth step
        } else if (this.state.userStepValue == 6) {
          setTimeout(this.props.update, 5000); // set user token balance from MetaMask
        }

        this.setState({ isValidDeposit: 2 }); // valid deposit
        console.log('tx hash: ' + txHash);
      }

      this.props.hideSpinner();
    } catch (error) {
      console.log(error);
      this.setState({ isValidDeposit: 1 }); // invalid deposit

      this.props.hideSpinner();
    }
  };

  networkError = () => {
    console.log('network error');

    this.setState({ isValidDeposit: 1 }); // invalid deposit
    this.props.hideSpinner();

    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
  metaTransfer = async () => {
    try {
      this.props.showSpinner();

      console.log('Matic RPC: ' + Global.MATIC_URL);
      console.log('user address: ' + this.userAddress);
      console.log('spender (treasury) address: ' + spenderAddress);
      console.log('authorize amount: ' + Global.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = this.tokenContract.methods
        .approve(spenderAddress, Global.MAX_AMOUNT)
        .encodeABI();

      await Global.executeMetaTransaction(
        functionSignature,
        this.tokenContract,
        this.userAddress,
        web3
      );

      await this.postUserVerify(6); // update verify to 'deposit'
      this.setState({ userStepValue: 5.5 }); // advance to confirmations step

      await this.postUserAuthState(this.props.authvalue); // update authorize to 4
      this.setState({ isValidAuthorize: 2 }); // valid authorize

      setTimeout(this.props.update, 5000); // set user token balance from MetaMask
      this.props.hideSpinner();
    } catch (error) {
      console.log(error);
      this.setState({ isValidAuthorize: 1 }); // invalid authorize

      this.props.hideSpinner();
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and deposit status in database
  postUserVerify = (step) => {
    return fetch(`${Global.BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        verifyStep: step,
      }),
    });
  };

  postUserAuthState = (value) => {
    return fetch(`${Global.BASE_URL}/order/updateUserAuthState`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: window.web3.currentProvider.selectedAddress,
        authorized: value,
      }),
    });
  };

  postHistory = async (amount, type, state, txHash) => {
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
      }),
    });
  };

  updateHistory = async (amount, type, state, txHash = '') => {
    try {
      const response = await this.postHistory(amount, type, state, txHash);
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          return false;
        }

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    return false;
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
      value = 4;
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
              {this.state.userStepValue == 4 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // authorize transfers to Matic Network, then deposit MANA to Matic Network
                <Grid.Column>
                  <ModalSidebar checked={1} />
                  <ContentDeposit
                    content={'approve'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    isCustomAmount={this.state.isCustomAmount}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
                <Grid.Column>
                  <ModalSidebar checked={2} />
                  <ContentDeposit
                    content={'authorize'} // content type
                    isValidAuthorize={this.state.isValidAuthorize}
                    authorizeMana={this.metaTransfer}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 5.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // get number of confirmations from Matic Network and display to user
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <ContentDeposit
                    content={'confirmations'} // content type
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 6 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // user has finished onboard process and wishes to deposit more MANA to Matic Network
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <ContentDeposit
                    content={'deposit'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    isCustomAmount={this.state.isCustomAmount}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositToMatic={this.depositToMatic}
                    // nextStep={this.nextStep}
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

export default Deposit;
