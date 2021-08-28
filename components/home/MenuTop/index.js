import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import cn from 'classnames';
import { Menu, Icon, Dropdown, Popup, Button } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import { useMediaQuery } from 'hooks';
import ModalInfo from 'components/modal/ModalInfo';
import Fetch from 'common/Fetch';
import ModalPopup from 'components/modal/ModalPopup';
import ButtonConnect from '../../button/ButtonConnect/index.js';
import styles from './MenuTop.module.scss';
import MessageToast from 'components/home/MessageToast';

const MenuTop = props => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);
  const isTablet = useMediaQuery('(min-width: 1100px)');
  const isMobile = useMediaQuery('(min-width: 768px)');
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
    return isMobile ? (
      <Link href="/">
        <img
          className={styles.menu_logo}
          alt="Decentral Games Logo"
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
        />
      </Link>
    ) : (
      <>
        <Link href="/">
          <img
            className={styles.menu_logo}
            alt="Decentral Games Logo"
            src="https://res.cloudinary.com/dnzambf4m/image/upload/v1621630083/android-chrome-512x512_rmiw1y.png"
          />
        </Link>
        &nbsp; Decentral Games
      </>
    );
  }

  // dropdown menu for mobile
  function dropdownMenu() {
    return (
      <div className={cn(styles.mobile_menu, open ? styles.open : '')}>
        <span class="d-flex flex-column w-100">
          {!isMobile && (
            <Link href={`/${utm}`}>
              <Menu.Item className={styles.menu_style}>Play</Menu.Item>
            </Link>
          )}
          {!isMobile && (
            <Link href="/dg">
              <Menu.Item className={styles.menu_style}>DAO</Menu.Item>
            </Link>
          )}

          {!isMobile && (
            <Link href="/games">
              <Menu.Item className={styles.menu_style}>Offerings</Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <Link href="/events">
              <Menu.Item className={styles.menu_style}>Events</Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <Link href="/blog">
              <Menu.Item className={styles.menu_style}>News & Blog</Menu.Item>
            </Link>
          )}

          {!isTablet && (
            <a
              href="https://docs.decentral.games"
              id="docs-top-menu"
              target="_blank"
            >
              <Menu.Item className={styles.menu_style}>Docs</Menu.Item>
            </a>
          )}
        </span>
      </div>
    );
  }

  // links are shown or hidden based on user's display resolution
  function shownOrHiddenItems() {
    return (
      <div className={styles.menu_items_to_hide}>
        {isMobile && (
          <Link href={`/${utm}`}>
            <Menu.Item className={styles.menu_style}>Play</Menu.Item>
          </Link>
        )}

        {isMobile && (
          <Link href="/dg">
            <Menu.Item className={styles.menu_style}>DAO</Menu.Item>
          </Link>
        )}

        {isMobile && (
          <Link href="/games">
            <Menu.Item className={styles.menu_style}>Offerings</Menu.Item>
          </Link>
        )}

        {!isTablet && (
          <svg
            width="22"
            height="12"
            viewBox="0 0 22 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => {
              setOpen(!open);
            }}
          >
            <path
              d="M1.66671 0.666656C0.930328 0.666656 0.333374 1.26361 0.333374 1.99999C0.333374 2.73637 0.930328 3.33332 1.66671 3.33332H20.3334C21.0698 3.33332 21.6667 2.73637 21.6667 1.99999C21.6667 1.26361 21.0698 0.666656 20.3334 0.666656H1.66671Z"
              fill="white"
            />
            <path
              d="M1.66671 8.66666C0.930328 8.66666 0.333374 9.26361 0.333374 9.99999C0.333374 10.7364 0.930328 11.3333 1.66671 11.3333H20.3334C21.0698 11.3333 21.6667 10.7364 21.6667 9.99999C21.6667 9.26361 21.0698 8.66666 20.3334 8.66666H1.66671Z"
              fill="white"
            />
          </svg>
        )}

        {isTablet && (
          <Link href="/events">
            <Menu.Item className={styles.menu_style}>Events</Menu.Item>
          </Link>
        )}

        {isTablet && (
          <Link href="/blog">
            <Menu.Item className={styles.menu_style}>News & Blog</Menu.Item>
          </Link>
        )}

        {isTablet && (
          <a
            href="https://docs.decentral.games"
            id="docs-top-menu"
            className="d-flex"
            target="_blank"
          >
            <Menu.Item className={styles.menu_style}>Docs</Menu.Item>
          </a>
        )}
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
        <div
          className={cn(
            styles.dashboard_menu_container,
            open || scrollState !== 'top' || router.asPath !== '/'
              ? styles.dark
              : ''
          )}
        >
          <MessageToast />
          <Menu className={cn(styles.menu_container)}>
            {DGLogo()}
            {shownOrHiddenItems()}
            {isMobile && balancesAndButtons()}
          </Menu>
          {dropdownMenu()}
        </div>
      </span>
    );
  }
};

export default MenuTop;
