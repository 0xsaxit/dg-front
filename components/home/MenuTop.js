import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Sidebar, Segment, Icon, Modal, Button } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import MessageBox from './MessageBox';
import Global from '../Constants';

const MenuTop = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [visible, setVisible] = React.useState(0);

  // display the balances overlay
  function balancesOverlay() {
    if (state.balancesOverlay !== 1) {
      dispatch({
        type: 'balances_overlay',
        data: 2,
      });
    }
  }

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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // open and close mobile dropdown menu
  function handleDimmedChange() {
    if (visible === 0) {
      setVisible(1);
    } else {
      setVisible(0);
    }
  }

  if (state.userStatus) console.log('User status: ' + state.userStatus);

  return (
    <div>
      <div
        className="dropdown-menu"
        id={visible === 0 ? 'pushable-one' : 'pushable-two'}
      >
        <span
          class="material-icons"
          onClick={handleDimmedChange}
          id="mobile-menu-icon"
        >
          {visible === 0 ? 'menu' : 'close'}
        </span>

        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            direction="top"
            animation="overlay"
            icon="labeled"
            vertical
            visible={visible}
            style={{ backgroundColor: 'rgba(10, 10, 10, 1)' }}
          >
            <Link href="/">
              <Menu.Item className={getLinkStyles('/')}>PLAY</Menu.Item>
            </Link>

            {state.userStatus ? (
              <Link href="/account">
                <Menu.Item className={getLinkStyles('/account')}>
                  ACCOUNT
                </Menu.Item>
              </Link>
            ) : null}

            <Link href="/games">
              <Menu.Item className={getLinkStyles('/games')}>GAMES</Menu.Item>
            </Link>

            <Link href="/nfts">
              <Menu.Item className={getLinkStyles('/nfts')}>NFTS</Menu.Item>
            </Link>

            <Link href="/blog">
              <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
            </Link>

            <Menu.Item
              href="https://docs.decentral.games/"
              target="_blank"
              className="sidebar-menu-text"
              style={{ paddingBottom: '27px' }}
            >
              DOCS
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment className="transparent-menu-segment"></Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>

      <div className={getContainerStyles('container')}>
        <Menu className={getLinkStyles('menu')} icon="labeled">
          <Link href="/">
            <img
              className="image inline pointer"
              id="menu-logo"
              src={Global.IMAGES.LOGO}
              style={{
                width: '39px',
                paddingTop: '15px',
                paddingBottom: '15px',
                marginRight: '12px',
                marginLeft: '23px',
                height: '100%',
                position: 'relative',
                zIndex: '2',
              }}
            />
          </Link>

          <div className="menu-items-to-hide">
            <Link href="/">
              <Menu.Item className={getLinkStyles('/')}>PLAY</Menu.Item>
            </Link>

            {state.userStatus ? (
              <Link href="/account">
                <Menu.Item className={getLinkStyles('/account')}>
                  ACCOUNT
                </Menu.Item>
              </Link>
            ) : null}

            <Link href="/games">
              <Menu.Item className={getLinkStyles('/games')}>GAMES</Menu.Item>
            </Link>

            <Link href="/nfts">
              <Menu.Item className={getLinkStyles('/nfts')}>NFTS</Menu.Item>
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
          </div>

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

              <Button
                color="blue"
                className="modal-deposit-button"
                onClick={balancesOverlay}
              >
                ADD CRYPTO
              </Button>
            </span>
          ) : (
            /////////////////////////////////////////////////////////////////////////////////////////
            /////////////////////////////////////////////////////////////////////////////////////////
            // show 'CONNECT METAMASK' button
            <span className="right-menu-items">
              <ModalVerify />
            </span>
          )}

          <div className="demo-button-container">
            <Modal
              trigger={<a className="demo-button"> DEMO </a>}
              closeIcon
              basic
              size="small"
            >
              <Modal.Content>
                <iframe
                  className="mobile-demo-video"
                  src="https://www.youtube.com/embed/qklQZBooM-8?autoplay=1"
                  frameborder="0"
                  allow="autoplay"
                  allowfullscreen
                ></iframe>
              </Modal.Content>
            </Modal>
          </div>
        </Menu>

        {state.messageBox ? <MessageBox handleDismiss={handleDismiss} /> : null}
      </div>
    </div>
  );
};

export default MenuTop;
