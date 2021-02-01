import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import ModalInfo from '../modal/ModalInfo';
import MessageBar from './MessageBar';
import ButtonVerify from '../button/ButtonVerify';
import MessageBox from './MessageBox';
import Images from '../../common/Images';
import PopUpLinks from './PopUpLinks';

const MenuTop = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isDarkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [utm, setUtm] = useState('');
  const [scrollState, setScrollState] = useState('top');

  const DAI_BALANCE = parseInt(state.userBalances[0][1]);
  const MANA_BALANCE = parseInt(state.userBalances[1][1]);
  const router = useRouter();
  let menuStyle = [];
  let listener = null;
  let linkDocs = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    linkDocs = document.getElementById('docs-top-menu');
  }, []);

  useEffect(() => {
    if (linkDocs) {
      analytics.trackLink(linkDocs, 'Clicked DOCS link (top menu)');
    }
  }, [linkDocs]);

  useEffect(() => {
    listener = document.addEventListener('scroll', (e) => {
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

  if (props.isHomePage && scrollState == 'top') {
    menuStyle = [
      'mobile-menu-icon-home',
      'right-menu-text',
      'sidebar-menu-text',
      'dashboard-menu-container',
      '',
    ];
  } else if (props.isHomePage && scrollState == 'amir') {
    menuStyle = [
      'mobile-menu-icon',
      'right-menu-text blog',
      'sidebar-menu-text blog',
      'dashboard-menu-container',
      'top',
    ];
  } else {
    menuStyle = [
      'mobile-menu-icon',
      'right-menu-text blog',
      'sidebar-menu-text blog',
      'other-menu-container blog',
      '',
    ];
  }

  useEffect(() => {
    setUtm(sessionStorage.getItem('utm'));
  }, [utm]);

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');

    if (localTheme === 'dark') {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  });

  // close menu automatically if left open for desktop screen sizes
  useEffect(() => {
    const interval = setInterval(() => {
      const frameWidth = window.innerWidth;

      if (frameWidth > 991) {
        setOpen(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions

  // get path and render appropriate styles
  function getLinkStyles(path) {
    if (path === '/') {
      if (path === router.pathname) {
        return 'active';
      } else {
        return '';
      }
    } else if (router.pathname.includes(path)) {
      return 'active';
    } else {
      return '';
    }
  }

  // close the message box popup and open and close mobile dropdown menu
  function handleDismiss() {
    dispatch({
      type: 'token_pings',
      data: 0,
    });
  }

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
          className="mobile-menu-popup"
          pinned
          position="bottom right"
          trigger={
            <span>
              {open ? (
                <Icon name="close" id="mobile-menu-icon" />
              ) : (
                <Icon name="bars" id={menuStyle[0]} />
              )}
            </span>
          }
        >
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <a href={`/${utm}`}>
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                PLAY
              </Menu.Item>
            </a>

            <a href="/dg">
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                $DG
              </Menu.Item>
            </a>

            <a href="/games">
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                GAMES
              </Menu.Item>
            </a>

            <a href="/nfts">
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                NFTS
              </Menu.Item>
            </a>

            <a href="/blog">
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                BLOG
              </Menu.Item>
            </a>

            <a
              href="https://docs.decentral.games"
              id="docs-top-menu"
              target="_blank"
            >
              <Menu.Item className={menuStyle[1]} id="dropdown-menu-items">
                DOCS
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
        <Link href={`/${utm}`}>
          <Menu.Item className={`${menuStyle[2]} ${getLinkStyles('/')}`}>
            PLAY
          </Menu.Item>
        </Link>

        <Link href="/dg">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/dg')}>
            $DG
          </Menu.Item>
        </Link>

        <Link href="/games">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/games')}>
            GAMES
          </Menu.Item>
        </Link>

        <Link href="/nfts">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/nfts')}>
            NFTS
          </Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/blog')}>
            BLOG
          </Menu.Item>
        </Link>

        <a
          href="https://docs.decentral.games"
          id="docs-top-menu"
          target="_blank"
        >
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/docs')}>
            DOCS
          </Menu.Item>
        </a>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    {
      /*if (state.userStatus === 3) {
      return (
        <span className="right-menu-items">
          <PopUpLinks isDarkMode={isDarkMode} />
        </span>
      );
    } else*/
    }
    if (state.userStatus >= 4) {
      return (
        <span className="right-menu-items">
          <ModalInfo />

          <Link href="/account">
            <span className="menu-account-info">
              {DAI_BALANCE || MANA_BALANCE > 0 ? (
                <span style={{ display: 'flex' }}>
                  <span className="menu-info-to-hide">
                    {MANA_BALANCE > 0 ? (
                      <p className={menuStyle[1]}>
                        {parseInt(state.userBalances[1][1]).toLocaleString()}{' '}
                        MANA
                      </p>
                    ) : null}
                  </span>
                  <span className="menu-info-to-hide">
                    {DAI_BALANCE > 0 ? (
                      <p className={menuStyle[1]}>
                        {parseInt(state.userBalances[0][1]).toLocaleString()}{' '}
                        DAI
                      </p>
                    ) : null}
                  </span>
                </span>
              ) : (
                <p className={menuStyle[1]} id="add-funds-mobile-padding">
                  ADD TOKENS
                </p>
              )}

              <span className="menu-avatar-background" id="add-funds-mobile">
                <span className="mobile-display-none-name">
                  {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                    <p className={menuStyle[1]} style={{ marginTop: '-1px' }}>
                      {state.userInfo[1].substr(0, 4) +
                        '...' +
                        state.userInfo[1].substr(-4)}
                    </p>
                  ) : (
                    <p style={{ marginTop: '-1px' }} className={menuStyle[1]}>
                      {state.userInfo[0]}
                    </p>
                  )}
                </span>

                <img
                  className="avatar-picture"
                  id="mobile-avatar-picture"
                  src={`https://events.decentraland.org/api/profile/${state.userInfo[1]}/face.png`}
                  style={{
                    width: '18px',
                    height: '18px',
                    display: 'flex',
                    border: '1px solid rgb(227, 232, 238)',
                    marginTop: '4px',
                    borderRadius: '100%',
                    boxShadow: '0 0.75rem 1.5rem rgba(18, 38, 63, 0.03)',
                    backgroundColor: 'white',
                  }}
                  alt="Decentraland Avatar Image"
                />
              </span>
            </span>
          </Link>

          {/*<PopUpLinks isDarkMode={isDarkMode} />*/}
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ButtonVerify />

          {/*<PopUpLinks isDarkMode={isDarkMode} />*/}
        </span>
      );
    }
  }

  if (state.isLoading) {
    return null;
  } else {
    return (
      <span>
        <div className={menuStyle[3]} id={menuStyle[4]}>
          <MessageBar />
          {dropdownMenu()}

          {props.isHomePage && !open ? (
            <Menu className="menu-container" icon="labeled">
              {DGLogo()}
              {shownOrHiddenItems()}
              {balancesAndButtons()}
            </Menu>
          ) : (
            <Menu className="menu-container-dark blog" icon="labeled">
              {DGLogo()}
              {shownOrHiddenItems()}
              {balancesAndButtons()}
            </Menu>
          )}

          <MessageBox handleDismiss={handleDismiss} />
        </div>
      </span>
    );
  }
};

export default MenuTop;
