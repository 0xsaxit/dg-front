import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu, Icon, Dropdown, Popup, Button } from 'semantic-ui-react';
import ModalInfo from 'components/modal/ModalInfo';
import MessageBar from './MessageBar';
import ButtonConnect from '../button/ButtonConnect';
import Fetch from '../../common/Fetch';
import Global from '../Constants';

const MenuTop = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [isDarkMode, setDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [utm, setUtm] = useState('');
  const [scrollState, setScrollState] = useState('top');
  const [ref, setRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [manaPrice, setManaPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [atriPrice, setAtriPrice] = useState(0);
  const [casinoBalance, setCasinoBalance] = useState(0);

  const router = useRouter();
  let menuStyle = [];
  let listener = null;
  let linkDocs = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    (async function () {
      // get coin prices
      let response = await Fetch.MANA_PRICE();
      let json = await response.json();
      setManaPrice(json.market_data.current_price.usd);

      let response2 = await Fetch.ETH_PRICE();
      let json2 = await response2.json();
      setEthPrice(json2.market_data.current_price.usd);

      let response3 = await Fetch.ATRI_PRICE();
      let json3 = await response3.json();
      setAtriPrice(json3.market_data.current_price.usd);
    })();
  }, [manaPrice, ethPrice, atriPrice]);

  useEffect(() => {
    const mana = Number(manaPrice * state.userBalances[1][1]);
    const eth = Number(ethPrice * state.userBalances[2][3]);
    const atri = Number(atriPrice * state.userBalances[2][2]);
    const dai = Number(state.userBalances[0][1]);
    const usdt = Number(state.userBalances[2][1] * 1000000000000);
    const balance = mana + eth + atri + dai + usdt;

    setCasinoBalance(balance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }, [
    state.userBalances[1][1],
    state.userBalances[2][3],
    state.userBalances[2][2],
    state.userBalances[0][1],
    state.userBalances[2][1],
  ]);

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

  function menuOpen() {
    if (open == true) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(state.userAddress);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

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

  function DGLogo() {
    return (
      <Link href="/">
        <img
          id="menu-logo"
          alt="Decentral Games Logo"
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1594238059/Artboard_kvaym2.png"
        />
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
                  <Link href={`/${utm}`}>
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      PLAY
                    </Menu.Item>
                  </Link>

                  <Link href="/dg">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      $DG
                    </Menu.Item>
                  </Link>

                  <Link href="/games">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      GAMES
                    </Menu.Item>
                  </Link>

                  <Link href="/events">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      EVENTS
                    </Menu.Item>
                  </Link>

                  <Link href="/blog">
                    <Menu.Item
                      className={menuStyle[1]}
                      id="dropdown-menu-items"
                    >
                      BLOG
                    </Menu.Item>
                  </Link>

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
          <ModalInfo />

          <div>
            <Popup
              pinned
              on="click"
              position="bottom right"
              className="account-popup"
              trigger={
                <Button className="account-button">
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
                    <span
                      className="account-copy"
                      style={{ display: 'flex' }}
                      onClick={() => onCopy()}
                    >
                      <p className="account-address">
                        {state.userAddress.substr(0, 8) +
                          '...' +
                          state.userAddress.substr(-8)}
                        <Icon
                          name="clone outline"
                          style={{
                            color: 'rgba(225, 255, 255, 0.5)',
                            fontSize: '16px',
                            padding: '0px 0px 0px 8px',
                          }}
                        />
                      </p>
                    </span>
                  </span>
                </span>
                <span style={{ display: 'flex', flexDirection: 'column' }}>
                  <Link href="/account">
                    <Button className="casino-balance-button">
                      <p className="casino-balance-text"> Casino Balance </p>

                      <span
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <p className="casino-balance-text two">
                          ${casinoBalance}
                        </p>
                        <Icon
                          className="arrow right"
                          style={{ paddingLeft: '8px', paddingTop: '5px' }}
                        />
                      </span>
                    </Button>
                  </Link>

                  <span
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '12px',
                    }}
                  >
                    <Link href="/account">
                      <Button className="account-deposit-button">
                        Deposit
                      </Button>
                    </Link>
                    <Link href="/account">
                      <Button className="account-withdraw-button">
                        Withdraw
                      </Button>
                    </Link>
                  </span>

                  <Link href="/account">
                    <p
                      className="account-dropdown-item"
                      style={{ marginTop: '8px' }}
                    >
                      My Account
                    </p>
                  </Link>
                  <Link href="/account/nfts">
                    <p className="account-dropdown-item">My NFTs</p>
                  </Link>
                  <Link href="/account/poaps">
                    <p className="account-dropdown-item">My POAPs</p>
                  </Link>
                  <Link href="/account/play">
                    <p className="account-dropdown-item">Gameplay History</p>
                  </Link>
                  <Link href="/account/history">
                    <p className="account-dropdown-item">Transactions</p>
                  </Link>
                  <Link href="/account/referrals">
                    <p className="account-dropdown-item">Referrals</p>
                  </Link>
                  <Button
                    className="buy-dg-button"
                    href={`https://app.uniswap.org/#/swap?outputCurrency=${Global.ADDRESSES.ROOT_TOKEN_ADDRESS_DG}`}
                    target="_blank"
                  >
                    Buy $DG
                  </Button>
                </span>
              </span>
            </Popup>

            {copied ? (
              <div className={copied ? 'copied-toast' : 'copied-toast hidden'}>
                <h3 className="copied-text">Wallet address copied!</h3>
              </div>
            ) : null}
          </div>
        </span>
      );
    } else {
      return (
        <span className="right-menu-items">
          <ButtonConnect />
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
        </div>
      </span>
    );
  }
};

export default MenuTop;

