import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Sidebar, Segment, Button, Modal, Icon } from 'semantic-ui-react';
import MessageBar from './MessageBar';
import Verify from './Verify';
import MessageBox from './MessageBox';
import Aux from '../_Aux';
import Global from '../Constants';

const MenuTop = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isVisible, setIsVisible] = useState(false);
  const [zIndexMobile, setZIndexMobile] = useState(1);
  const [menuStyle, setMenuStyle] = useState([]);
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  // set menu styles
  useEffect(() => {
    if (
      router.pathname === '/'
    ) {
      setMenuStyle([
        'other-menu-container',
        'menu-container-dark',
        'sidebar-menu-text',
        '',
        'dropdown-menu',
        '',
        'rgba(10, 10, 10, 1)',
        'right-menu-text',
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
        'right-menu-text blog',
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
    } else {
      dispatch({
        type: 'balances_overlay',
        data: 3,
      });
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get path and render appropriate styles
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
      type: 'token_pings',
      data: 0,
    });
  }

  function handleDimmedChange() {
    if (!isVisible) {
      setIsVisible(true);
      setZIndexMobile(7);
    } else {
      const timer = setTimeout(() => {
        setZIndexMobile(1);
      }, 500);
      setIsVisible(false);
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
            marginRight: '9px',
            marginLeft: '24px',
            height: '100%',
            position: 'relative',
            zIndex: '7',
          }}
        />
      </Link>
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div
        className={menuStyle[4]}
        id={isVisible === false ? 'pushable-one' : 'pushable-two'}
        style={{ zIndex: zIndexMobile }}
      >
        <span
          className="material-icons"
          onClick={() => handleDimmedChange()}
          id="mobile-menu-icon"
          style={{ color: menuStyle[5] }}
        >
          {isVisible === false ? 'menu' : 'close'}
        </span>

        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            direction="top"
            animation="overlay"
            icon="labeled"
            vertical
            visible={isVisible}
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

            {/*<Link href="/dg">
              <Menu.Item className={getLinkStyles('/dg')}>DG</Menu.Item>
            </Link>*/}

            <Link href="/blog">
              <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
            </Link>

            <Menu.Item
              style={{ paddingBottom: '27px' }}
              href="https://docs.decentral.games/"
              target="_blank"
              className={getLinkStyles('/docs')}
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

        {/*<Link href="/dg">
          <Menu.Item className={getLinkStyles('/dg')}>DG</Menu.Item>
        </Link>*/}

        <Link href="/blog">
          <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
        </Link>

        <Menu.Item
          href="https://docs.decentral.games/"
          target="_blank"
          className={getLinkStyles('/docs')}
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
          <span className="menu-account-info">
            <span className="menu-info-to-hide">
              <Menu.Item className={menuStyle[7]}>
                {state.userBalances[0][1]} DAI
              </Menu.Item>
            </span>
            <span className="menu-info-to-hide">
              <Menu.Item className={menuStyle[7]}>
                {state.userBalances[1][1]} MANA
              </Menu.Item>
            </span>

            <span className="menu-avatar-background">
              {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                <Menu.Item
                  className={menuStyle[7]}
                  style={{ marginTop: '-1px' }}
                >
                  {state.userInfo[1].substr(0, 4) +
                    '...' +
                    state.userInfo[1].substr(-4)}
                </Menu.Item>
              ) : (
                <Menu.Item
                  style={{ marginTop: '-1px' }}
                  className={menuStyle[7]}
                >
                  {state.userInfo[0]}
                </Menu.Item>
              )}

              <img
                className="avatar-picture"
                src={`https://events.decentraland.org/api/profile/${state.userInfo[1]}/face.png`}
                style={{
                  width: '21px',
                  height: '21px',
                  display: 'flex',
                  border: '1px solid rgb(227, 232, 238)',
                  marginTop: '5px',
                  borderRadius: '100%',
                  boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                  backgroundColor: 'white',
                }}
              />
            </span>
          </span>

          <Button
            color="blue"
            className="modal-deposit-button"
            onClick={() => balancesModal()}
          >
            <span class="material-icons">add</span>
          </Button>

          <Modal
            className="menu-info-modal"
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            close
            trigger={
              <Button color="blue" className="modal-info-button">
                <span class="material-icons">settings</span>
              </Button>
            }
          >
            <span className="menu-info-close" onClick={() => setOpen(false)}>
              <span className="material-icons" style={{ fontSize: '29px' }}>
                close
              </span>
            </span>

            <p className="matic-header-text" style={{ paddingTop: '72px' }}>
              {' '}
              About{' '}
            </p>

            <span
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '-9px',
              }}
            >
              <a href="https://twitter.com/decentralgames">
                <Icon style={{ fontSize: '34px' }} name="twitter" />
              </a>
              <a href="https://discord.com/invite/cvbSNzY">
                <Icon
                  style={{
                    fontSize: '34px',
                    marginRight: '12px',
                    marginLeft: '12px',
                  }}
                  name="discord"
                />
              </a>
              <a href="https://github.com/decentralgames">
                <Icon style={{ fontSize: '34px' }} name="github" />
              </a>
            </span>
            <div className="menu-info-container">
              <span
                className="menu-info-inner-span"
                style={{ paddingTop: '12px' }}
              >
                <p className="menu-info-label"> Version </p>
                <p className="menu-info-text"> 0.0.9 </p>
              </span>
              <span className="menu-info-inner-span">
                <p className="menu-info-label"> Network </p>
                <p className="menu-info-text"> Goerli </p>
              </span>
              <span className="menu-info-inner-span">
                <p className="menu-info-label"> DCL Node </p>
                <a
                  href="https://catalyst-monitor.now.sh/"
                  className="menu-info-text"
                >
                  {' '}
                  https://catalyst-monitor.now.sh
                </a>
              </span>
              <span className="menu-info-inner-span">
                <p className="menu-info-label"> Matic Node </p>
                <a
                  href="https://wallet.matic.today/staking/"
                  className="menu-info-text"
                >
                  https://wallet.matic.today
                </a>
              </span>
            </div>
          </Modal>
        </span>
      );
    } else {
      return <Verify />;
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

          <MessageBox handleDismiss={handleDismiss} />
        </div>
      </div>
    </Aux>
  );
};

export default MenuTop;
