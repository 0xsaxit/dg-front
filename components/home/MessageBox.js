import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
import Web3 from 'web3';
import Aux from '../_Aux';

const MessageBox = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [messages, setMessage] = useState([]);
  let userAddress = '';
  let ws = {};

  const web3 = new Web3();
  const abiCoder = web3.eth.abi;

  // 0x2e5e27d50EFa501D90Ad3638ff8441a0C0C0d75e // pos_child_chain_manager_contract_address

  const data = {
    id: 1,
    method: 'eth_subscribe',
    params: ['newDeposits', {}],
  };

  const initWebsocket = () => {
    ws = new WebSocket('wss://ws-mumbai.matic.today');

    ws.onopen = () => {
      console.log('Open WebSocket connection');

      // ws.send(
      //   `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits",{"Contract": "0x2e5e27d50EFa501D90Ad3638ff8441a0C0C0d75e"}]}`
      // );

      // ws.send(
      //   `{"id": 1, "method": "eth_subscribe", "params": ["newDeposits",{}]}`
      // );

      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      dispatch({
        type: 'message_box',
        data: 3,
      });

      console.log('deposit data...');

      // const dataString = event.data.toString();
      // console.log(dataString.result);

      const parsedData = JSON.parse(event.data);
      console.log(parsedData);

      if (parsedData.result) console.log(parsedData.result);

      // console.log(parsedMsg);
      // const parsedMsg = event.data; // .toString();
      // console.log(parsedMsg.params.result.Data);

      if (
        parsedData &&
        parsedData.params &&
        parsedData.params.result &&
        parsedData.params.result.Data
      ) {
        const fullData = parsedData.params.result.Data;
        const { 0: syncType, 1: syncData } = abiCoder.decodeParameters(
          ['bytes32', 'bytes'],
          fullData
        );

        setMessage([...messages, fullData]);
      }

      // setMessage([...messages, event.data]);
      // const txData = JSON.parse(event.data); // , 'params.result.Data', '');
      // var userAddress = txData.substring(0, 64).replace(/^0+/, '0x');
      // var contractAddress = txData.substring(65, 128).replace(/^0+/, '0x');

      // setMessage([...messages, parsedMsg]);
    };

    ws.onclose = () => {
      console.log('Close WebSocket connection');

      initWebsocket();
    };
  };

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
    }
  }, [state.userStatus]);

  useEffect(() => {
    initWebsocket();

    // cleanup method which will be called before next execution. in your case unmount.
    return () => {
      ws.close;
    };
  }, []);

  if (state.messageBox) {
    return (
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
        ) : state.messageBox == 3 ? (
          <Aux>
            <p style={{ fontSize: '16px', fontWeight: 'bold' }}>Testing...</p>
            <p style={{ fontSize: '16px' }}>
              {messages.map((message, i) => (
                <li key={i}>{message}</li>
              ))}
            </p>
          </Aux>
        ) : null}
      </Message>
    );
  } else {
    return null;
  }
};

export default MessageBox;
