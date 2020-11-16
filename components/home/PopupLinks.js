import { useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Menu, Button, Popup, Icon, Checkbox } from 'semantic-ui-react';
import { UseDarkMode } from '../UseDarkMode';

const PopupLinks = (props) => {
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
          <span className="material-icons">more_horiz</span>
        </Button>
      }
    >
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <a href="https://docs.decentral.games" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className={props.menuStyle[7]} id="dropdown-more-items">
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
            <Menu.Item className={props.menuStyle[7]} id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-6px', marginRight: '11px' }}
                name="code"
              />
              CODE
            </Menu.Item>
          </span>
        </a>

        <a href="https://discord.com/invite/cvbSNzY" target="_blank">
          <span style={{ display: 'flex', marginBottom: '6px' }}>
            <Menu.Item className={props.menuStyle[7]} id="dropdown-more-items">
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
            <Menu.Item className={props.menuStyle[7]} id="dropdown-more-items">
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
            <Menu.Item className={props.menuStyle[7]} id="dropdown-more-items">
              <Icon
                style={{ marginLeft: '-5px', marginRight: '10px' }}
                name="twitter"
              />
              TWITTER
            </Menu.Item>
          </span>
        </a>

        <span style={{ display: 'flex', paddingTop: '8px' }}>
          {props.isDarkMode ? (
            <span id="moon-icon" className="material-icons">
              brightness_4
            </span>
          ) : (
            <span id="sun-icon" className="material-icons">
              brightness_7
            </span>
          )}

          <Checkbox
            className="radio-theme-toggle"
            onChange={toggleTheme}
            toggle
          />
        </span>
      </span>
    </Popup>
  );
};

export default PopupLinks;
