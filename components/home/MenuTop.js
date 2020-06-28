import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Menu } from 'semantic-ui-react';
import ModalVerify from '../modal/ModalVerify';
import ModalDeposit from '../modal/ModalDeposit';
import mana from '../../static/images/mana_circle.webp';
import dai from '../../static/images/dai_circle.webp';
import Global from '../Constants';

const MenuTop = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get path and render appropriate styles
  const router = useRouter();

  function getContainerStyles(path) {
    if (path === 'container') {
      if ('/' === router.pathname) {
        return 'dashboard-menu-container';
      } else {
        return 'other-menu-container';
      }
    }
  }

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
    <div className={getContainerStyles('container')}>
      <Menu className={getLinkStyles('menu')} icon="labeled">
        <Link href="/">
          <img
            className="image inline pointer"
            src={Global.LOGO}
            style={{
              width: '39px',
              paddingTop: '15px',
              paddingBottom: '15px',
              marginRight: '12px',
              marginLeft: '24px',
              height: '100%',
            }}
          />
        </Link>

        <Link href="/">
          <Menu.Item className={getLinkStyles('/')}>PLAY</Menu.Item>
        </Link>

        {state.dashboard ? (
          <Link href="/account">
            <Menu.Item className={getLinkStyles('/account')}>ACCOUNT</Menu.Item>
          </Link>
        ) : null}

        {state.dashboard ? (
          <Link href="/nfts">
            <Menu.Item className={getLinkStyles('/nfts')}>NFTS</Menu.Item>
          </Link>
        ) : null}

        <Menu.Item
          href="https://docs.decentral.games/games/slots"
          target="_blank"
          className="sidebar-menu-text"
        >
          <div>GAMES</div>
        </Menu.Item>

        <Link href="/blog">
          <Menu.Item className={getLinkStyles('/blog')}>BLOG</Menu.Item>
        </Link>

        <Menu.Item
          href="https://docs.decentral.games/"
          target="_blank"
          className="sidebar-menu-text"
        >
          <div>DOCS</div>
        </Menu.Item>

        {state.dashboard ? (
          <span className="right-menu-items">
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
              {state.balances[1][1]} DAI
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
              {state.balances[0][1]} MANA
            </span>

            <ModalDeposit isLink={0} />
          </span>
        ) : (
          <span className="right-menu-items">
            <ModalVerify />
          </span>
        )}
      </Menu>
    </div>
  );
};

export default MenuTop;
