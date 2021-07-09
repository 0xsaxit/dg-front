import { useEffect, useContext } from 'react';
import { Menu, Button, Icon } from 'semantic-ui-react';
import { GlobalContext } from 'store';
import { UseDarkMode } from 'components/UseDarkMode';
import cn from 'classnames';

import styles from 'PopUpLinks.module.scss';

const PopUpLinks = props => {
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
    <Button className={styles.more_dropdown_button} onClick={toggleTheme}>
      {props.isDarkMode ? (
        <Menu.Item className={styles.more_dropdown_menu_one}>
          <Icon className={cn("text-white")} name="moon" />
        </Menu.Item>
      ) : (
        <Menu.Item className={styles.more_dropdown_menu_two}>
          <Icon className={cn("text-white")} name="sun" />
        </Menu.Item>
      )}
    </Button>
  );
};

export default PopUpLinks;
