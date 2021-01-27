import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { useRouter } from 'next/router';
import { Menu, Icon } from 'semantic-ui-react';
import Global from '../Constants';

const Footer = () => {
  // get user address from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const router = useRouter();

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // send current page data to Segment analytics
  useEffect(() => {
    analytics.page(router.pathname, {
      path: router.pathname,
      address: state.userAddress,
    });
  }, [router.pathname]);

  return (
    <span className="footer-container">
      <Menu className="inner-footer-container-2" icon="labeled">
        <div className="footer-menu-items">
          <a href="/">
            <Menu.Item className="sidebar-menu-text blog">PLAY</Menu.Item>
          </a>

          <a href="https://docs.decentral.games/info/risks" target="_blank">
            <Menu.Item className="sidebar-menu-text blog">RISKS</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/disclaimer"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">DISCLAIMER</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/privacy-policy"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">
              PRIVACY POLICY
            </Menu.Item>
          </a>

          <a
            href="https://decentralgames.substack.com/"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">NEWSLETTER</Menu.Item>
          </a>

          <a
            href="https://drive.google.com/drive/u/1/folders/1YZ2j2zKQoSvwap6M3xecUHZwQmDLWBPC"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">PRESS KIT</Menu.Item>
          </a>

          <a href="https://docs.decentral.games" target="_blank">
            <Menu.Item className="sidebar-menu-text blog">DOCS</Menu.Item>
          </a>
        </div>
      </Menu>

      <Menu className="inner-footer-container-2" icon="labeled">
        <div className="footer-menu-items">
          <a
            href={`https://github.com/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span style={{ display: 'flex', marginBottom: '6px' }}>
              <Menu.Item className="right-menu-text" id="dropdown-more-items">
                <Icon
                  style={{ marginLeft: '-6px', marginRight: '11px' }}
                  name="github"
                />
              </Menu.Item>
            </span>
          </a>

          <a href={Global.CONSTANTS.DISCORD_URL} target="_blank">
            <span style={{ display: 'flex', marginBottom: '6px' }}>
              <Menu.Item className="right-menu-text" id="dropdown-more-items">
                <Icon
                  style={{ marginLeft: '-5px', marginRight: '10px' }}
                  name="discord"
                />
              </Menu.Item>
            </span>
          </a>

          <a
            href={`https://t.me/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span style={{ display: 'flex', marginBottom: '6px' }}>
              <Menu.Item className="right-menu-text" id="dropdown-more-items">
                <Icon
                  style={{ marginLeft: '-5px', marginRight: '10px' }}
                  name="telegram"
                />
              </Menu.Item>
            </span>
          </a>

          <a
            href={`https://twitter.com/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span style={{ display: 'flex', marginBottom: '6px' }}>
              <Menu.Item className="right-menu-text" id="dropdown-more-items">
                <Icon
                  style={{ marginLeft: '-5px', marginRight: '10px' }}
                  name="twitter"
                />
              </Menu.Item>
            </span>
          </a>
        </div>
      </Menu>
    </span>
  );
};

export default Footer;
