import { useEffect } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import Global from 'components/Constants';
import cn from 'classnames';

import styles from './Footer.module.scss';

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
    <span className={styles.footer_container}>
      <Menu className={styles.inner_footer_container_2} icon="labeled">
        <div className={styles.footer_menu_items}>
          <a href="/">
            <Menu.Item className={styles.sidebar_menu_text_blog}>Play</Menu.Item>
          </a>

          <a href="https://docs.decentral.games/info/risks" target="_blank">
            <Menu.Item className={styles.sidebar_menu_text_blog}>Risks</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/disclaimer"
            target="_blank"
          >
            <Menu.Item className={styles.sidebar_menu_text_blog}>Disclaimer</Menu.Item>
          </a>

          <a
            href="https://docs.decentral.games/info/privacy-policy"
            target="_blank"
          >
            <Menu.Item className={styles.sidebar_menu_text_blog}>
              Privacy Policy
            </Menu.Item>
          </a>

          <a href="https://decentralgames.substack.com/" target="_blank">
            <Menu.Item className={styles.sidebar_menu_text_blog}>Newsletter</Menu.Item>
          </a>

          <a
            href="https://drive.google.com/drive/u/1/folders/1YZ2j2zKQoSvwap6M3xecUHZwQmDLWBPC"
            target="_blank"
          >
            <Menu.Item className={styles.sidebar_menu_text_blog}>Press Kit</Menu.Item>
          </a>
        </div>
      </Menu>

      <Menu className={cn("justify-content-center")} icon="labeled">
        <div className={cn("d-flex flex-wrap justify-content-center")}>
          <a
            href={`https://github.com/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span className={styles.social_icons_link}>
              <Menu.Item className={styles.right_menu_text} id="dropdown-more-items">
                <Icon
                  className={styles.social_icons}
                  name="github"
                />
              </Menu.Item>
            </span>
          </a>

          <a href={Global.CONSTANTS.DISCORD_URL} target="_blank">
            <span className={styles.social_icons_link}>
              <Menu.Item className={styles.right_menu_text} id="dropdown-more-items">
                <Icon
                  className={styles.social_icons}
                  name="discord"
                />
              </Menu.Item>
            </span>
          </a>

          <a
            href={`https://t.me/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span className={styles.social_icons_link}>
              <Menu.Item className={styles.right_menu_text} id="dropdown-more-items">
                <Icon
                  className={styles.social_icons}
                  name="telegram"
                />
              </Menu.Item>
            </span>
          </a>

          <a
            href={`https://twitter.com/${Global.CONSTANTS.SOCIAL_HANDLE}`}
            target="_blank"
          >
            <span className={styles.social_icons_link}>
              <Menu.Item className={styles.right_menu_text} id="dropdown-more-items">
                <Icon
                  className={styles.social_icons}
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
