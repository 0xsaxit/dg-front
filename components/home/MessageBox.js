import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
import Web3 from 'web3';
import Aux from '../_Aux';
import Global from '../Constants';

const MessageBox = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  // const [amounts, setAmount] = useState([]);

  let addressMetaMask = '';
  let ws = {};
  let maticWeb3 = {};
  const web3 = new Web3();
  const abiCoder = web3.eth.abi;
  const data = {
    id: 1,
    method: 'eth_subscribe',
    params: [
      'newDeposits',
      { Contract: '0xb5505a6d998549090530911180f38aC5130101c6' },
    ],
  };

  useEffect(() => {
    if (state.userStatus) {
      addressMetaMask = window.web3.currentProvider.selectedAddress;

      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (state.userStatus) {
      initWebSocket();

      // cleanup method called before unmount
      return () => {
        ws.close;
      };
    }
  }, [state.userStatus]);

  const initWebSocket = () => {
    ws = new WebSocket('wss://ws-mumbai.matic.today');

    ws.onopen = () => {
      console.log('Open WebSocket connection');

      ws.send(JSON.stringify(data));
    };

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.result) console.log('Listening for events');

      /////////////////////////////////////////////////////////////////////////////////////////
      /////////////////////////////////////////////////////////////////////////////////////////
      // if this is a deposit/withdraw event let's parse and decode the data
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

        /////////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////////
        // check if sync is of deposit type (keccak256("DEPOSIT")) and filter the data
        const depositType =
          '0x87a7811f4bfedea3d341ad165680ae306b01aaeacc205d227629cf157dd9f821';
        if (syncType.toLowerCase() === depositType.toLowerCase()) {
          const {
            0: userAddress,
            1: rootTokenAddress,
            2: depositData,
          } = abiCoder.decodeParameters(
            ['address', 'address', 'bytes'],
            syncData
          );

          // const addressMetaMask = window.web3.currentProvider.selectedAddress;

          console.log('User address (MetaMask): ' + addressMetaMask);
          console.log('User address (return data): ' + userAddress);
          console.log('Root token address: ' + rootTokenAddress);

          // decode depositData to get amount
          if (userAddress.toLowerCase() === addressMetaMask) {
            const { 0: amount } = abiCoder.decodeParameters(
              ['uint256'],
              depositData
            );

            const amountAdjusted = amount / Global.FACTOR;
            console.log('Amount: ' + amountAdjusted);

            // setAmount([...amounts, amountAdjusted]);

            // display the message box with updated deposit amount
            dispatch({
              type: 'message_box',
              data: [...state.messageBox, amountAdjusted],
            });

            // update global state token balances
            (async function () {
              const response = await getTokenBalances();

              dispatch({
                type: 'update_balances',
                data: response,
              });
            })();
          }
        }
      }
    };

    ws.onclose = () => {
      console.log('Close WebSocket connection');

      initWebSocket();
    };
  };

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const addresses = await Global.API_ADDRESSES;

    const TOKEN_CONTRACT_ROOT = window.web3.eth
      .contract(Global.ABIs.ROOT_TOKEN)
      .at(addresses.ROOT_TOKEN_ADDRESS_MANA);

    // const TOKEN_CONTRACT_ROOT = new web3.eth.Contract(
    //   Global.ABIs.ROOT_TOKEN,
    //   addresses.ROOT_TOKEN_ADDRESS_MANA
    // );

    const TOKEN_CONTRACT_CHILD = maticWeb3.eth
      .contract(Global.ABIs.CHILD_TOKEN)
      .at(addresses.CHILD_TOKEN_ADDRESS_MANA);

    try {
      const amount1 = await Global.balanceOfToken(
        TOKEN_CONTRACT_ROOT,
        addressMetaMask
      );
      const amount2 = await Global.balanceOfToken(
        TOKEN_CONTRACT_CHILD,
        addressMetaMask
      );

      return [
        [amount1, amount2],
        [0, 0],
      ];
    } catch (error) {
      console.log(error);
    }
  }

  if (state.messageBox.length) {
    return (
      <Message
        className="deposit-notification-box"
        onDismiss={props.handleDismiss}
      >
        {
          // state.messageBox.length === 1 ? (
          //   <Aux>
          //     <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
          //       Deposit Confirming on Matic
          //     </p>
          //     <p style={{ fontSize: '16px' }}>
          //       Matic balances will update once deposit is confirmed
          //     </p>
          //     <p style={{ fontSize: '16px' }}>(Normally 2 - 3 minutes)</p>
          //   </Aux>
          // ) :
          state.messageBox.length ? (
            <Aux>
              <p style={{ fontSize: '16px', fontWeight: 'bold' }}>
                Deposit Confirmed on Matic
              </p>
              <p style={{ fontSize: '16px' }}>
                {state.messageBox.map((amount, i) => (
                  <li key={i}>Deposited amount: {amount}</li>
                ))}
              </p>
              <p style={{ fontSize: '16px' }}>
                Your Matic balances have been updated
              </p>
            </Aux>
          ) : null
        }
      </Message>
    );
  } else {
    return null;
  }
};

export default MessageBox;
