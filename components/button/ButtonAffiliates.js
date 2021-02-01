import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button, Icon } from 'semantic-ui-react';
import Global from '../Constants';

const ButtonAffiliates = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(
      Global.CONSTANTS.BASE_URL + '/' + state.userInfo[1]
    );
    setCopied(true);

    // track 'Affiliate Link' button click event
    analytics.track('Clicked AFFILIATE LINK button');
  };

  if (copied) {
    return (
      <span
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginBottom: '-20px',
        }}
      >
        <Button className="affiliate-copied-button">
          Copied
          <Icon
            name="check square outline"
            id="etherscan-button-icon"
            style={{ marginLeft: '0px', marginRight: '3px', marginTop: '-1px' }}
          />
        </Button>
      </span>
    );
  }
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '-20px',
      }}
    >
      <Button className="affiliate-copy-button" onClick={() => onCopy()}>
        affiliate link
        <Icon
          name="copy outline"
          id="etherscan-button-icon"
          style={{ marginLeft: '3px', marginTop: '-1px' }}
        />
      </Button>
    </span>
  );
};

export default ButtonAffiliates;
