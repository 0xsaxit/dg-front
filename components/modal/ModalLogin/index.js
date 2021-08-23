import { useEffect, useContext, useState } from 'react';
import Web3 from 'web3';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Fetch from 'common/Fetch';
import cn from 'classnames';
import Wallet from 'assets/svg/wallet.svg';
import MetaMask from 'assets/svg/metamask.svg';

import styles from './ModalLogin.module.scss';


const ModalLogin = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);

  // using Safari browser
  useEffect(() => {
    if (window.safari !== undefined) {
      setSafari(true);
    }
  }, []);

  // get network ID
  useEffect(() => {
    if (window.ethereum) {
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      (async () => {
        const networkID = await web3.eth.net.getId();

        dispatch({
          type: 'network_id',
          data: networkID,
        });
      })();
    }
  }, []);

  let userAddress = '';

  useEffect(() => {
    if (window.ethereum) {
      setMetamaskEnabled(true);
    } else {
      setMetamaskEnabled(false);
    }
  });

  const openMetaMask = async () => {
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

  const updateStatus = async (value, post) => {
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

  const getUserStatus = async () => {
    console.log('Get user status: Connect');

    try {
      // const responseIP = await Fetch.IP_ADDRESS();
      // const jsonIP = await responseIP.json();

      const responseStatus = await Fetch.USER_STATUS(userAddress, '');
      const jsonStatus = await responseStatus.json();

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Connect');

      return false;
    }
  }

  return (
    <span>
      {state.networkID ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <Button className={styles.play_now_modal}>
              Play Now
            </Button>
          }
        >
        <div className={styles.connect_metamask_modal_svg}>
          <span className={styles.button_close} onClick={() => setOpen(false)}>
            <Wallet />
          </span>
        </div>

          <div>
            <p className={styles.title}>Connect Your Wallet</p>
            <button
              className={cn('btn btn-primary w-100', styles.busd_button)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span className="d-flex justify-content-center">
                <img
                  className={styles.metamask_img}
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
                />
                Connect Metamask
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask" target="_blank"> Metamask wallets </a>. We will never have access to your private keys and we can not access your funds without your direct confirmation.{' '}
            </p>
          </div>
        </Modal>
      ) : safari ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <Button className={styles.play_now_modal}>
              Play Now
            </Button>
          }
        >
          <div className={styles.connect_metamask_modal_svg}>
            <span className={styles.button_close} onClick={() => setOpen(false)}>
              <Wallet />
            </span>
          </div>
          <div>
            <p className={styles.title}>Download Brave</p>
            <Button
              className={styles.busd_button}
              href="https://brave.com/"
              target="_blank"
            >
              <span className="d-flex justify-content-center">
                Brave Browser
                <MetaMask />
              </span>
            </Button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className={styles.modal_a} href="https://metamask.io" target="_blank">
                {' '}
                Metamask{' '}
              </a>{' '}
              Enabled browsers. For more instructions on how to set up Metamask,{' '}
              <a
                className={styles.modal_a}
                href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
                target="_blank"
              >{' '}
                click here{' '}
              </a>
              .
            </p>
          </div>
        </Modal>
      ) : (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <Button className={styles.play_now_modal}>
              Play Now
            </Button>
          }
        >
          <div className={styles.connect_metamask_modal_svg}>
            <span className={styles.button_close} onClick={() => setOpen(false)}>
              <Wallet />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>
              Download Metamask
            </h1>
            <a 
              href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
              target="_blank"
            >
              <Button className={styles.busd_button}>
                <span className="d-flex justify-content-center">
                  Set Up Metamask
                  <MetaMask />
                </span>
              </Button>
            </a>
            <p className={styles.subtitle}>
              We currently only support{' '}
              <a className={styles.modal_a} href="https://metamask.io">
                {' '}
                Metamask wallets{' '}
              </a>
              . For more instructions on how to set up Metamask,{' '}
              <a className={styles.modal_a} href="https://metamask.io">
                {' '}
                click here{' '}
              </a>
              .
            </p>
          </div>
        </Modal>
      )}
    </span>
  );
};

export default ModalLogin;
