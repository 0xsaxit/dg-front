import React from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ModalSidebar from './ModalSidebar';
import DepositContent from './DepositContent';

let Global;

class Deposit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCustomAmount: 0,
      amount: 1000,
      userStepValue: 0,
      networkID: 0,
      isValidDeposit: 0,
      isValidAuthorize: 0,
      tokenBalanceL1: 0,
      tokenBalanceL2: 0,
      modalOpen: false,
    };

    this.USER_ADDRESS = '';
    this.isBrowserMetamsk = 0;
    this.maticWeb3 = {};
  }

  async componentDidMount() {
    Global = require('./../constant').default;

    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // get web3 values, set token balances, and set userStepValue
    if (window.web3) {
      this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;
      this.isBrowserMetamsk = 1;
      this.maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );
    }
    await this.getTokenBalance();

    const ret = await this.checkUserVerifyStep();
    // if (ret) {
    //   if (
    //     parseInt(localStorage.getItem('modalDeposit')) ==
    //     (parseInt(localStorage.getItem('selectedMenu')) || 0) + 1
    //   ) {
    //     if (parseInt(localStorage.getItem('modalDeposit')) == 1)
    //       this.setState({ modalOpen: true });
    //     else if (
    //       parseInt(localStorage.getItem('authvalue')) == this.props.authvalue
    //     )
    //       this.setState({
    //         modalOpen: true,
    //         isValidDeposit: 2,
    //         userStepValue: 5,
    //       });
    //   }
    //   return;
    // }
  }

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

  // onAuthorize = async () => {
  //   localStorage.setItem('authvalue', this.props.authvalue || 0);
  //   this.setState({ isValidDeposit: 2, userStepValue: 5 });

  //   this.handleOpen();
  // };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  checkUserVerifyStep = async () => {
    try {
      const response = await this.getUserVerify(); // get user status
      const json = await response.json();

      if (json.status === 'ok') {
        // if result == false set userStepValue = 1 and exit
        if (json.result === 'false') {
          this.setState({ userStepValue: 1 });
          this.props.hideSpinner();

          return true;
        }

        let stepValue = parseInt(json.result);
        if (stepValue > 3) {
          if (stepValue == 5) {
            // indicate deposit success and set userStepValue to result
            this.setState({
              isValidDeposit: 2,
              userStepValue: stepValue,
            });
          } else if (stepValue == 6) {
            // indicate authorization success and set userStepValue to result
            this.setState({
              isValidAuthorize: 2,
              userStepValue: stepValue,
            });
          } else {
            // indicate deposit success and set userStepValue to result
            this.setState({ isValidDeposit: 2, userStepValue: stepValue });
          }
        } else {
          // indicate deposit success and set userStepValue to result
          this.setState({ isValidDeposit: 2, userStepValue: stepValue });
        }

        // this.setState({
        //   modalOpen: true,
        // });

        // this.props.hideSpinner(); // *************************

        // return true;
      }
    } catch (error) {
      console.log(error);
    }

    this.props.hideSpinner();
    // return false;
  };

  getUserVerify = () => {
    return fetch(`${Global.BASE_URL}/order/verifyAddress`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: this.USER_ADDRESS,
      }),
    });
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // drop-down list and input amount functions
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
  // check the amount of tokens that user has allowed Matic Root contract to spend
  // authorize transfers to Matic Network, then deposit MANA to Matic Network
  depositManaToMatic = async () => {
    try {
      this.props.showSpinner();
      const amountWei = (this.state.amount * Global.FACTOR).toString();

      // check the amount of tokens that user has allowed Matic Root contract to spend
      let allowedAmount = await Global.getAllowedToken(
        Global.ROPSTEN_TOKEN,
        Global.DEPOSITMANAGER_ADDRESS, // ROOTCHAIN_ADDRESS
        this.USER_ADDRESS
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('allowed amount: ' + allowedAmount);

      // if not allowed, or lower than necessary amount, approve user funds for Matic Root contract to spend
      if (allowedAmount == 0)
        await Global.approveToken(
          Global.ROPSTEN_TOKEN,
          Global.MAX_AMOUNT,
          Global.DEPOSITMANAGER_ADDRESS, // ROOTCHAIN_ADDRESS
          this.USER_ADDRESS
        );
      else if (allowedAmount < this.state.amount) {
        await Global.approveToken(
          Global.ROPSTEN_TOKEN,
          0,
          Global.DEPOSITMANAGER_ADDRESS, // ROOTCHAIN_ADDRESS
          this.USER_ADDRESS
        );
        await Global.approveToken(
          Global.ROPSTEN_TOKEN,
          Global.MAX_AMOUNT,
          Global.DEPOSITMANAGER_ADDRESS, // ROOTCHAIN_ADDRESS
          this.USER_ADDRESS
        );
      }

      console.log('maximum amount: ' + Global.MAX_AMOUNT);

      // finally deposit MANA from the main net to Matic and update status in database
      const txHash = await Global.depositTokenToMatic(
        Global.ROPSTEN_TOKEN,
        amountWei,
        this.USER_ADDRESS
      );

      if (txHash != false) {
        console.log('tx hash: ' + txHash);

        let ret = await this.updateHistory(
          this.state.amount,
          'Deposit',
          'In Progress',
          txHash
        );

        if (!ret) {
          console.log('network error');
          this.setState({ isValidDeposit: 1 }); // invalid deposit
          this.props.hideSpinner();

          console.log('invalid deposit');
          return;
        }

        ret = await Global.getConfirmedTx(txHash); // return confirmation hash
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

        if (!ret) {
          console.log('network error');
          this.setState({ isValidDeposit: 1 }); // invalid deposit
          this.props.hideSpinner();

          console.log('invalid deposit');
          return;
        }

        if (this.state.userStepValue < 6) {
          console.log('updating step value to 5');

          await this.postUserVerify(5); // update database to 'authorize'
        } else if (this.state.userStepValue == 6) {
          console.log('step value is 6');

          this.handleClose();
          setTimeout(this.props.update, 5000); // set user token balance from MetaMask
        }

        this.setState({ isValidDeposit: 2 }); // valid deposit
        this.props.hideSpinner();

        console.log('valid deposit');
        return;
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({ isValidDeposit: 1 }); // invalid deposit
    this.props.hideSpinner();
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // returns the amount of MANA our contract is approved to spend on behalf of the user
  // then allows our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
  authorizeMana = async () => {
    try {
      this.props.showSpinner();

      const contractAddress = Global.MASTER_CONTRACT_ADDRESS();
      var allowedAmount = await Global.getAllowedToken(
        Global.MATIC_TOKEN,
        contractAddress,
        this.USER_ADDRESS
        // this.maticWeb3
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      if (allowedAmount == 0)
        await Global.approveToken(
          Global.MATIC_TOKEN,
          Global.MAX_AMOUNT,
          contractAddress,
          this.USER_ADDRESS
          // this.maticWeb3
        );
      else if (allowedAmount < this.state.amount || this.state.amount == 0) {
        await Global.approveToken(
          Global.MATIC_TOKEN,
          0,
          contractAddress,
          this.USER_ADDRESS
          // this.maticWeb3
        );
        await Global.approveToken(
          Global.MATIC_TOKEN,
          Global.MAX_AMOUNT,
          contractAddress,
          this.USER_ADDRESS
          // this.maticWeb3
        );
      }

      await this.postUserVerify(6); // update database to 'deposit'
      await this.postUserAuthState(this.props.authvalue); // update database
      this.setState({ isValidAuthorize: 2 }); // indicate authorization success

      this.props.hideSpinner();
      this.handleClose();
      setTimeout(this.props.update, 5000); // set user token balance from MetaMask
    } catch (err) {
      this.setState({ isValidAuthorize: 1 }); // indicate authorization failure
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
  // get balances on main net and Matic networks
  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken(Global.ROPSTEN_TOKEN);
      const amount2 = await Global.balanceOfToken(
        Global.MATIC_TOKEN,
        this.maticWeb3
      );

      this.setState({
        tokenBalanceL1: (amount1 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
      this.setState({
        tokenBalanceL2: (amount2 / Global.FACTOR)
          .toFixed(2)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      });
    } catch (err) {
      console.log(err);
    }
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // prerender check modal content
  prerenderCheck = (text, image) => {
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
              <Grid.Column>
                <ModalSidebar checked={0} />
                <DepositContent
                  content={'changeRPC'}
                  text={text}
                  image={image}
                />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      </Modal>
    );
  };

  verifyNetwork = () => {
    window.web3.version.getNetwork((err, network) => {
      this.setState({ networkID: parseInt(network) }); // set network ID
    });
  };

  render() {
    /////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////
    // pre-render checks: verify user is on correct network, step value == 2, and using MetaMask
    this.verifyNetwork();
    let content = '';

    if (this.state.networkID !== 3) {
      content = this.prerenderCheck(
        "In MetaMask, open the Network dropdown menu and select 'Ropsten'",
        1
      );
      return content;
    }

    if (this.state.userStepValue === 0) {
      content = this.prerenderCheck('', 0);
      return content;
    }

    if (this.state.userStepValue === 1) {
      content = this.prerenderCheck('Please finish verification to Deposit', 0);
      return content;
    }

    if (!this.isBrowserMetamsk) {
      content = this.prerenderCheck(
        'Please use Chrome Browser with Metamask enabled to proceed',
        0
      );
      return content;
    }

    if (this.state.userStepValue == 4) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // authorize transfers to Matic Network, then deposit MANA to Matic Network
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
                <Grid.Column>
                  <ModalSidebar checked={1} />
                  <DepositContent
                    content={'approve'} // content type
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    depositManaToMatic={this.depositManaToMatic}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    } else if (
      this.state.userStepValue == 5 // || this.state.isValidDeposit == 2
    ) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
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
                <Grid.Column>
                  <ModalSidebar checked={2} />
                  <DepositContent
                    content={'authorize'} // content type
                    isValidAuthorize={this.state.isValidAuthorize}
                    authorizeMana={this.authorizeMana}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    } else if (this.state.userStepValue == 6) {
      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // user has finished initial authorization/deposit process and wishes to deposit more MANA to Matic Network
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
                <Grid.Column>
                  <ModalSidebar checked={3} />
                  <DepositContent
                    content={'deposit'} // content type
                    isCustomAmount={this.state.isCustomAmount}
                    isValidDeposit={this.state.isValidDeposit}
                    amount={this.state.amount}
                    tokenBalanceL1={this.state.tokenBalanceL1}
                    tokenBalanceL2={this.state.tokenBalanceL2}
                    onChangeAmount={this.onChangeAmount}
                    onChangeCustomAmount={this.onChangeCustomAmount}
                    depositManaToMatic={this.depositManaToMatic}
                  />
                </Grid.Column>
              </Grid>
            </div>
          </div>
        </Modal>
      );
    }
  }
}

export default Deposit;
