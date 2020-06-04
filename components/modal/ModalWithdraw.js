import React from 'react';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ModalSidebar from './ModalSidebar';
import ContentWithdraw from './contentWithdraw';
import SwitchRPC from './switchRPC';
import Global from '../constants';

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

    this.USER_ADDRESS = '';
    this.isBrowserMetaMask = 0;
    this.maticWeb3 = {};
  }

  async componentDidMount() {
    this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    if (window.web3) this.isBrowserMetaMask = 1;

    // set maticWeb3 provider, get token balances, and set userStepValue
    this.maticWeb3 = new window.Web3(
      new window.Web3.providers.HttpProvider(Global.MATIC_URL)
    );
    await this.getTokenBalance();
    const userStatus = await this.checkUserVerify();

    console.log('userStepValue status: ' + userStatus);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on main net and Matic networks, and drop-down list function
  getTokenBalance = async () => {
    try {
      const amount1 = await Global.balanceOfToken('ropsten');
      const amount2 = await Global.balanceOfToken('matic', this.maticWeb3);

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
          return true;
        }

        let stepValue = parseInt(json.result);
        this.setState({ userStepValue: stepValue });

        return true;
      }
    } catch (error) {
      console.log(error);
    }

    this.props.hideSpinner();
    return false;
  };

  getUserStatus = () => {
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
  burnOnMatic = () => {
    networkAgnosticBurn(maticAmount, childTokenAddress);
  };

  getContractDetails = async (pAddress) => {
    let abi;
    if (pAddress === CHILD_ETH_TOKEN_ADDRESS) abi = CHILD_ETH_TOKEN_ABI;
    else abi = CHILD_TOKEN_ABI;
    const contract = new getWeb3.eth.Contract(abi, pAddress);
    const tokenName = await contract.methods.name().call();
    console.log(tokenName);
    let domainData = {
      name: tokenName,
      version: '1',
      chainId: parentChainId,
      verifyingContract: pAddress,
    };
    return { contract, domainData };
  };

  networkAgnosticBurn = async (pAmount, address) => {
    const detail = await getContractDetails(address);
    const amount = web3.utils.toWei(pAmount + '');
    let functionSignature = detail.contract.methods
      .withdraw(amount)
      .encodeABI();
    console.log(functionSignature);
    executeMetaTransaction(
      functionSignature,
      detail.contract,
      detail.domainData
    );
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
    let value = this.state.userStepValue + 1;
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
                  <ModalSidebar checked={1} />
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
                  <ModalSidebar checked={2} />
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
