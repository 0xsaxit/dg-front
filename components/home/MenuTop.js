import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Sidebar, Segment, Button } from 'semantic-ui-react';
import ModalInfo from '../modal/ModalInfo';
import MessageBar from './MessageBar';
import Verify from './Verify';
import MessageBox from './MessageBox';
import Aux from '../_Aux';
import Images from '../../common/Images';


const MenuTop = ({toggleTheme}) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [zIndexMobile, setZIndexMobile] = useState(1);
  const [menuStyle, setMenuStyle] = useState([]);
  const [showItems, setShowItems] = React.useState(false)

  const onShow = () => setShowItems(true);
  const onClose = () => setShowItems(false);

  const router = useRouter();

  // helper function  and array to display on non zero balances
  function isGreaterThanZero(value) {
    return value > 0;
  }

  const displayedBalances = state.userBalances[1].filter(isGreaterThanZero);

  // set menu styles
  useEffect(() => {
    if (router.pathname === '/') {
      setMenuStyle([
        'other-menu-container',
        'menu-container-dark',
        'sidebar-menu-text',
        '',
        'dropdown-menu',
        '',
        'rgba(10, 10, 10, 1)',
        'right-menu-text',
        'home-menu-icon',
        'home-mobile-background',
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
        'mobile-menu-icon',
        '',
      ]);
    }
  }, []);

  useEffect(() => {
    if (state.userStatus !== 0) {
      console.log('User status: ' + state.userStatus);
    }
  }, [state.userStatus]);

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    if (localTheme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  })

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
          src={Images.LOGO}
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
          id={menuStyle[8]}
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
            id={menuStyle[9]}
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

          {router.pathname === '/dg' ? (
            <ModalInfo />
          ) : ( 
            null
          )}

          <span className="menu-account-info" onClick={() => balancesModal()}>

            {displayedBalances && displayedBalances.length ? (
              <span style={{ display: 'flex' }}>
                <span className="menu-info-to-hide">
                  {displayedBalances[0] > 0 ? (
                    <p className={menuStyle[7]}>
                      {displayedBalances[0]} DAI
                    </p>
                  ) : ( 
                    null
                  )}
                </span>
                <span className="menu-info-to-hide">
                  {displayedBalances[1] > 0 ? (
                    <p className={menuStyle[7]}>
                      {displayedBalances[1]} MANA
                    </p>
                  ) : ( 
                    null
                  )}
                </span>
              </span>
            ) : (
              <p className={menuStyle[7]}>
                ADD FUNDS
              </p>
            )}

            <span className="menu-avatar-background">
              {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                <p
                  className={menuStyle[7]}
                  style={{ marginTop: '-1px' }}
                >
                  {state.userInfo[1].substr(0, 4) +
                    '...' +
                    state.userInfo[1].substr(-4)}
                </p>
              ) : (
                <p
                  style={{ marginTop: '-1px' }}
                  className={menuStyle[7]}
                >
                  {state.userInfo[0]}
                </p>
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

          {isDarkMode ? 
            <Button onClick={toggleTheme} color="blue" className="theme-mode-button">
              <span className="material-icons">brightness_4</span>
            </Button>
          :
            <Button onClick={toggleTheme} color="blue" className="theme-mode-button">
              <span className="material-icons">brightness_7</span>
            </Button>
          }

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
