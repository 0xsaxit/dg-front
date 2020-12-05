import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import { Form, Input } from 'semantic-ui-react';
// import ABI_TREASURY_CONTRACT from '../ABI/ABITreasury';
import Global from '../Constants';
import Images from '../../common/Images';
import Transactions from '../../common/Transactions';

const ContentModal = (props) => {
  // get user's status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [parentContract, setParentContract] = useState({});
  const [amount, setAmount] = useState(0);
  const [transaction, setTransaction] = useState(false);
  const [web3, setWeb3] = useState({});
  const [instances, setInstances] = useState(false);

  let userAddress = '';
  // let web3 = {};
  // let contractAddress = {};

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // initialize web3 provider and create treasury contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      (async function () {
        const parentContract = await Transactions.treasuryContract(
          state.addresses,
          web3
        );
        setParentContract(parentContract);

        setInstances(true);
      })();
    }
  }, [state.userStatus, transaction, amount]);

  useEffect(() => {
    if (instances) {
      if (transaction && amount) {
        if (props.type === 'deposit') {
          depositFunds(); // MetaMask popup window
        } else {
          withdrawFunds(); // MetaMask popup window
        }
      } else {
        setTransaction(false);
      }
    }
  }, [instances, transaction, amount]);

  function inputChange(e) {
    const valueWei = e.target.value * Global.CONSTANTS.FACTOR;
    setAmount(valueWei);
  }

  async function depositFunds() {
    props.showModal(false); // close the modal

    const txHash = await depositToParent(
      props.gameTypeInt,
      0,
      amount,
      userAddress,
      web3
    );
    console.log('Tx Hash: ' + txHash);

    initializePings();
  }

  function depositToParent(gameID, tokenID, amount, userAddress) {
    return new Promise(async (resolve, reject) => {
      console.log('Deposit start: ' + amount);

      try {
        // const parentContract = await Transactions.treasuryContract(web3);

        parentContract.addFunds(
          gameID,
          tokenID,
          amount,
          {
            from: userAddress,
            gasLimit: web3.toHex(Global.CONSTANTS.GAS_LIMIT),
            gasPrice: web3.toHex(Global.CONSTANTS.GAS_AMOUNT),
          },
          async function (err, hash) {
            if (err) {
              console.log('Deposit failed', err);
              reject(false);
            }

            console.log('Deposit done');
            resolve(hash);
          }
        );
      } catch (error) {
        console.log('Deposit failed', error);
        reject(false);
      }
    });
  }

  async function withdrawFunds() {
    props.showModal(false); // close the modal

    const txHash = await withdrawFromParent(
      props.gameTypeInt,
      0,
      amount,
      userAddress,
      web3
    );
    console.log('Tx Hash: ' + txHash);

    initializePings();
  }

  function withdrawFromParent(gameID, tokenID, amount, userAddress) {
    return new Promise(async (resolve, reject) => {
      console.log('Withdraw start: ' + amount);

      try {
        // const parentContract = await Transactions.treasuryContract(web3);

        parentContract.withdrawGameTokens(
          gameID,
          tokenID,
          amount,
          {
            from: userAddress,
            gasLimit: web3.toHex(Global.CONSTANTS.GAS_LIMIT),
            gasPrice: web3.toHex(Global.CONSTANTS.GAS_AMOUNT),
          },
          async function (err, hash) {
            if (err) {
              console.log('Withdraw failed', err);
              reject(false);
            }

            console.log('Withdraw done');
            resolve(hash);
          }
        );
      } catch (error) {
        console.log('Withdraw failed', error);
        reject(false);
      }
    });
  }

  function initializePings() {
    console.log('Ping token contract');

    // ping token contract for transaction confirmation
    dispatch({
      type: 'token_pings',
      data: 2,
    });
  }

  return (
    <span style={{ display: 'flex' }}>
      <Form.Field>
        <Input
          className="admin-modal-input"
          placeholder={'ENTER AMOUNT'}
          action={{
            color: 'blue',
            labelPosition: 'right',
            content: `${props.type}`,
            icon: 'ethereum',
            onClick: () => setTransaction(true),
          }}
          onChange={inputChange}
        />
      </Form.Field>

      <span
        className={
          props.gameSelect === 'dai' ? 'account-select dai' : 'account-select'
        }
        onClick={() => props.handleChange('dai')}
      >
        <img
          style={{
            verticalAlign: 'middle',
            marginTop: '35px',
          }}
          alt="Dai Logo"
          className="image inline"
          width="21px"
          height="21px"
          src={Images.DAI_CIRCLE}
        />
        DAI
      </span>

      <span
        className={
          props.gameSelect === 'mana' ? 'account-select mana' : 'account-select'
        }
        onClick={() => props.handleChange('mana')}
      >
        <img
          style={{
            verticalAlign: 'middle',
            marginTop: '35px',
          }}
          alt="Decentraland Logo"
          className="image inline"
          width="21px"
          height="21px"
          src={Images.MANA_CIRCLE}
        />
        MANA
      </span>
    </span>
  );
};

export default ContentModal;
