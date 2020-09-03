import { useContext } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
import Aux from '../_Aux';

const MessageBox = (props) => {
  // get token ping state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (state.tokenPings >= 2) {
    return (
      <div className="deposit-notification-container">
        <Message
          className="deposit-notification-box"
          onDismiss={props.handleDismiss}
        >
          {state.tokenPings === 1 ? (
            <Aux>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Deposit Confirming on Matic
              </p>
              <p style={{ fontSize: '16px' }}>
                Matic balances will update once deposit is confirmed
              </p>
              <p style={{ fontSize: '16px' }}>(Normally 2 - 3 minutes)</p>
            </Aux>
          ) : state.tokenPings === 2 ? (
            <Aux>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Deposit Confirmed on Matic
              </p>
              <p style={{ fontSize: '16px' }}>
                Your Matic balances have been updated
              </p>
            </Aux>
          ) : state.tokenPings === 3 ? (
            <Aux>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Withdrawal Confirmed on Matic
              </p>
              <p style={{ fontSize: '16px' }}>
                Your Matic balances have been updated
              </p>
            </Aux>
          ) : null}
        </Message>
      </div>
    );
  } else return null;
};

export default MessageBox;
