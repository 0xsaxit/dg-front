import React from 'react';
import { Button, Grid, Modal, Container } from 'semantic-ui-react';
import ContentWithdraw from './ContentWithdraw';

class Withdraw extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userStepValue: 0,
      modalOpen: false,
    };

    this.USER_ADDRESS = '';
    this.isBrowserMetaMask = 0;
  }

  async componentDidMount() {
    this.USER_ADDRESS = window.web3.currentProvider.selectedAddress;
    if (window.web3) this.isBrowserMetaMask = 1;

    // set userStepValue
    const userStatus = await this.checkUserVerify();

    console.log('userStepValue status: ' + userStatus);
  }

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
      const response = await this.getUserVerify();
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  prerenderCheck = (text, image) => {
    return (
      <Modal
        trigger={this.getTrigger()}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        closeIcon
      >
        <div id="deposit">
          <Container style={{ height: '35em' }}>
            {/* <Grid
              style={{ marginTop: '17em' }}
              verticalAlign="middle"
              textAlign="center"
            >
              <p className="modal-p">{text}</p>
            </Grid> */}

            <ContentWithdraw
              content={'prerenderCheck'}
              text={text}
              image={image}
            />
          </Container>
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

    // if (!this.isBrowserMetaMask) {
    //   const content = this.prerenderCheck(
    //     'Please use Chrome Browser with MetaMask enabled to proceed',
    //     0
    //   );
    //   return content;
    // }

    if (this.state.networkID !== 3) {
      const content = this.prerenderCheck(
        "In MetaMask, open the Network dropdown menu and select 'Ropsten'",
        1
      );
      return content;
    }

    if (this.state.userStepValue < 4) {
      const content = this.prerenderCheck(
        "Please click the 'Deposit' link to deposit and authorize MANA on Matic Network",
        0
      );
      return content;
    }

    return <div>foo foo foo...</div>;
  }
}

export default Withdraw;
