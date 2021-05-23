import { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
import Aux from '../_Aux';

const MessageBox = (props) => {
  // get token ping state from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  if (state.tokenPings) {
    return (
      <span>
        <div className="deposit-notification-container">
          <Message className="deposit-notification-box">
            {state.tokenPings === 1 ? (
              <Aux>
                <p
                  className="deposit-message-text top"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Transaction Pending on Polygon Network
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  Token balances will update once transaction is confirmed
                </p>
              </Aux>
            ) : state.tokenPings === 2 ? (
              <Aux>
                <p
                  className="deposit-message-text top"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Transaction Pending on Polygon Network
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  Treasury balances will update once transaction is confirmed
                </p>
              </Aux>
            ) : state.tokenPings === 3 ? (
              <Aux>
                <p
                  className="deposit-message-text top"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Deposit Confirmed on Polygon Network
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  Your token balances have been updated
                </p>
              </Aux>
            ) : state.tokenPings === 4 ? (
              <Aux>
                <p
                  className="deposit-message-text top"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Withdrawal Confirmed on Ethereum Network
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  Your token balances have been updated
                </p>
              </Aux>
            ) : state.tokenPings === 5 ? (
              <Aux>
                <p
                  className="deposit-message-text ttop"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Pause Transaction Confirmed
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  All treasury contract games have been UNPAUSED
                </p>
              </Aux>
            ) : state.tokenPings === 6 ? (
              <Aux>
                <p
                  className="deposit-message-text top"
                  style={{ fontSize: '16px', fontWeight: 'bold' }}
                >
                  Pause Transaction Confirmed
                </p>
                <p
                  className="deposit-message-text"
                  style={{ fontSize: '16px' }}
                >
                  All treasury contract games have been PAUSED
                </p>
              </Aux>
            ) : null}
          </Message>
        </div>
      </span>
    );
  } else return null;
};

export default MessageBox;