import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';
import Aux from '../_Aux';

const MaticWidget = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // useEffect(() => {
  //   if (state.userStatus) {
  //     <script
  //       src="https://wallet.matic.today/embeds/widget-button.js"
  //       data-script-name="matic-embeds"
  //     ></script>;
  //   }
  // }, [state.userStatus]);

  // useEffect(() => {
  //   setTimeout(() => {
  //     console.log('timeout foo foo foo...');

  //     return (
  //       <script
  //         src="https://wallet.matic.today/embeds/widget-button.js"
  //         data-script-name="matic-embeds"
  //       ></script>
  //     );
  //   }, 10000);
  // }, []);

  function button() {
    return (
      <Aux>
        <Button
          className={props.style}
          class="matic-widget-button"
          data-default-page="home"
          data-wapp-id="xeYvesZxGiEKOMt4gq3s"
        >
          {props.label}
        </Button>

        <script
          src="https://wallet.matic.today/embeds/widget-button.js"
          data-script-name="matic-embeds"
        ></script>
      </Aux>
    );
  }

  return button();
};

export default MaticWidget;
