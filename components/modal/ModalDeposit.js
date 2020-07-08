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
  // get user's transaction history from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  let userAddress = '';
  let tokenContract = {};

  //     amount: Global.DEFAULT_AMOUNT,
  //     isCustomAmount: 0,
  //     stepValue: 0,
  //     networkID: 0,
  //     isValidDeposit: 0,
  //     isValidAuthorize: 0,
  //     modalOpen: false,
  //     processing: false,
  //   this.userAddress = '';
  //   this.tokenContract = {};

  // define local variables
  const [amount, setAmount] = useState(Global.DEFAULT_AMOUNT);
  const [customAmount, setCustomAmount] = useState(0);
  const [networkID, setNetworkID] = useState(0);
  const [modalState, setModalState] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [validDeposit, setValidDeposit] = useState(0);
  const [validAuthorize, setValidAuthorize] = useState(0);
  const [validLocation, setValidLocation] = useState(0);

  useEffect(() => {
    if (window.web3) {
      // set user address and network ID
      userAddress = window.web3.currentProvider.selectedAddress;
      window.web3.version.getNetwork((err, network) => {
        setNetworkID(parseInt(parseInt(network)));
      });

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

    if (String(value) != 'NaN') {
      setAmount(parseInt(e.target.value));
    } else {
      setAmount(0);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening or closing this modal
  function getTrigger() {
    if (props.isLink) {
      return (
        <Button className="account-deposit-button" onClick={handleOpen}>
          DEPOSIT
        </Button>
      );
    } else {
      return (
        <Button className="modal-deposit-button" onClick={handleOpen}>
          ADD CRYPTO
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // verify users location and update the userStatus value in the Context API store

  function verifyLocation() {
    // dispatch({
    //   type: 'update_status',
    //   data: 4.5,
    // });

    updateStatus(true, 4.5); // TODO: actually verify location via IP grab
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // check the amount of tokens that user has allowed Matic Root contract to spend
  // authorize transfers to Matic Network, then deposit MANA to Matic Network
  async function depositToMatic() {
    try {
      setProcessing(true);

      // check the amount of tokens that user has allowed Matic contract to spend
      let allowedAmount = await Global.getAllowedToken(
        tokenAddressRoot,
        userAddress
      );
      allowedAmount = allowedAmount / Global.FACTOR;

      console.log('allowed amount: ' + allowedAmount);
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

      // now deposit tokens from Mainnet to Matic Network
      const txHash = await Global.depositTokenToMatic(
        tokenAddressRoot,
        amountWei,
        userAddress
      );
      if (txHash !== false) {
        setModalState(false);

        let ret = await updateHistory(amount, 'Deposit', 'In Progress', txHash);
        if (!ret) networkErrror(); // network error

        ret = await Global.getConfirmedTx(txHash); // return confirmation hash
        console.log('confirmation: ' + ret);

        if (ret.status == '0x0') {
          ret = await updateHistory(amount, 'Deposit', 'Failed', txHash);

          if (!ret) networkError(); // network error
        } else {
          ret = await updateHistory(amount, 'Deposit', 'Confirmed', txHash);

          if (!ret) networkError(); // network error
        }

        if (state.userStatus < 6) {
          console.log('updating step value to 5');

          // set this from our set status method ******************************************
          await postUserVerify(5); // update verify to 'authorize'

          // setState({ stepValue: 5 }); // advance to auth step
          // dispatch({
          //   type: 'update_status',
          //   data: 5,
          // });

          updateStatsus(true, 5);
        } else if (state.userStatus == 6) {
          // change user status back to 5.5 and set to 6 again after deposit complete *********************
          // handleModal(false); // ******************************************

          // // advance to confirmation step // *****************************
          // dispatch({
          //   type: 'update_status',
          //   data: 5.5,
          // });

          updateStatus(false, 5.5);
        }

        // setState({ isValidDeposit: 2 }); // valid deposit
        setValidDeposit(2);

        console.log('tx hash: ' + txHash);
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);

      // setState({ isValidDeposit: 1 }); // invalid deposit
      setValidDeposit(1);

      setProcessing(false);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // Biconomy API meta-transaction - allow our contract to spend Global.MAX_AMOUNT of tokens on user's behalf
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

        // setState({ isValidAuthorize: 1 }); // invalid authorize
        setValidAuthorize(1);

        setProcessing(false);

        return;
      } else {
        let ret = await updateHistory(
          Global.MAX_AMOUNT,
          'Authorization',
          'Confirmed',
          txHash
        );
        if (!ret) networkErrror(); // network error

        // change user status back to 5.5 and set to 6 again after deposit complete *********************
        await postUserVerify(6); // update verify to 'deposit'

        // handleModal(false); // ******************************************

        // dispatch({
        //   type: 'update_status',
        //   data: 5.5,
        // });

        updateStatus(false, 5.5);

        // setState({ isValidAuthorize: 2 }); // valid authorize
        setValidAuthorize(2);
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);

      // setState({ isValidAuthorize: 1 }); // invalid authorize
      setValidAuthorize(1);

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
        address: window.web3.currentProvider.selectedAddress,
        verifyStep: step,
      }),
    });
  }

  async function updateHistory(_amount, type, state, txHash = '') {
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
      console.log(error);
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
        address: window.web3.currentProvider.selectedAddress,
        _amount,
        type,
        state,
        txHash,
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
    let value;
    if (state.userStatus < 6) {
      value = state.userStatus + 0.5;
    } else {
      value = 4;
    }

    // dispatch({
    //   type: 'update_status',
    //   data: value,
    // });

    let toggle;
    if (value == 5.5) {
      toggle = false;
    } else {
      toggle = true;
    }

    updateStatus(toggle, value);
  }

  function updateStatus(toggle, value) {
    if (toggle) {
      handleOpen();
    } else {
      handleClose();
    }

    dispatch({
      type: 'update_status',
      data: value,
    });
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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
              ) : state.userStatus == 4.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // allow our treasury contract to spend up to Global.MAX_AMOUNT of tokens on user's behalf
                <Grid.Column>
                  <ContentDeposit
                    content={'authorize'} // content type
                    validAuthorize={validAuthorize}
                    authorizeMana={metaTransaction}
                    processing={processing}
                    nextStep={nextStep}
                  />
                </Grid.Column>
              ) : state.userStatus == 5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // authorize transfers to Matic Network, then deposit MANA to Matic Network
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
              ) : state.userStatus == 5.5 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // deposit confirmation pending message
                <Grid.Column>
                  <ContentDeposit
                    content={'pending'} // content type
                    nextStep={nextStep}
                  />
                </Grid.Column>
              ) : state.userStatus == 6 ? (
                /////////////////////////////////////////////////////////////////////////////////////////
                /////////////////////////////////////////////////////////////////////////////////////////
                // user has finished onboard process and wishes to deposit more MANA to Matic Network
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
