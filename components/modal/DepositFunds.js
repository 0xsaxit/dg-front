import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Form, Input } from 'semantic-ui-react';
import Global from '../Constants';

const DepositFunds = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [amount, setAmount] = useState(0);
  const [transaction, setTransaction] = useState(false);

  let userAddress = '';
  let web3 = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;
      web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor

      if (transaction) depositFunds(); // MetaMask popup window
    }
  }, [state.userStatus, transaction]);

  function inputChange(e) {
    const valueWei = e.target.value * Global.FACTOR;
    setAmount(valueWei);
  }

  function depositFunds() {
    Global.depositToParent(props.gameTypeInt, 0, amount, userAddress, web3);
  }

  return (
    <Form.Field>
      <Input
        className="admin-modal-input"
        placeholder={'ENTER AMOUNT'}
        action={{
          color: 'blue',
          labelPosition: 'right',
          content: 'DEPOSIT',
          icon: 'ethereum',
          onClick: () => setTransaction(true),
        }}
        onChange={inputChange}
      />
    </Form.Field>
  );
};

export default DepositFunds;
