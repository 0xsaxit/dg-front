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
import PopupLinks from './PopupLinks';
import PopUpLinksHome from './PopUpLinksHome';


const MenuTopHome = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [isDarkMode, setDarkMode] = useState(false);
  const [menuStyle, setMenuStyle] = useState([]);
  const [open, setOpen] = useState(false);

  const DAI_BALANCE = parseInt(state.userBalances[0][1]);
  const MANA_BALANCE = parseInt(state.userBalances[1][1]);


  useEffect(() => {
    if (state.userStatus) {
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

  // close menu automatically if left open for desktop screen sizes
  useEffect(() => {
    const interval = setInterval(() => {
      var frameWidth = window.innerWidth;
      if (frameWidth > 991) {
        setOpen(false);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

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
          className="mobile-menu-popup"
          pinned
          position="bottom right"
          trigger={
            <span>
              {open ? (
                <Icon name="close" id="mobile-menu-icon" />
              ) : (
                <Icon
                  name="bars"
                  id='mobile-menu-icon-home'
                />
              )}
            </span>
          }
        >
          <span style={{ display: 'flex', flexDirection: 'column' }}>
            <a href="/">
              <Menu.Item className="right-menu-text" id="dropdown-menu-items">
                PLAY
              </Menu.Item>
            </a>

            <a href="/dg">
              <Menu.Item className="right-menu-text" id="dropdown-menu-items">
                $DG
              </Menu.Item>
            </a>

            <a href="/games">
              <Menu.Item className="right-menu-text" id="dropdown-menu-items">
                GAMES
              </Menu.Item>
            </a>

            <a href="/nfts">
              <Menu.Item className="right-menu-text" id="dropdown-menu-items">
                NFTS
              </Menu.Item>
            </a>

            <a href="/blog">
              <Menu.Item className="right-menu-text" id="dropdown-menu-items">
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
          <Menu.Item className="sidebar-menu-text active">PLAY</Menu.Item>
        </Link>

        <Link href="/dg">
          <Menu.Item className="sidebar-menu-text">$DG</Menu.Item>
        </Link>

        <Link href="/games">
          <Menu.Item className="sidebar-menu-text">GAMES</Menu.Item>
        </Link>

        <Link href="/nfts">
          <Menu.Item className="sidebar-menu-text">NFTS</Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className="sidebar-menu-text">BLOG</Menu.Item>
        </Link>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    if (state.userStatus === 3) {
      return (
        <span className="right-menu-items">
          <PopupLinks menuStyle={menuStyle} isDarkMode={isDarkMode} />
        </span>
      );
    } else if (state.userStatus >= 4) {
      return (
        <span className="right-menu-items">
          <ModalInfo />

          <Link href="/account">
            <span className="menu-account-info">
              {DAI_BALANCE || MANA_BALANCE > 0 ? (
                <span style={{ display: 'flex' }}>
                  <span className="menu-info-to-hide">
                    {MANA_BALANCE > 0 ? (
                      <p className="right-menu-text">
                        {parseInt(state.userBalances[1][1]).toLocaleString()}{' '}
                        MANA
                      </p>
                    ) : null}
                  </span>
                  <span className="menu-info-to-hide">
                    {DAI_BALANCE > 0 ? (
                      <p className="right-menu-text">
                        {parseInt(state.userBalances[0][1]).toLocaleString()}{' '}
                        DAI
                      </p>
                    ) : null}
                  </span>
                </span>
              ) : (
                <p className="right-menu-text" id="add-funds-mobile-padding">
                  ADD TOKENS
                </p>
              )}

              <span className="menu-avatar-background" id="add-funds-mobile">
                <span className="mobile-display-none-name">
                  {state.userInfo[0] === null || state.userInfo[0] === '' ? (
                    <p className="right-menu-text" style={{ marginTop: '-1px' }}>
                      {state.userInfo[1].substr(0, 4) +
                        '...' +
                        state.userInfo[1].substr(-4)}
                    </p>
                  ) : (
                    <p style={{ marginTop: '-1px' }} className="right-menu-text">
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

          <PopUpLinksHome menuStyle={menuStyle} isDarkMode={isDarkMode} />
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ButtonVerify />

          <PopUpLinksHome menuStyle={menuStyle} isDarkMode={isDarkMode} />
        </span>
      );
    }
  }

  if (state.isLoading) {
    return null;
  } else {
    return (
      <div className="dashboard-menu-container">
        <MessageBar />
        {dropdownMenu()}

        {open ? (
          <Menu className="menu-container-dark blog" icon="labeled">
            {DGLogo()}
            {shownOrHiddenItems()}
            {balancesAndButtons()}
          </Menu>
        ) : (
          <Menu className="menu-container dark" icon="labeled">
            {DGLogo()}
            {shownOrHiddenItems()}
            {balancesAndButtons()}
          </Menu>
        )}


        <MessageBox handleDismiss={handleDismiss} />
      </div>
    );
  }
};

export default MenuTopHome;
