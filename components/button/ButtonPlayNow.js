import { useState, useContext, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Button, Modal, Icon } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Fetch from '../../common/Fetch';
import Aux from '../_Aux';

const ButtonPlayNow = () => {
  // dispatch new user status to Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [binance, setBinance] = useState(false);
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [connectPressed, setConnectPressed] = useState(false);
  const [connectedPlay, setConnectedPlay] = useState();
  const [secondOpen, setSecondOpen] = useState(false);

  const router = useRouter();
  let userAddress = '';

  useEffect(() => {
    if (router.pathname.includes('binance')) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  function pressed() {
    setConnectPressed(true);
  };

  useEffect(() => {
    (async function () {
      if (metamaskEnabled) {
        // open MetaMask for login then get the user's wallet address
        await window.ethereum.enable();
        userAddress = window.ethereum.selectedAddress;
        
        if (connectPressed && userAddress) {
          setConnectedPlay(true);
        } 
      }
    })();
  }, []);

  console.log('?????');
  console.log(connectPressed);
  console.log(connectedPlay);
  console.log(state.userStatus);

  async function openMetaMask() {
    if (metamaskEnabled) {
      // open MetaMask for login then get the user's wallet address
      await window.ethereum.enable();
      userAddress = window.ethereum.selectedAddress;

      // track MetaMask connect event
      analytics.track('Connected MetaMask', {
        userAddress: userAddress,
      });

      // dispatch user address to the Context API store
      dispatch({
        type: 'user_address',
        data: userAddress,
      });

      // set global user status based on value stored in database
      // if new wallet update user status to 4 both locally and in the database
      // (/websiteLogin API call will return error with new wallet address)
      const response = await getUserStatus();

      if (response) {
        updateStatus(response, false);
      } else {
        updateStatus(4, true);
      }
    }
  }

  async function updateStatus(value, post) {
    if (post) {
      console.log('Posting user status to db: ' + value);

      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      // update user status in database
      await Fetch.REGISTER(userAddress, '', state.affiliateAddress);

      // update global state user status after fetch is complete
      dispatch({
        type: 'update_status',
        data: value,
      });
    } else {
      // update global state user status immediately
      dispatch({
        type: 'update_status',
        data: value,
      });
    }
  }

  async function getUserStatus() {
    console.log('Get user status: Play Now');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      const responseStatus = await Fetch.USER_STATUS(userAddress, '');
      const jsonStatus = await responseStatus.json();

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Play Now');

      return false;
    }
  }

  return (
    <Aux>
      {1 > 0 ? (
        <Modal
          className="connect-metamask-modal"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={true}
        >
          <div style={{ margin: '-60px 0px 50px -30px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>

          <h3 style={{ textAlign: 'left' }}>  Connect Your Wallet </h3>

          <Button
            color="blue"
            className={binance ? "metamask-button binance big" : "metamask-button big"}
            onClick={() => {
              openMetaMask();
              pressed();
            }}
          >
            <span>
              <img 
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
                style={{ height: '36px', paddingRight: '24px', marginBottom: '-12px' }} 
              />
              Connect Metamask
            </span>
          </Button>

          <div>
            <p className="modal-text-small">
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io"> Metamask wallets </a>. We will never have access to your private keys and we can not access your funds without your direct confirmation.{' '}
            </p>
            <p className="modal-text-small" style={{ marginBottom: '-10px' }}>
              {' '}
              For the other casinos,{' '}
              <a className="modal-a" href="https://metamask.io"> click here </a>.
            </p>
          </div>
        </Modal>
      ) : <div> imma poos </div>}

      {state.userAddress ? (
        <Modal
          onClose={() => setOpenTwo(false)}
          open={true}
        >
          <div> imma poos </div>
        </Modal>
      ) : <p> hello </p>}
    </Aux>
  );
};

export default ButtonPlayNow;
