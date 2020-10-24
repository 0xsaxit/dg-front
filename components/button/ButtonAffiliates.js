import { useState, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';

const ButtonAffiliates = () => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [copied, setCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(
      `https://decentral.games/${state.userInfo[1]}`
    );
    setCopied(true);
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
          <span className="material-icons" id="etherscan-button-icon">
            check
          </span>
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
        <span className="material-icons" id="etherscan-button-icon">
          content_copy
        </span>
      </Button>
    </span>
  );
};

export default ButtonAffiliates;
