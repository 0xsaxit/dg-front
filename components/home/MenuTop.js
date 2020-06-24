import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import ModalDeposit from '../modal/ModalDeposit';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import Global from '../Constants';

const MenuTop = (props) => {
  const [manaTokenBalance, setTokenBalance] = useState(0);
  let maticWeb3 = {};
  const router = useRouter();

  useEffect(() => {
    if (window.web3) {
      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );

      window.ethereum.on('accountsChanged', async () => {
        getTokenBalance();
      });

      Global.delay(2000); // give a little time to fetch the addresses from server
      getTokenBalance();
    }
  });

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on Matic Network
  async function getTokenBalance() {
    try {
      const amount = await Global.balanceOfToken('matic', maticWeb3);
      setTokenBalance(amount);
    } catch (err) {
      console.log('token balance error foo: ' + err);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // getter function
  function getLinkStyles(path) {
    if (path === 'menu') {
      if ('/' === router.pathname) {
        return 'menu-container';
      } else {
        return 'menu-container-dark';
      }
    } else {
      if (path === router.pathname) {
        return 'sidebar-menu-text' + ' active';
      } else {
        return 'sidebar-menu-text';
      }
    }
  }

  return (
    <Menu className={getLinkStyles('menu')} icon="labeled">
      <Link href="/">
        <img
          className="image inline pointer"
          src="https://res.cloudinary.com/dnzambf4m/image/upload/v1589058640/authorize_title_v3ze35.png"
          style={{
            width: '42px',
            paddingTop: '15px',
            paddingBottom: '15px',
            marginRight: '12px',
            height: '100%',
          }}
        />
      </Link>

      <Link href="/">
        <Menu.Item className={getLinkStyles('/')}>HOME</Menu.Item>
      </Link>

      {props.dashboard ? (
        <Link href="/account">
          <Menu.Item className={getLinkStyles('/account')}>ACCOUNT</Menu.Item>
        </Link>
      ) : null}

      {props.dashboard ? (
        <Link href="/nfts">
          <Menu.Item className={getLinkStyles('/nfts')}>NFTS</Menu.Item>
        </Link>
      ) : null}

      <Menu.Item
        href="https://docs.decentral.games/games/slots"
        target="_blank"
        className="sidebar-menu-text"
      >
        <div>
          GAMES
        </div>
      </Menu.Item>

      <Link href="/blog">
        <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
      </Link>

      <Menu.Item
        href="https://docs.decentral.games/"
        target="_blank"
        className="sidebar-menu-text"
      >
        <div>
          DOCS
        </div>
      </Menu.Item>

      {props.dashboard ? (
        <div>
          <span className="sidebar-menu-text-2">
            <img
              style={{
                verticalAlign: 'middle',
                marginRight: '6px',
              }}
              className="image inline"
              width="20px"
              height="20px"
              src={dai}
            />
            0 DAI
          </span>

          <span className="sidebar-menu-text-3">
            <img
              style={{
                verticalAlign: 'middle',
                marginRight: '6px',
              }}
              className="image inline"
              width="20px"
              height="20px"
              src={mana}
            />
            {manaTokenBalance} MANA
          </span>

          <ModalDeposit />
        </div>
      ) : (
        <ModalVerify />
      )}
    </Menu>
  );
};

export default MenuTop;
