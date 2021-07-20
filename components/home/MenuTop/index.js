import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from 'store';
import { useRouter } from 'next/router';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import Link from 'next/link';
import ModalInfo from 'components/modal/ModalInfo';
import MessageBar from '../MessageBar';
import ButtonConnect from 'components/button/ButtonConnect';
import Fetch from 'common/Fetch';
import ModalPopup from 'components/modal/ModalPopup';
import cn from 'classnames';

import styles from './MenuTop.module.scss';

const MenuTop = props => {
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
      let json = await Fetch.MANA_PRICE();
      setManaPrice(json.market_data.current_price.usd);

      let json2 = await Fetch.ETH_PRICE();
      setEthPrice(json2.market_data.current_price.usd);

      let json3 = await Fetch.ATRI_PRICE();
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
    listener = document.addEventListener('scroll', e => {
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
      'mobile_menu_icon_home',
      'right_menu_text',
      'sidebar_menu_text',
      'dashboard_menu_container',
      '',
    ];
  } else if (props.isHomePage && scrollState == 'amir') {
    menuStyle = [
      'mobile_menu_icon',
      'right_menu_text blog',
      'sidebar_menu_text blog',
      'dashboard_menu_container',
      'top',
    ];
  } else {
    menuStyle = [
      'mobile_menu_icon',
      'right_menu_text blog',
      'sidebar_menu_text blog',
      'other_menu_container blog',
      '',
    ];
  }

  const menuOpen = () => {
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
  const setAffiliateState = () => {
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
  const getLinkStyles = (path) => {
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

  const DGLogo = () => {
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
  const dropdownMenu = () => {
    return (
      <div>
        <Menu attached="top" className={styles.mobile_menu_popup}>
          <Dropdown
            item
            icon={open ? 'close' : 'bars'}
            onClick={() => menuOpen()}
            id={open ? `${styles.mobile_menu_icon}` : menuStyle[0]}
          >
            <Dropdown.Menu>
              <Dropdown.Item>
                <Icon name="dropdown" />
                <span className="d-flex flex-column">
                  <Link href={`/${utm}`}>
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      Play
                    </Menu.Item>
                  </Link>

                  <Link href="/dg">
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      DG Ecosystem
                    </Menu.Item>
                  </Link>

                  <Link href="/games">
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      Games
                    </Menu.Item>
                  </Link>

                  <Link href="/events">
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      Events
                    </Menu.Item>
                  </Link>

                  <Link href="/blog">
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      News & Blog
                    </Menu.Item>
                  </Link>

                  <a
                    href="https://docs.decentral.games"
                    id="docs-top-menu"
                    target="_blank"
                  >
                    <Menu.Item
                      className={cn("dropdown_menu_items", menuStyle[1])}
                    >
                      Docs
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
  const shownOrHiddenItems = () => {
    return (
      <div className={styles.menu_items_to_hide}>
        <Link href={`/${utm}`}>
          <Menu.Item className={`${menuStyle[2]} ${getLinkStyles('/')}`}>
            Play
          </Menu.Item>
        </Link>

        <Link href="/dg">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/dg')}>
            DG Ecosystem
          </Menu.Item>
        </Link>

        <Link href="/games">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/games')}>
            Games
          </Menu.Item>
        </Link>

        <Link href="/events">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/events')}>
            Events
          </Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/blog')}>
            News & Blog
          </Menu.Item>
        </Link>

        <a
          href="https://docs.decentral.games"
          id="docs-top-menu"
          target="_blank"
        >
          <Menu.Item className={menuStyle[2]} id={getLinkStyles('/docs')}>
            Docs
          </Menu.Item>
        </a>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  const balancesAndButtons = () => {
    if (state.userStatus === 3) {
      return null;
    } else if (state.userStatus >= 4) {
      return (
        <span className={styles.right_menu_items}>
          <ModalInfo />
          <ModalPopup />
        </span>
      );
    } else {
      return (
        <span className={styles.right_menu_items}>
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
            <Menu className={styles.menu_container} icon="labeled">
              {DGLogo()}
              {shownOrHiddenItems()}
              {balancesAndButtons()}
            </Menu>
          ) : (
            <Menu className={styles.mneu_container} icon="labeled">
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
