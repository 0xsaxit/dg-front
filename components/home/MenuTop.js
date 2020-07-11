import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import ModalDeposit from '../modal/ModalDeposit';
import MessageBox from './MessageBox';
import Global from '../Constants';

const MenuTop = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get path and render appropriate styles
  const router = useRouter();

  function getContainerStyles(path) {
    if (path === 'container') {
      if ('/' === router.pathname) {
        return 'dashboard-menu-container';
      } else {
        return 'other-menu-container';
      }
    }
  }

  function getLinkStyles(path) {
    if (path === 'menu') {
      if ('/' === router.pathname) {
        return 'menu-container';
      } else {
        return 'menu-container-dark';
      }
    } else {
      if (path === router.pathname) {
        return 'sidebar-menu-text' + ' active';
      } else {
        return 'sidebar-menu-text';
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // close the message box popup
  function handleDismiss() {
    dispatch({
      type: 'message_box',
      data: 0,
    });
  }

  if (state.userStatus) console.log('User status: ' + state.userStatus);

  return (
    <div className={getContainerStyles('container')}>
      <Menu className={getLinkStyles('menu')} icon="labeled">
        <Link href="/">
          <img
            className="image inline pointer"
            src={Global.IMAGES.LOGO}
            style={{
              width: '39px',
              paddingTop: '15px',
              paddingBottom: '15px',
              marginRight: '12px',
              marginLeft: '24px',
              height: '100%',
            }}
          />
        </Link>

        <Link href="/">
          <Menu.Item className={getLinkStyles('/')}>PLAY</Menu.Item>
        </Link>

        {state.userStatus ? (
          <Link href="/account">
            <Menu.Item className={getLinkStyles('/account')}>ACCOUNT</Menu.Item>
          </Link>
        ) : null}

        {state.userStatus ? (
          <Link href="/nfts">
            <Menu.Item className={getLinkStyles('/nfts')}>NFTS</Menu.Item>
          </Link>
        ) : null}

        <Link href="/games">
          <Menu.Item className={getLinkStyles('/games')}>GAMES</Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
        </Link>

        <Menu.Item
          href="https://docs.decentral.games/"
          target="_blank"
          className="sidebar-menu-text"
        >
          DOCS
        </Menu.Item>

        {state.userStatus ? (
          /////////////////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////////////////
          // display token balances and 'ADD CRYPTO' button
          <span className="right-menu-items">
            <span className="sidebar-menu-text-2">
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-1px',
                }}
                className="image inline"
                width="18px"
                height="18px"
                src={Global.IMAGES.DAI_CIRCLE}
              />
              {state.balances[1][1]} DAI
            </span>

            <span className="sidebar-menu-text-3">
              <img
                style={{
                  verticalAlign: 'middle',
                  marginRight: '6px',
                  marginTop: '-1px',
                }}
                className="image inline"
                width="18px"
                height="18px"
                src={Global.IMAGES.MANA_CIRCLE}
              />
              {state.balances[0][1]} MANA
            </span>

            <ModalDeposit menuLink={1} />
          </span>
        ) : (
          /////////////////////////////////////////////////////////////////////////////////////////
          /////////////////////////////////////////////////////////////////////////////////////////
          // show 'CONNECT METAMASK' button
          <span className="right-menu-items">
            <ModalVerify />
          </span>
        )}
      </Menu>

      {state.messageBox ? <MessageBox handleDismiss={handleDismiss} /> : null}
    </div>
  );
};

export default MenuTop;
