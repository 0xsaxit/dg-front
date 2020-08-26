import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Sidebar, Segment, Modal, Button } from 'semantic-ui-react';
import MessageBar from './MessageBar';
import ModalVerify from '../modal/ModalVerify';
import MessageBox from './MessageBox';
import Aux from '../_Aux';
import Global from '../Constants';

const MenuTop = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [visible, setVisible] = useState(false);
  const [zIndexMobile, setZIndexMobile] = useState(1);
  const [menuStyle, setMenuStyle] = useState([]);

  // set menu styles
  useEffect(() => {
    if (
      router.pathname === '/' ||
      router.pathname === '/games' ||
      router.pathname === '/account' ||
      router.pathname === '/nfts'
    ) {
      setMenuStyle([
        'other-menu-container',
        'menu-container-dark',
        'sidebar-menu-text',
        '',
        'dropdown-menu',
        '',
        'rgba(10, 10, 10, 1)',
        'sidebar-menu-text',
        'sidebar-menu-text',
        'sidebar-menu-text-2',
        'sidebar-menu-text-3',
      ]);
    } else {
      setMenuStyle([
        'other-menu-container blog',
        'menu-container-dark blog',
        'sidebar-menu-text blog',
        'blog-menu-background',
        'dropdown-menu blog',
        'rgb(10, 10, 10)',
        'white',
        'sidebar-menu-text blog',
        'sidebar-menu-text blog',
        'sidebar-menu-text-2 blog',
        'sidebar-menu-text-3 blog',
      ]);
    }
  }, []);

  useEffect(() => {
    if (state.userStatus !== 0) {
      console.log('User status: ' + state.userStatus);
    }
  }, [state.userStatus]);

  // display the 'ADD TOKENS' popup
  function balancesModal() {
    if (state.balancesOverlay !== 2) {
      dispatch({
        type: 'balances_overlay',
        data: 1,
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
        return menuStyle[0];
      }
    }
  }

  function getLinkStyles(path) {
    if (path === 'menu') {
      if ('/' === router.pathname) {
        return 'menu-container';
      } else {
        return menuStyle[1];
      }
    } else {
      if (path === router.pathname) {
        return menuStyle[2] + ' active';
      } else {
        return menuStyle[2];
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // close the message box popup and open and close mobile dropdown menu
  function handleDismiss() {
    dispatch({
      type: 'message_box',
      data: 0,
    });
  }

  function handleDimmedChange() {
    if (!visible) {
      setVisible(true);
      setZIndexMobile(7);
    } else {
      setVisible(false);
      setZIndexMobile(1);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function DGLogo() {
    return (
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
            zIndex: '7',
          }}
        />
      </Link>
    );
  }

  function demoButton() {
    return (
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
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div
        className={menuStyle[4]}
        id={visible === false ? 'pushable-one' : 'pushable-two'}
        style={{ zIndex: zIndexMobile }}
      >
        <span
          className="material-icons"
          onClick={() => handleDimmedChange()}
          id="mobile-menu-icon"
          style={{ color: menuStyle[5] }}
        >
          {visible === false ? 'menu' : 'close'}
        </span>

        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            direction="top"
            animation="overlay"
            icon="labeled"
            vertical
            visible={visible}
            style={{ backgroundColor: menuStyle[6] }}
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
              className={menuStyle[7]}
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
    );
  }

  // links are shown or hidden based on user's display resolution
  function shownOrHiddenItems() {
    return (
      <div className="menu-items-to-hide">
        <Link href="/">
          <Menu.Item className={getLinkStyles('/')}>PLAY</Menu.Item>
        </Link>

        {state.userStatus ? (
          <Link href="/account">
            <Menu.Item className={getLinkStyles('/account')}>ACCOUNT</Menu.Item>
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
          className={menuStyle[8]}
        >
          DOCS
        </Menu.Item>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    if (state.userStatus) {
      return (
        <span className="right-menu-items">
          <span className={menuStyle[9]}>
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
          <span className={menuStyle[10]}>
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
            onClick={() => balancesModal()}
          >
            ADD TOKENS
          </Button>
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ModalVerify />
        </span>
      );
    }
  }

  return (
    <Aux>
      <MessageBar />

      <div className={menuStyle[3]}>
        {dropdownMenu()}

        <div className={getContainerStyles('container')}>
          <Menu className={getLinkStyles('menu')} icon="labeled">
            {DGLogo()}
            {shownOrHiddenItems()}
            {balancesAndButtons()}
          </Menu>

          {state.messageBox ? (
            <MessageBox handleDismiss={handleDismiss} />
          ) : null}
        </div>
      </div>
    </Aux>
  );
};

export default MenuTop;
