import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Message } from 'semantic-ui-react';
import Aux from '../_Aux';
import Global from '../Constants';

const MessageBox = (props) => {
  // get token balances from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amount, setAmount] = useState(state.balances[0][1]);

  let userAddress = '';
  let maticWeb3 = {};

  useEffect(() => {
    if (window.web3) {
      userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window.ethereum); // use the MetaMask provider
      maticWeb3 = new window.Web3(
        new window.Web3.providers.HttpProvider(Global.MATIC_URL)
      );

      async function fetchData() {
        const response = await getTokenBalances();
        const newAmount = response[0][1];

        if (newAmount !== amount) {
          // update global state balances
          dispatch({
            type: 'update_balances',
            data: response,
          });

          // update message box text
          dispatch({
            type: 'message_box',
            data: 2,
          });

          setAmount(newAmount);
          clearInterval(interval);
        }
      }

      // call token contract every 10 seconds to get new balances
      const interval = setInterval(() => {
        fetchData();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, []);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // get balances on mainnet and Matic networks
  async function getTokenBalances() {
    const addresses = await Global.API_ADDRESSES;

    const TOKEN_CONTRACT_ROOT = window.web3.eth
      .contract(Global.ABIs.ROOT_TOKEN)
      .at(addresses.ROOT_TOKEN_ADDRESS_MANA);

    const TOKEN_CONTRACT_CHILD = maticWeb3.eth
      .contract(Global.ABIs.CHILD_TOKEN)
      .at(addresses.CHILD_TOKEN_ADDRESS_MANA);

    try {
      const amount1 = await Global.balanceOfToken(
        TOKEN_CONTRACT_ROOT,
        userAddress
      );
      const amount2 = await Global.balanceOfToken(
        TOKEN_CONTRACT_CHILD,
        userAddress
      );

      return [
        [amount1, amount2],
        [0, 0],
      ];
    } catch (error) {
      console.log(error);
    }
  }

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
