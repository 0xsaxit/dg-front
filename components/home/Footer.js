import { useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Global from '../Constants';

const Footer = () => {
  // define local variables
  let linkDocs = '';

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    linkDocs = document.getElementById('docs-footer');
  }, []);

  useEffect(() => {
    if (linkDocs) {
      analytics.trackLink(linkDocs, 'Clicked DOCS link (footer)');
    }
  }, [linkDocs]);

  return (
    <span className="footer-container">
      <Menu className="inner-footer-container-2" icon="labeled">
        <div className="footer-menu-items">
          <a href="/">
            <Menu.Item className="sidebar-menu-text blog">Play</Menu.Item>
          </a>

          <a href="https://docs.decentral.games/info/risks" target="_blank">
            <Menu.Item className="sidebar-menu-text blog">Risks</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/disclaimer"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">Disclaimer</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/privacy-policy"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">
              Privacy Policy
            </Menu.Item>
          </a>

          <a href="https://decentralgames.substack.com/" target="_blank">
            <Menu.Item className="sidebar-menu-text blog">Newsletter</Menu.Item>
          </a>

          <a
            href="https://drive.google.com/drive/u/1/folders/1YZ2j2zKQoSvwap6M3xecUHZwQmDLWBPC"
            target="_blank"
          >
            <Menu.Item className="sidebar-menu-text blog">Press Kit</Menu.Item>
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
                  style={{ marginLeft: '-6px', marginRight: '8px' }}
                  name="github"
                />
              </Menu.Item>
            </span>
          </a>

          <a href={Global.CONSTANTS.DISCORD_URL} target="_blank">
            <span style={{ display: 'flex', marginBottom: '6px' }}>
              <Menu.Item className="right-menu-text" id="dropdown-more-items">
                <Icon
                  style={{ marginLeft: '-5px', marginRight: '8px' }}
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
                  style={{ marginLeft: '-5px', marginRight: '8px' }}
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
                  style={{ marginLeft: '-5px', marginRight: '8px' }}
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
