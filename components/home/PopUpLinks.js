import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Menu, Button, Popup, Icon, Checkbox } from 'semantic-ui-react';
import { UseDarkMode } from '../UseDarkMode';

const PopUpLinks = (props) => {
  // dispatch theme (light or dark mode) to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [theme, toggleTheme] = UseDarkMode();

  useEffect(() => {
    dispatch({
      type: 'toggle_theme',
      data: theme,
    });
  }, [theme]);

  return (
    <Popup
      on="click"
      pinned
      position="bottom right"
      trigger={
        <Button color="blue" className="more-dropdown-button">
          <Icon
            name="ellipsis horizontal"
            style={{ marginRight: '-4px', marginTop: '-2px', fontSize: '16px' }}
          />
        </Button>
      }
    >
      <span
        style={{ display: 'flex', flexDirection: 'column', marginTop: '-5px' }}
      >
        <a href="https://docs.decentral.games" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-6px', marginRight: '11px' }}
                name="file outline"
              />
              DOCS
            </Menu.Item>
          </span>
        </a>

        <a href="https://github.com/decentralgames" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-6px', marginRight: '11px' }}
                name="code"
              />
              CODE
            </Menu.Item>
          </span>
        </a>

        <a
          href="https://drive.google.com/drive/u/1/folders/1YZ2j2zKQoSvwap6M3xecUHZwQmDLWBPC"
          target="_blank"
        >
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-5px', marginRight: '10px' }}
                name="archive"
              />
              PRESS KIT
            </Menu.Item>
          </span>
        </a>

        <a href="https://discord.com/invite/cvbSNzY" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-5px', marginRight: '10px' }}
                name="discord"
              />
              DISCORD
            </Menu.Item>
          </span>
        </a>

        <a href="https://t.me/decentralgames" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-5px', marginRight: '10px' }}
                name="telegram"
              />
              TELEGRAM
            </Menu.Item>
          </span>
        </a>

        <a href="https://twitter.com/decentralgames" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className="right-menu-text" id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-5px', marginRight: '10px' }}
                name="twitter"
              />
              TWITTER
            </Menu.Item>
          </span>
        </a>

        <span style={{ display: 'flex', paddingTop: '6px' }}>
          {props.isDarkMode ? (
            <Menu.Item
              className="right-menu-text"
              id="dropdown-more-items-theme"
              style={{ marginTop: '-6px', fontSize: '14px' }}
            >
              <Icon
                style={{ marginLeft: '-4px', marginRight: '4px' }}
                name="moon"
              />
            </Menu.Item>
          ) : (
            <Menu.Item
              className="right-menu-text"
              id="dropdown-more-items-theme"
              style={{ marginTop: '-6px', fontSize: '16px' }}
            >
              <Icon
                style={{ marginLeft: '-5px', marginRight: '3px' }}
                name="sun"
              />
            </Menu.Item>
          )}

          <Checkbox
            style={{ marginTop: '-6px' }}
            className="radio-theme-toggle"
            onChange={toggleTheme}
            toggle
          />
        </span>
      </span>
    </Popup>
  );
};

export default PopUpLinks;
