import { useEffect, useContext, useState } from 'react';
import Web3 from 'web3';
import { Modal, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Fetch from 'common/Fetch';
import Wallet from 'assets/svg/wallet.svg';
import MetaMask from 'assets/svg/metamask.svg';

import styles from 'components/modal//ModalLogin/ModalLogin.module.scss';

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
      // const jsonIP = await responseIP.data;

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
      // const jsonIP = await responseIP.data;

      const jsonStatus = await Fetch.USER_STATUS(userAddress, '');

      if (!jsonStatus.status) return false;

      return jsonStatus.status;
    } catch {
      console.log('Unregistered wallet: Connect');

      return false;
    }
  }

  return (
    <Modal
      className={styles.connect_metamask_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span>
          <Button color="blue" className={styles.metamask_button_top}>
            <span>
              <img
                className={styles.metamask_button_top_img}
                src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
              />
              Connect Metamask
            </span>
          </Button>
          <Button color="blue" className={styles.metamask_button_mobile_top}>
            <span>Connect</span>
          </Button>
        </span>
      }
    >
      <div className={styles.connect_metamask_modal_element}>
        <span className={styles.button_close} onClick={() => setOpen(false)}>
          <Wallet />
        </span>
      </div>
      <div>
        <p className={styles.title}>
          Download Metamask
        </p>
        <Button
          className={styles.busd_button}
          href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
          target="_blank"
        >
          <span className="d-flex justify-content-center">
            Set Up Metamask
            <MetaMask />
          </span>
        </Button>
        <p className={styles.subtitle}>
          {' '}
          We currently only support{' '}
          <a className={styles.modal_a} href="https://metamask.io">
            {' '}
            Metamask wallets{' '}
          </a>
          . For more instructions on how to set up Metamask,{' '}
          <a className={styles.modal_a} href="https://metamask.io">
            click here{' '}
          </a>
          .
        </p>
      </div>
    </Modal>
  );
};

export default ModalLogin;
