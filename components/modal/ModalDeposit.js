import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ContentDeposit from './ContentDeposit';
import SwitchRPC from './SwitchRPC';

// import Aux from '../_Aux';
import MaticWidget from '../home/MaticWidget';

import Global from '../Constants';

// let tokenAddressRoot = '';
let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  // tokenAddressRoot = addresses.ROOT_TOKEN_ADDRESS_MANA;
  spenderAddress = addresses.TREASURY_CONTRACT_ADDRESS;
}
getAddresses();

const ModalDeposit = (props) => {
  // get user's onboard status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  // const [amount, setAmount] = useState(Global.DEFAULT_AMOUNT);
  // const [customAmount, setCustomAmount] = useState(0);

  const [networkID, setNetworkID] = useState(0);

  const [modalState, setModalState] = useState(false);
  const [processing, setProcessing] = useState(false);

  // const [validDeposit, setValidDeposit] = useState(0);

  const [validLocation, setValidLocation] = useState(0);
  const [validAuthorize, setValidAuthorize] = useState(0);

  const [buttonWidget, setButtonWidget] = useState(false);

  let userAddress = '';
  let tokenContract = {};
  let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      window.web3.version.getNetwork((err, network) => {
        setNetworkID(parseInt(parseInt(network)));
      });
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus) {
      // set user address and network ID
      userAddress = window.web3.currentProvider.selectedAddress;

      // window.web3.version.getNetwork((err, network) => {
      //   setNetworkID(parseInt(parseInt(network)));
      // });

      // initialize Web3 providers and create token contract instance
      // (pass MetaMask provider for web3 and Biconomy provider for getWeb3)
      web3 = new Web3(window.ethereum);
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy);
      tokenContract = Global.getTokenContract('child', getWeb3);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Deposit');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // useEffect(() => {
  //   if (state.userStatus) {
  //     <script
  //       src="https://wallet.matic.today/embeds/widget-button.js"
  //       data-script-name="matic-embeds"
  //     ></script>;

  //     setButtonWidget(true);
  //   }
  // }, [state.userStatus]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal and the message box
  // function getTrigger() {
  //   if (1 == 0) {
  //     return (
  //       <Button className="modal-deposit-button" onClick={handleOpen}>
  //         AUTHORIZE CONTRACT
  //       </Button>
  //     );
  //   } else {
  //     // if (state.userStatus < 7) {
  //     //   return (
  //     //     <Button className="account-deposit-button" onClick={handleOpen}>
  //     //       DEPOSIT
  //     //     </Button>
  //     //   );
  //     // } else {

  //     return <MaticWidget />;

  //     // }
  //   }
  // }

  function getTrigger() {
    if (props.menuLink) {
      return (
        <MaticWidget style={'account-deposit-button'} label={'ADD CRYPTO'} />
      );
    } else {
      if (state.userStatus < 7) {
        return (
          <Button className="balances-deposit-button" onClick={handleOpen}>
            DEPOSIT
          </Button>
        );
      } else {
        return maticWidget();
      }
    }
  }

  function handleOpen() {
    setModalState(true);
  }

  function handleClose() {
    setModalState(false);
  }

  // function openMessageBox() {
  //   handleClose();

  //   dispatch({
  //     type: 'message_box',
  //     data: 1,
  //   });
  // }

  // function maticWidget() {
  //   return (
  //     <Aux>
  //       <button
  //         class="matic-widget-button"
  //         data-default-page="home"
  //         data-wapp-id="xeYvesZxGiEKOMt4gq3s"
  //       >
  //         DEPOSIT
  //       </button>
  //       <script
  //         src="https://wallet.matic.today/embeds/widget-button.js"
  //         data-script-name="matic-embeds"
  //       ></script>
  //     </Aux>
  //   );
  // }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify user's location and update the userStatus value in the Context API store
  function verifyLocation() {
    updateStatus(5, true); // TODO: actually verify location via IP grab
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction. Authorize our contract to spend MAX_AMOUNT of tokens on user's behalf
  async function metaTransaction() {
    try {
      setProcessing(true);

      console.log('Matic RPC: ' + Global.MATIC_URL);
      console.log('user address: ' + userAddress);
      console.log('spender (treasury) address: ' + spenderAddress);
      console.log('authorize amount: ' + Global.MAX_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.MAX_AMOUNT)
        .encodeABI();

      const txHash = await Global.executeMetaTransaction(
        functionSignature,
        tokenContract,
        userAddress,
        web3
      );

      // update transaction history to 'confirmed'
      if (txHash == false) {
        setValidAuthorize(1); // invalid authorize
        setProcessing(false);

        return;
      } else {
        let ret = await updateHistory(
          Global.MAX_AMOUNT,
          'Authorization',
          'Confirmed',
          txHash
        );
        if (!ret) networkError();

        updateStatus(7, true); // update user status to 7
        // openMessageBox(); // close the deposit modal and open message box

        setValidAuthorize(2); // valid authorize
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);

      setValidAuthorize(1); // invalid authorize
      setProcessing(false);
    }
  }

  function networkError() {
    console.log('network error');

    setProcessing(false);
    return;
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  async function updateHistory(_amount, type, state, txHash) {
    console.log('Writing to database: ' + state);

    try {
      const response = await Global.postHistory(
        userAddress,
        _amount,
        type,
        state,
        txHash,
        state.userStatus
      );
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
  }

  function switchRPC() {
    return (
      <Modal
        trigger={getTrigger()}
        open={modalState}
        onClose={handleClose}
        closeIcon
      >
        <SwitchRPC />
      </Modal>
    );
  }

  function nextStep() {
    let value = 0;

    if (state.userStatus < 7) {
      value = state.userStatus + 1;
    } else {
      value = 4;
    }

    updateStatus(value, false);
  }

  function updateStatus(value, post) {
    console.log('Updating user status to: ' + value);

    // update global state user status
    dispatch({
      type: 'update_status',
      data: value,
    });

    // update user status in database
    if (post) {
      console.log('Posting user status to db: ' + value);

      Global.postUserVerify(userAddress, value);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify correct network
  if (networkID !== Global.PARENT_NETWORK_ID) return switchRPC();

  return (
    <Modal
      trigger={getTrigger()}
      open={modalState}
      onClose={handleClose}
      closeIcon
    >
      <div id="deposit">
        <div className="ui depositContainer">
          <Grid verticalAlign="middle" textAlign="center">
            {state.userStatus == 4 ? (
              /////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////
              // check the user is in a whitelisted jurisdiction
              <Grid.Column>
                <ContentDeposit
                  content={'location'} // content type
                  verifyLocation={verifyLocation}
                  validLocation={validLocation}
                  nextStep={nextStep}
                />
              </Grid.Column>
            ) : state.userStatus == 6 ? (
              /////////////////////////////////////////////////////////////////////////////////////////
              /////////////////////////////////////////////////////////////////////////////////////////
              // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
              <Grid.Column>
                <ContentDeposit
                  content={'authorize'} // content type
                  validAuthorize={validAuthorize}
                  metaTransaction={metaTransaction}
                  processing={processing}
                  nextStep={nextStep}
                />
              </Grid.Column>
            ) : null}
          </Grid>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeposit;
