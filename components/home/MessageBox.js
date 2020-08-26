import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
// import Web3 from 'web3';
import Aux from '../_Aux';

const MessageBox = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';
  const ws = new WebSocket('wss://ws-mumbai.matic.today');
  // const web3 = new Web3();
  // const abiCoder = web3.eth.abi;

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      ws.onopen = () => {
        ws.send(
          `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits", {"0x2e5e27d50EFa501D90Ad3638ff8441a0C0C0d75e"}]}`
        );
      };

      ws.onclose = () => {
        console.log('closing websocket connection...');
      };
    }
  }, [state.userStatus]);

  useEffect(() => {
    ws.onmessage = (data) => {
      console.log('deposit data...');
      console.log(data);
    };
  });

  return (
    <div className="deposit-notification-container">
      <Message
        className="deposit-notification-box"
        onDismiss={props.handleDismiss}
      >
        {state.messageBox == 1 ? (
          <Aux>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Deposit Confirming on Matic
            </p>
            <p style={{ fontSize: '16px' }}>
              Matic balances will update once deposit is confirmed
            </p>
            <p style={{ fontSize: '16px' }}>(Normally 2 - 3 minutes)</p>
          </Aux>
        ) : state.messageBox == 2 ? (
          <Aux>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
              Deposit Confirmed on Matic
            </p>
            <p style={{ fontSize: '16px' }}>
              Your Matic balances have been updated
            </p>
          </Aux>
        ) : null}
      </Message>
    </div>
  );
};

export default MessageBox;
