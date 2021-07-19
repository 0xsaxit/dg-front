import { useEffect, useState, useContext } from 'react';
import { Modal, Button, Divider, Icon } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import ButtonVerify from '../button/ButtonVerify';
import ButtonVerifyFortmatic from '../button/ButtonVerifyFortmatic';

import styles from 'ModalWallet.module.scss';

const ModalWallet = () => {
  // get user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [open, setOpen] = useState(false);
  const [metamaskEnabled, setMetamaskEnabled] = useState(false);
  const [scrollState, setScrollState] = useState('top');

  let menuStyle = [];
  let listener = null;

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    listener = document.addEventListener('scroll', e => {
      let scrolled = document.scrollingElement.scrollTop;
      if (scrolled >= 10) {
        if (scrollState !== 'amir') {
          setScrollState('amir');
        }
      } else {
        if (scrollState !== 'top') {
          setScrollState('top');
        }
      }
    });

    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, [scrollState]);

  if (scrollState == 'top') {
    menuStyle = ['get_metamask'];
  } else {
    menuStyle = ['get_metamask_scroll'];
  }

  return (
    <Modal
      className={styles.wallet_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        <span className={styles.right_menu_items}>
          <a
            href="https://docs.decentral.games/getting-started/play-to-mine/get-metamask"
            target="_blank"
            className={menuStyle[0]}
          >
            Need help?
          </a>
          <Button
            content="CONNECT WALLET"
            color="blue"
            className={styles.metamask_button}
          />
          <Button
            content="CONNECT"
            color="blue"
            className={styles.metamask_mobile_button}
            id="balances-padding-correct"
          />
        </span>
      }
    >
      <div style={{ margin: '21px 30px 0px 30px' }}>
        <span className={styles.mailchimp_close} onClick={() => setOpen(false)}>
          <Icon name="close" />
        </span>
      </div>

      <p className={styles.mailchimp_header_text}> Sign in </p>

      <Divider style={{ marginTop: '-15px' }} />

      <p style={{ margin: '21px 30px 15px 30px', textAlign: 'center' }}>
        {' '}
        Choose a method to connect
      </p>

      <ButtonVerify />
      <ButtonVerifyFortmatic />
    </Modal>
  );
};

export default ModalWallet;
