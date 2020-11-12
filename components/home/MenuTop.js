import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Button, Popup, Icon, Checkbox } from 'semantic-ui-react';
import ModalInfo from '../modal/ModalInfo';
// import ModalVideoLanding from '../modal/ModalVideoLanding';
import MessageBar from './MessageBar';
import ButtonVerify from '../button/ButtonVerify';
import MessageBox from './MessageBox';
import Aux from '../_Aux';
import Images from '../../common/Images';

const MenuTop = ({ toggleTheme }) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setDarkMode] = useState(false);
  const [zIndexMobile, setZIndexMobile] = useState(1);
  const [menuStyle, setMenuStyle] = useState([]);
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const MANA_BALANCE = parseInt(state.userBalances[1][1]);
  const DAI_BALANCE = parseInt(state.userBalances[0][1]);

  // // to avoid skips while userStatus is updated
  // const [isCheckingStatus, setIsCheckingStatus] = useState('0');

  // useEffect(() => {
  //   const loading = localStorage.getItem('loading');
  //   if (loading === 'true') {
  //     setIsCheckingStatus('0');
  //   } else if (state.userStatus === '0') {
  //     setIsCheckingStatus('1');
  //   } else {
  //     setIsCheckingStatus('2');  
  //   }
  //   console.log('hello: ' + state.userStatus);
  //   console.log(isCheckingStatus);
  // }, [state.userStatus]);

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
        '',
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
  });

  // close menu automatically if left open for
  // desktop screen sizes
  useEffect(() => {
    const interval = setInterval(() => {
      var frameWidth = window.innerWidth;
      if (frameWidth > 991) {
        setOpen(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
      if ('/' === router.pathname || '/landing' === router.pathname) {
        return 'dashboard-menu-container';
      } else {
        return menuStyle[0];
      }
    }
  }

  function getLinkStyles(path) {
    if (path === 'menu') {
      if ('/' === router.pathname && !open) {
        return 'menu-container';
      } else {
        return 'menu-container blog';
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

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function DGLogo() {
    return (
      <Link href="/">
        <img id="menu-logo" alt="Decentral Games Logo" src={Images.LOGO} />
      </Link>
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div className="mobile-height-fix">
        <Popup
          on="click"
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          className={
            state.userStatus
              ? 'mobile-menu-popup'
              : 'mobile-menu-popup-logged-out'
          }
          pinned
          position="bottom right"
          trigger={
            <span>
              {open ? (
                <span id="mobile-menu-icon" className="material-icons">
                  close
                </span>
              ) : (
                <span
                  id={
                    '/' === router.pathname
                      ? 'mobile-menu-icon-home'
                      : 'mobile-menu-icon'
                  }
                  className="material-icons"
                >
                  menu
                </span>
              )}
            </span>
          }
        >
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="/">
              <Menu.Item className={menuStyle[7]} id="dropdown-menu-items">
                PLAY
              </Menu.Item>
            </a>

            {state.userStatus ? (
              <a href="/account">
                <Menu.Item className={menuStyle[7]} id="dropdown-menu-items">
                  ACCOUNT
                </Menu.Item>
              </a>
            ) : null}

            <a href="/games">
              <Menu.Item className={menuStyle[7]} id="dropdown-menu-items">
                GAMES
              </Menu.Item>
            </a>

            <a href="/nfts">
              <Menu.Item className={menuStyle[7]} id="dropdown-menu-items">
                NFTS
              </Menu.Item>
            </a>

            <a href="/blog">
              <Menu.Item className={menuStyle[7]} id="dropdown-menu-items">
                BLOG
              </Menu.Item>
            </a>
          </span>
        </Popup>
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
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    if (state.userStatus) {
      return (
        <span className="right-menu-items">
          {router.pathname === '/dg' ? <ModalInfo /> : null}

          <Link href="/account">
            <span className="menu-account-info">
              {DAI_BALANCE || MANA_BALANCE > 0 ? (
                <span style={{ display: 'flex' }}>
                  <span className="menu-info-to-hide">
                    {MANA_BALANCE > 0 ? (
                      <p className={menuStyle[7]}>
                        {parseInt(state.userBalances[1][1]).toLocaleString()} MANA
                      </p>
                    ) : null}
                  </span>
                  <span className="menu-info-to-hide">
                    {DAI_BALANCE > 0 ? (
                      <p className={menuStyle[7]}>
                        {parseInt(state.userBalances[0][1]).toLocaleString()} DAI
                      </p>
                    ) : null}
                  </span>
                </span>
              ) : (
                <p className={menuStyle[7]} id="add-funds-mobile-padding">
                  ADD TOKENS
                </p>
              )}

              <span className="menu-avatar-background" id="add-funds-mobile">
                <span className="mobile-display-none-name">
                  {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                    <p className={menuStyle[7]} style={{ marginTop: '-1px' }}>
                      {state.userInfo[1].substr(0, 4) +
                        '...' +
                        state.userInfo[1].substr(-4)}
                    </p>
                  ) : (
                    <p style={{ marginTop: '-1px' }} className={menuStyle[7]}>
                      {state.userInfo[0]}
                    </p>
                  )}
                </span>

                <img
                  className="avatar-picture"
                  id="mobile-avatar-picture"
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
                  alt="Decentraland Avatar Image"
                />
              </span>
            </span>
          </Link>

          <Popup
            on="click"
            pinned
            position="bottom right"
            trigger={
              <Button color="blue" className="more-dropdown-button">
                <span className="material-icons">more_horiz</span>
              </Button>
            }
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <a href="https://docs.decentral.games" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-6px', marginRight: '11px' }}
                      name="file outline"
                    />
                    DOCS
                  </Menu.Item>
                </span>
              </a>

              <a href="https://github.com/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-6px', marginRight: '11px' }}
                      name="code"
                    />
                    CODE
                  </Menu.Item>
                </span>
              </a>

              <a href="https://discord.com/invite/cvbSNzY" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="discord"
                    />
                    DISCORD
                  </Menu.Item>
                </span>
              </a>

              <a href="https://t.me/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="telegram"
                    />
                    TELEGRAM
                  </Menu.Item>
                </span>
              </a>

              <a href="https://twitter.com/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="twitter"
                    />
                    TWITTER
                  </Menu.Item>
                </span>
              </a>

              <span style={{ display: 'flex', paddingTop: '8px' }}>
                {isDarkMode ? (
                  <span id="moon-icon" className="material-icons">
                    brightness_4
                  </span>
                ) : (
                  <span id="sun-icon" className="material-icons">
                    brightness_7
                  </span>
                )}

                <Checkbox
                  className="radio-theme-toggle"
                  onChange={toggleTheme}
                  toggle
                />
              </span>
            </span>
          </Popup>
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ButtonVerify />

          <Popup
            on="click"
            pinned
            position="bottom right"
            trigger={
              <Button color="blue" className="more-dropdown-button">
                <span className="material-icons">more_horiz</span>
              </Button>
            }
          >
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <a href="https://docs.decentral.games" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-6px', marginRight: '11px' }}
                      name="file outline"
                    />
                    DOCS
                  </Menu.Item>
                </span>
              </a>

              <a href="https://github.com/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-6px', marginRight: '11px' }}
                      name="code"
                    />
                    CODE
                  </Menu.Item>
                </span>
              </a>

              <a href="https://discord.com/invite/cvbSNzY" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="discord"
                    />
                    DISCORD
                  </Menu.Item>
                </span>
              </a>

              <a href="https://t.me/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="telegram"
                    />
                    TELEGRAM
                  </Menu.Item>
                </span>
              </a>

              <a href="https://twitter.com/decentralgames" target="_blank">
                <span style={{ display: 'flex', marginBottom: '6px' }}>
                  <Menu.Item className={menuStyle[7]} id="dropdown-more-items">
                    <Icon
                      style={{ marginLeft: '-5px', marginRight: '10px' }}
                      name="twitter"
                    />
                    TWITTER
                  </Menu.Item>
                </span>
              </a>

              <span style={{ display: 'flex', paddingTop: '8px' }}>
                {isDarkMode ? (
                  <span id="moon-icon" className="material-icons">
                    brightness_4
                  </span>
                ) : (
                  <span id="sun-icon" className="material-icons">
                    brightness_7
                  </span>
                )}

                <Checkbox
                  className="radio-theme-toggle"
                  onChange={toggleTheme}
                  toggle
                />
              </span>
            </span>
          </Popup>
        </span>
      );
    }
  }

  // function balancesAndButtonsLanding() {
  //   return (
  //     <span className="right-menu-items" style={{ marginRight: '15px' }}>
  //       <ModalVideoLanding />
  //       <ButtonVerify />
  //     </span>
  //   );
  // }

  return (
    <Aux>

        <div className={menuStyle[3]}>
          <div className={getContainerStyles('container')}>
            <MessageBar />

            {dropdownMenu()}

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
