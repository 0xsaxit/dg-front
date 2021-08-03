import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { Menu, Icon, Dropdown, Popup, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import ModalInfo from 'components/modal/ModalInfo';
import Fetch from 'common/Fetch';
import ModalPopup from 'components/modal/ModalPopup';
import MessageBar from '../MessageBar';
import ButtonConnect from '../../button/ButtonConnect';

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

  function DGLogo() {
    return (
      <Link href="/">
        <img
          className={styles.menu_logo}
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
            id={open ? 'mobile-menu-icon' : ''}
          >
            <Dropdown.Menu>
              <Dropdown.Item>
                <Icon name="dropdown" />
                <span class="d-flex flex-column">
                  <Link href={`/${utm}`}>
                    <Menu.Item
                      className={styles.menu_style}
                      id="dropdown-menu-items"
                    >
                      Play
                    </Menu.Item>
                  </Link>

                  <Link href="/dg">
                    <Menu.Item
                      className={styles.menu_style}
                      id="dropdown-menu-items"
                    >
                      DAO
                    </Menu.Item>
                  </Link>

                  <Link href="/games">
                    <Menu.Item
                      className={styles.menu_style}
                      id="dropdown-menu-items"
                    >
                      Games
                    </Menu.Item>
                  </Link>

                  <Link href="/events">
                    <Menu.Item
                      className={styles.menu_style}
                      id="dropdown-menu-items"
                    >
                      Events
                    </Menu.Item>
                  </Link>

                  <Link href="/blog">
                    <Menu.Item
                      className={styles.menu_style}
                      id="dropdown-menu-items"
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
                      className={styles.menu_style}
                      id="dropdown-menu-items"
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
  function shownOrHiddenItems() {
    return (
      <div className={styles.menu_items_to_hide}>
        <Link href={`/${utm}`}>
          <Menu.Item className={styles.menu_style}>Play</Menu.Item>
        </Link>

        <Link href="/dg">
          <Menu.Item className={styles.menu_style}>DAO</Menu.Item>
        </Link>

        <Link href="/games">
          <Menu.Item className={styles.menu_style}>Games</Menu.Item>
        </Link>

        <Link href="/events">
          <Menu.Item className={styles.menu_style}>Events</Menu.Item>
        </Link>

        <Link href="/blog">
          <Menu.Item className={styles.menu_style}>News & Blog</Menu.Item>
        </Link>

        <a
          href="https://docs.decentral.games"
          id="docs-top-menu"
          className="d-flex"
          target="_blank"
        >
          <Menu.Item className={styles.menu_style}>Docs</Menu.Item>
        </a>
      </div>
    );
  }

  // display token balances and 'ADD TOKENS' button, or 'CONNECT METAMASK' button
  function balancesAndButtons() {
    return (
      <>
        <span
          className={cn(
            styles.right_menu_items,
            state.userStatus >= 4 ? '' : 'd-none'
          )}
        >
          <ModalInfo />
          <ModalPopup />
        </span>
        <span
          className={cn(
            styles.right_menu_items,
            state.userStatus < 3 ? '' : 'd-none'
          )}
        >
          <ButtonConnect />
        </span>
      </>
    );
  }

  if (state.isLoading) {
    return null;
  } else {
    return (
      <span>
        <div className={styles.dashboard_menu_container}>
          <MessageBar />
          {dropdownMenu()}

          {props.isHomePage && !open ? (
            <Menu className={styles.menu_container}>
              {DGLogo()}
              {shownOrHiddenItems()}
              {balancesAndButtons()}
            </Menu>
          ) : (
            <Menu
              className={cn(styles.menu_container, styles.dark)}
              icon="labeled"
            >
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
