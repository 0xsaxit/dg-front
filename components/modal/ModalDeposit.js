import React from 'react';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ContentDeposit from './ContentDeposit';
import SwitchRPC from './SwitchRPC';
import Balances from '../Balances';
import Global from '../Constants';

let web3 = {};
let tokenAddressGoerli = '';
let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  tokenAddressGoerli = addresses.ROOT_TOKEN_ADDRESS_MANA;
  spenderAddress = addresses.TREASURY_CONTRACT_ADDRESS;
}
getAddresses();

class ModalDeposit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: Global.DEFAULT_AMOUNT,
      isCustomAmount: 0,
      userStepValue: 0,
      networkID: 0,
      isValidDeposit: 0,
      isValidAuthorize: 0,
      isValidLocation: 0,
      modalOpen: false,
      spinner: false,
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

      await this.checkUserVerify(); // get this value from Context API store ***********************************

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
          console.log('Mexa is Ready: Deposit');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }

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
    if (this.props.isLink) {
      return (
        <a className="account-deposit-button" onClick={this.handleOpen}>
          Deposit
        </a>
      );
    } else {
      return (
        <Button className="modal-deposit-button" onClick={this.handleOpen}>
          ADD CRYPTO
        </Button>
      );
    }
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // check the amount of tokens that user has allowed Matic Root contract to spend
  // authorize transfers to Matic Network, then deposit MANA to Matic Network
  depositToMatic = async () => {
    try {
      this.setState({ spinner: true });

      // check the amount of tokens that user has allowed Matic contract to spend
      let allowedAmount = await Global.getAllowedToken(
        tokenAddressGoerli,
        this.userAddress
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('allowed amount: ' + allowedAmount);
      const amountWei = web3.utils.toWei(this.state.amount + '');

      if (allowedAmount == 0) {
        await Global.approveToken(
          tokenAddressGoerli,
          Global.MAX_AMOUNT,
          this.userAddress
        );
      } else if (allowedAmount < this.state.amount) {
        await Global.approveToken(tokenAddressGoerli, 0, this.userAddress);
        await Global.approveToken(
          tokenAddressGoerli,
          Global.MAX_AMOUNT,
          this.userAddress
        );
      }

      // now deposit tokens from Mainnet to Matic Network
      const txHash = await Global.depositTokenToMatic(
        tokenAddressGoerli,
        amountWei,
        this.userAddress
      );
      if (txHash !== false) {
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

          if (!ret) this.networkError(); // network error
        } else {
          ret = await this.updateHistory(
            this.state.amount,
            'Deposit',
            'Confirmed',
            txHash
          );

          if (!ret) this.networkError(); // network error
        }

        if (this.state.userStepValue < 6) {
          console.log('updating step value to 5');

          await this.postUserVerify(5); // update verify to 'authorize'
          this.setState({ userStepValue: 5 }); // advance to auth step
        } else if (this.state.userStepValue == 6) {
          this.setState({ userStepValue: 5.5 }); // advance to confirmation step
        }

        this.setState({ isValidDeposit: 2 }); // valid deposit
        console.log('tx hash: ' + txHash);
      }

      this.setState({ spinner: false });
    } catch (error) {
      console.log(error);
      this.setState({ isValidDeposit: 1 }); // invalid deposit

      this.setState({ spinner: false });
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
  metaTransaction = async () => {
    try {
      this.setState({ spinner: true });

      console.log('Matic RPC xxx: ' + Global.MATIC_URL);
      console.log('user address: ' + this.userAddress);
      console.log('spender (treasury) address: ' + spenderAddress);
      console.log('authorize amount: ' + Global.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = this.tokenContract.methods
        .approve(spenderAddress, Global.MAX_AMOUNT)
        .encodeABI();

      const txHash = await Global.executeMetaTransaction(
        functionSignature,
        this.tokenContract,
        this.userAddress,
        web3
      );
      if (txHash == false) {
        console.log('authorization failed');

        this.setState({ isValidAuthorize: 1 }); // invalid authorize
        this.setState({ spinner: false });

        return;
      } else {
        let ret = await this.updateHistory(
          Global.MAX_AMOUNT,
          'Authorization',
          'Confirmed',
          txHash
        );
        if (!ret) this.networkErrror(); // network error

        await this.postUserVerify(6); // update verify to 'deposit'
        this.setState({ userStepValue: 5.5 }); // advance to deposit confirmations step

        this.setState({ isValidAuthorize: 2 }); // valid authorize
      }

      this.setState({ spinner: false });
    } catch (error) {
      console.log(error);

      this.setState({ isValidAuthorize: 1 }); // invalid authorize
      this.setState({ spinner: false });
    }
  };

  networkError = () => {
    console.log('network error');

    this.setState({ spinner: false });
    return;
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // REST API functions: get/update user authorization and onboard status in database
  checkUserVerify = async () => {
    try {
      const response = await this.getUserStatus();
      const json = await response.json();

      if (json.status === 'ok') {
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
          return;
        }

        let stepValue = parseInt(json.result);
        this.setState({ userStepValue: stepValue });
      }
    } catch (error) {
      console.log('step value error deposit: ' + error);
    }
  };

  getUserStatus = () => {
    return fetch(`${Global.API_BASE_URL}/order/verifyAddress`, {
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

  postUserVerify = (step) => {
    return fetch(`${Global.API_BASE_URL}/order/updateUserVerify`, {
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
    return fetch(`${Global.API_BASE_URL}/order/updateUserAuthState`, {
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

  postHistory = async (amount, type, state, txHash) => {
    return fetch(`${Global.API_BASE_URL}/order/updateHistory`, {
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
    let value;
    if (this.state.userStepValue < 6) {
      value = this.state.userStepValue + 1;
    } else {
      value = 4;
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
        {this.state.spinner ? <Spinner background={1} /> : null}

        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              {this.state.userStepValue == 999 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // check the user is in a whitelisted jurisdiction
                <Grid.Column>
                  <ContentDeposit
                    content={'location'} // content type
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 4 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // authorize transfers to Matic Network, then deposit MANA to Matic Network
                <Grid.Column>
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
                  <ContentDeposit
                    content={'authorize'} // content type
                    isValidAuthorize={this.state.isValidAuthorize}
                    authorizeMana={this.metaTransaction}
                    // nextStep={this.nextStep}
                  />
                </Grid.Column>
              ) : this.state.userStepValue == 5.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // get number of confirmations from Matic Network and display to user
                <Grid.Column>
                  <Balances />

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
                  <ContentDeposit
                    content={'deposit'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
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

export default ModalDeposit;
