import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Icon, Dropdown, Popup, Button } from 'semantic-ui-react';
import ModalInfo from '../modal/ModalInfo';
import MessageBar from './MessageBar';
import ButtonConnect from '../button/ButtonConnect';
import MessageBox from './MessageBox';
import Images from '../../common/Images';
// import PopUpLinks from './PopUpLinks';

const MenuTop = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [isDarkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [utm, setUtm] = useState('');
  const [scrollState, setScrollState] = useState('top');
  const [ref, setRef] = useState('');
  const [binance, setBinance] = useState(false);

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
  } else if (router.pathname.includes('binance')) {
    menuStyle = [
      'mobile-menu-icon',
      'right-menu-text blog',
      'sidebar-menu-text blog',
      'binance-menu-container',
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

  function menuOpen() {
    if (open == true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  // close menu automatically if left open for desktop screen sizes
  useEffect(() => {
    const interval = setInterval(() => {
      const frameWidth = window.innerWidth;

      if (frameWidth > 1100) {
        setOpen(false);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // set utm
  useEffect(() => {
    const url = window.location.href;
    if (url.includes('?utm_source')) {
      sessionStorage.setItem('utm', url.substring(url.lastIndexOf('/') + 1));
      setUtm(sessionStorage.getItem('utm'));
    } else {
      sessionStorage.setItem('utm', '');
      setUtm(sessionStorage.getItem('utm'));
    }
  }, [utm]);

  // store affiliate address in localStorage
  function setAffiliateState() {
    // if (localStorage.getItem('ref') === '') {
    //   console.log('affiliate address parameter: blank');
    // } else {
    //   console.log(
    //     'affiliate address parameter: ' + localStorage.getItem('ref')
    //   );
    // }

    dispatch({
      type: 'affiliate_address',
      data: localStorage.getItem('ref'),
    });
  }

  useEffect(() => {
    const url = window.location.href;
    if (url.includes('0x')) {
      localStorage.setItem('ref', url.substring(url.lastIndexOf('/') + 1));
      setRef(localStorage.getItem('ref'));
    } else {
      localStorage.setItem('ref', '');
      setRef(localStorage.getItem('ref'));
    }
    setAffiliateState();
  }, [ref]);

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

  useEffect(() => {
    if (router.pathname.includes('binance')) {
      setBinance(true);
    } else {
      setBinance(false);
    }
  }, []);

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
        {!binance ? (
          <img id="menu-logo" alt="Decentral Games Logo" src={Images.LOGO} />
        ) : (
          <img id="menu-logo" alt="Decentral Games Logo" src="https://res.cloudinary.com/dnzambf4m/image/upload/v1594238059/Artboard_kvaym2.png" />
        )}
      </Link>
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div className="mobile-height-fix">
        <Menu attached="top" className="mobile-menu-popup">
          <Dropdown
            item
            icon={open ? 'close' : 'bars'}
            onClick={() => menuOpen()}
            id={open ? 'mobile-menu-icon' : menuStyle[0]}
          >
            <Dropdown.Menu>
              <Dropdown.Item>
                <Icon name="dropdown" />
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <a href={`/${utm}`}>
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      PLAY
                    </Menu.Item>
                  </a>

                  <a href="/dg">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      $DG
                    </Menu.Item>
                  </a>

                  <a href="/games">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      GAMES
                    </Menu.Item>
                  </a>

                  <a href="/events">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      EVENTS
                    </Menu.Item>
                  </a>

                  <a href="/blog">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      BLOG
                    </Menu.Item>
                  </a>

                  <a
                    href="https://decentralgames.substack.com/"
                    target="_blank"
                  >
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      NEWS
                    </Menu.Item>
                  </a>

                  <a
                    href="https://docs.decentral.games"
                    id="docs-top-menu"
                    target="_blank"
                  >
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      DOCS
                    </Menu.Item>
                  </a>

                  <a
                    href="https://snapshot.page/#/decentralgames.eth"
                    id="docs-top-menu"
                    target="_blank"
                  >
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      GOV
                    </Menu.Item>
                  </a>
                </span>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu>
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

        <Link href="/events">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/events')}>
            EVENTS
          </Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/blog')}>
            BLOG
          </Menu.Item>
        </Link>

        <a
          href="https://decentralgames.substack.com/"
          target="_blank"
          id="docs-top-menu"
        >
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/news')}>
            NEWS
          </Menu.Item>
        </a>

        <a
          href="https://docs.decentral.games"
          id="docs-top-menu"
          target="_blank"
        >
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/docs')}>
            DOCS
          </Menu.Item>
        </a>

        <a
          href="https://snapshot.page/#/decentralgames.eth"
          id="docs-top-menu"
          target="_blank"
        >
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/gov')}>
            GOV
          </Menu.Item>
        </a>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    if (state.userStatus === 3) {
      return null;
    } else if (state.userStatus >= 4) {
      return (
        <span className="right-menu-items">

          {!binance ? (
            <ModalInfo />
          ) : (
            <div className="bnb-balance-box">
              <p className="right-menu-text bnb">
                {state.userBalances[3][1]} BNB{' '}
              </p>             
            </div>
          )}

          <div>
            <Popup
              pinned
              on='click'
              position='bottom right'
              className="account-popup"
              trigger={
                <Button
                  className="account-button"
                >
                  <Icon className="account-icon" name="user circle outline" />
                  My Account
                </Button>
              }
            >
              <span>
                <span style={{ display: 'flex' }}>
                  <img
                    className="avatar-picture-home"
                    src={`https://events.decentraland.org/api/profile/${state.userAddress}/face.png`}
                  />
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    {state.userInfo.name === null ||
                    state.userInfo.name === '' ? (
                      <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                        Unnamed
                      </h4>
                    ) : (
                      <h4 style={{ paddingLeft: '8px', marginTop: '-4px' }}>
                        {state.userInfo.name}
                      </h4>
                    )}
                    <span style={{ display: 'flex' }}>
                      <p className="account-address">
                        {state.userAddress.substr(0, 8) +
                        '...' +
                        state.userAddress.substr(-8)}
                      </p>
                      <Icon 
                        name="copy outline" 
                        style={{ 
                          color: 'rgba(225, 255, 255, 0.5)', 
                          fontSize: '16px',
                          padding: '2px 0px 0px 8px',
                        }}
                      />
                    </span>
                  </span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <Button className="casino-balance-button">
                    <p className="casino-balance-text"> Casino Balance </p>
                    <span style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <p className="casino-balance-text two"> $49,822.01 </p>
                      <Icon className="arrow right" style={{ paddingLeft: '8px', paddingTop: '5px' }}/>
                    </span>
                  </Button>
                  <span style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px' }}>
                    <Button className="account-deposit-button">
                      Deposit
                    </Button>
                    <Button className="account-withdraw-button">
                      Withdraw
                    </Button>
                  </span>
                  <p className="account-dropdown-item" style={{ marginTop: '8px' }}> My Account </p>
                  <p className="account-dropdown-item"> My Items </p>
                  <p className="account-dropdown-item"> Gameplay History </p>
                  <p className="account-dropdown-item"> Referrals </p>
                  <p className="account-dropdown-item"> Disconnect </p>
                  <Button className="buy-dg-button">
                    Buy $DG
                  </Button>
                </span>
              </span>
            </Popup>
          </div>


          {/*<PopUpLinks isDarkMode={isDarkMode} />*/}
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ButtonConnect />

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
            <Menu className={binance ? "menu-container-binance" : "menu-container-dark blog"} icon="labeled">
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