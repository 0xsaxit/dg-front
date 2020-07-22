import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Grid, Modal } from 'semantic-ui-react';
import ContentVerify from './ContentVerify';
import Global from '../Constants';

const ModalVerify = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [modalState, setModalState] = useState(false);
  const [statusMetaMask, setStatusMetaMask] = useState(1);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    // if not using Safari browser set MetaMask status = 2
    if (window.safari == undefined) {
      setStatusMetaMask(2);
    }

    // if MetaMask is enabled set MetaMask status = 3
    if (window.ethereum) {
      setStatusMetaMask(3);
    }
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // handle opening and closing modal or MetaMask popup
  function getTrigger() {
    return (
      <Button
        content="CONNECT METAMASK"
        color="blue"
        className="metamask-button"
        onClick={handleOpen}
      />
    );
  }

  function handleOpen() {
    if (statusMetaMask == 3) {
      onMetaMask();
    } else {
      setModalState(true);
    }
  }

  function handleClose() {
    setModalState(false);
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // update user status to 4 both locally and in the database
  async function onMetaMask() {
    await window.ethereum.enable(); // open MataMask for login

    // set the user's wallet address and update user status to 4
    userAddress = window.web3.currentProvider.selectedAddress;
    updateStatus(4);
  }

  function updateStatus(step) {
    console.log('Updating user status to: ' + step);

    // update global state user status
    dispatch({
      type: 'update_status',
      data: step,
    });

    // update user status in database
    postUserVerify(step);
  }

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

  return (
    <Modal
      trigger={getTrigger()}
      open={modalState}
      onClose={handleClose}
      closeIcon
    >
      {statusMetaMask == 1 ? (
        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              <Grid.Column>
                <ContentVerify content={'chrome'} />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      ) : statusMetaMask == 2 ? (
        <div id="deposit">
          <div className="ui depositContainer">
            <Grid verticalAlign="middle" textAlign="center">
              <Grid.Column>
                <ContentVerify content={'metamask'} />
              </Grid.Column>
            </Grid>
          </div>
        </div>
      ) : null}
    </Modal>
  );
};

export default ModalVerify;
