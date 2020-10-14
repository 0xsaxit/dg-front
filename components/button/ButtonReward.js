import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Button } from 'semantic-ui-react';

function ButtonReward() {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables

  function transaction() {
    return console.log('transaction...');
  }

  return (
    <Button className="account-connected-play-button" onClick={transaction}>
      NOTIFY REWARD AMOUNT
    </Button>
  );
}

export default ButtonReward;
