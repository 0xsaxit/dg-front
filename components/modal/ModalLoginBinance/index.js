import { useEffect, useContext, useState } from 'react';
import cn from 'classnames';
import Web3 from 'web3';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import Global from 'components/Constants';
import styles from './ModalLoginBinance.module.scss';
import Images from '../../../common/Images';
import Fetch from '../../../common/Fetch';

const ModalLoginBinance = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [safari, setSafari] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
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

  async function getUserStatus() {
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
    <span>
      {state.networkID ? (
        <Modal
          className={styles.connect_metamask_modal}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          close
          trigger={
            <button className={cn('btn', styles.play_now_modal_binance)}>
              Play Now
            </button>
          }
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Connect Your Wallet</h1>
            <button
              className={cn('btn w-100', styles.busd_button_binance)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                <img
                  src="https://res.cloudinary.com/dnzambf4m/image/upload/v1620331579/metamask-fox_szuois.png"
                  style={{ height: '36px', margin: '0px 24px 0px -48px' }}
                />
                Connect Metamask
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a
                className="modal-a"
                href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
                target="_blank"
              >
                {' '}
                Metamask wallets{' '}
              </a>
              . We will never have access to your private keys and we can not
              access your funds without your direct confirmation.{' '}
            </p>
            {/*<p className={styles.subtitle_2}>
                {' '}
                For the other casinos,{' '}
                <a className="modal-a" href="https://metamask.io"> click here </a>.
              </p>*/}
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
            <button className={cn('btn btn-primary', styles.play_now_modal)}>
              Play Now
            </button>
          }
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Brave</h1>
            <button
              className={cn('btn btn-primary w-100', styles.busd_button)}
              href="https://brave.com/"
              target="_blank"
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Brave Browser
                <Icon
                  style={{ fontSize: '20px', padding: '3px 0px 0px 18px' }}
                  name="external alternate"
                />
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io" target="_blank">
                {' '}
                Metamask{' '}
              </a>{' '}
              Enabled browsers. For more instructions on how to set up Metamask,{' '}
              <a
                className="modal-a"
                href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
                target="_blank"
              >
                {' '}
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
            <button
              className={cn('btn btn-primary', styles.play_now_modal_binance)}
            >
              Play Now
            </button>
          }
        >
          <div style={{ margin: '-68px 0px 50px -40px' }}>
            <span className="mailchimp-close" onClick={() => setOpen(false)}>
              <Icon name="close" />
            </span>
          </div>
          <div>
            <h1 className={styles.title}>Download Metamask</h1>
            <button
              className={cn('btn btn-primary w-100', styles.busd_button)}
              onClick={() => {
                openMetaMask();
              }}
            >
              <span style={{ display: 'flex', justifyContent: 'center' }}>
                Set Up Metamask
                <Icon
                  style={{ fontSize: '20px', padding: '3px 0px 0px 18px' }}
                  name="external alternate"
                />
              </span>
            </button>
            <p className={styles.subtitle}>
              {' '}
              We currently only support{' '}
              <a className="modal-a" href="https://metamask.io">
                {' '}
                Metamask wallets{' '}
              </a>
              . For more instructions on how to set up Metamask,{' '}
              <a className="modal-a" href="https://metamask.io">
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

export default ModalLoginBinance;
