import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ContentDeposit from './ContentDeposit';
import SwitchRPC from './SwitchRPC';
import Global from '../Constants';

let web3 = {};
let tokenAddressRoot = '';
let spenderAddress = '';

async function getAddresses() {
  const addresses = await Global.API_ADDRESSES;

  tokenAddressRoot = addresses.ROOT_TOKEN_ADDRESS_MANA;
  spenderAddress = addresses.TREASURY_CONTRACT_ADDRESS;
}
getAddresses();

const ModalDeposit = (props) => {
  // get user's onboard status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amount, setAmount] = useState(Global.DEFAULT_AMOUNT);
  const [customAmount, setCustomAmount] = useState(0);
  const [networkID, setNetworkID] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [validDeposit, setValidDeposit] = useState(0);
  const [validAuthorize, setValidAuthorize] = useState(0);
  const [validLocation, setValidLocation] = useState(0);

  let userAddress = '';
  let tokenContract = {};

  useEffect(() => {
    if (window.web3) {
      // set user address and network ID
      userAddress = window.web3.currentProvider.selectedAddress;
      window.web3.version.getNetwork((err, network) => {
        setNetworkID(parseInt(parseInt(network)));
      });

      // initialize Web3 providers and create token contract instance
      // (MetaMask provider for web3 and Biconomy provider for getWeb3)
      web3 = new Web3(window.ethereum);
      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.MATIC_URL),
        {
          apiKey: Global.BICONOMY_API_KEY,
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
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // drop-down list functions
  function onChangeAmount(e, d) {
    if (d.value == -1) {
      setAmount(0);
      setCustomAmount(1);

      return;
    }

    setAmount(d.value);
  }

  function changeCustomAmount(e) {
    let value = parseInt(e.target.value);

    if (String(value) !== 'NaN') {
      setAmount(parseInt(e.target.value));
    } else {
      setAmount(0);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal and the message box
  function getTrigger() {
    if (props.menuLink) {
      return (
        <Button className="modal-deposit-button" onClick={handleOpen}>
          ADD CRYPTO
        </Button>
      );
    } else {
      return (
        <Button className="account-deposit-button" onClick={handleOpen}>
          DEPOSIT
        </Button>
      );
    }
  }

  function handleOpen() {
    setModalState(true);
  }

  function handleClose() {
    setModalState(false);
  }

  function openMessageBox() {
    handleClose();

    dispatch({
      type: 'message_box',
      data: 1,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify user's location and update the userStatus value in the Context API store
  function verifyLocation() {
    updateStatus(5, true); // TODO: actually verify location via IP grab
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // check the amount of tokens that user has allowed Matic root contract to spend
  // approve transfers to Matic Network, then deposit root token to Matic Network
  async function depositToMatic() {
    try {
      setProcessing(true);

      // check the amount of tokens that user has allowed Matic contract to spend
      let allowedAmount = await Global.getAllowedToken(
        tokenAddressRoot,
        userAddress
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('Allowed amount: ' + allowedAmount);
      const amountWei = web3.utils.toWei(amount + '');

      if (allowedAmount == 0) {
        await Global.approveToken(
          tokenAddressRoot,
          Global.MAX_AMOUNT,
          userAddress
        );
      } else if (allowedAmount < amount) {
        await Global.approveToken(tokenAddressRoot, 0, userAddress);
        await Global.approveToken(
          tokenAddressRoot,
          Global.MAX_AMOUNT,
          userAddress
        );
      }

      console.log('Amount to deposit: ' + amount);

      // now deposit tokens from root network to Matic Network
      const txHash = await Global.depositTokenToMatic(
        tokenAddressRoot,
        amountWei,
        userAddress
      );

      if (txHash !== false) {
        // update transaction history status to 'in progress'
        let ret = await updateHistory(amount, 'Deposit', 'In Progress', txHash);
        if (!ret) networkError();

        // when we receive confirmation hash update transaction history status to 'confirmed'
        ret = await Global.getConfirmedTx(txHash);
        console.log('Confirmation: ' + ret.transactionHash);

        if (ret.status == '0x0') {
          ret = await updateHistory(amount, 'Deposit', 'Failed', txHash);
          if (!ret) networkError();
        } else {
          ret = await updateHistory(amount, 'Deposit', 'Confirmed', txHash);
          if (!ret) networkError();
        }

        // proceed to the next step
        if (state.userStatus < 7) {
          updateStatus(6, true); // advance to 'authorize' step
        } else if (state.userStatus == 7) {
          openMessageBox(); // close the deposit modal and open message box
        }

        setValidDeposit(2); // valid deposit
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);

      setValidDeposit(1); // invalid deposit
      setProcessing(false);
    }
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
      if (txHash == false) {
        console.log('authorization failed');

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
        openMessageBox(); // close the deposit modal and open message box

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
  // REST API functions: update user transaction history and onboard status in database
  function postUserVerify(step) {
    return fetch(`${Global.API_BASE_URL}/order/updateUserVerify`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
        verifyStep: step,
      }),
    });
  }

  async function updateHistory(_amount, type, state, txHash) {
    console.log('Writing to database: ' + state);

    try {
      const response = await postHistory(_amount, type, state, txHash);
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

  async function postHistory(_amount, type, state, txHash) {
    return fetch(`${Global.API_BASE_URL}/order/updateHistory`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: userAddress,
        amount: _amount,
        type,
        state,
        txHash,
        step: state.userStatus,
      }),
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
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

      postUserVerify(value);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify correct network
  if (networkID !== Global.PARENT_NETWORK_ID) return switchRPC();

  return (
    <div>
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
              ) : state.userStatus == 5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // authorize transfers to Matic Network, then deposit root tokens to Matic Network
                <Grid.Column>
                  <ContentDeposit
                    content={'approve'} // content type
                    validDeposit={validDeposit}
                    amount={amount}
                    customAmount={customAmount}
                    onChangeAmount={onChangeAmount}
                    changeCustomAmount={changeCustomAmount}
                    depositToMatic={depositToMatic}
                    processing={processing}
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
              ) : state.userStatus == 7 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // user has finished onboard process and wishes to deposit more root tokens to Matic Network
                <Grid.Column>
                  <ContentDeposit
                    content={'deposit'} // content type
                    validDeposit={validDeposit}
                    amount={amount}
                    customAmount={customAmount}
                    onChangeAmount={onChangeAmount}
                    changeCustomAmount={changeCustomAmount}
                    depositToMatic={depositToMatic}
                    processing={processing}
                    nextStep={nextStep}
                  />
                </Grid.Column>
              ) : null}
            </Grid>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDeposit;
