import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../store';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalEthAuth.module.scss';
import ABI_CHILD_TOKEN_WETH from '../../ABI/ABIChildTokenWETH';
import MetaTx from '../../../common/MetaTx';
import Fetch from '../../../common/Fetch';
import Aux from '../../_Aux';
import Global from '../../Constants';

const ModalEthAuth = props => {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [tokenContract, setTokenContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [spenderAddress, setSpenderAddress] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [canPurchase, setCanPurchase] = useState(true);
  const [itemLimitsArray, setItemLinitsArray] = useState([
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ]);
  const [open, setOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('Proceed to Mint');
  const [clicked, setClicked] = useState(false);
  const [done, setDone] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // initialize Web3 providers and create token contract instance
  useEffect(() => {
    if (state.userStatus >= 4) {
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API_1,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      const spenderAddress = Global.ADDRESSES.ICE_REGISTRANT_ADDRESS;
      setSpenderAddress(spenderAddress);

      const tokenContract = new getWeb3.eth.Contract(
        ABI_CHILD_TOKEN_WETH,
        Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
      );

      setTokenContract(tokenContract);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve ETH (wearables)');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  useEffect(() => {
    const itemLimit0 = state.itemLimits[0];
    const itemLimit5 = state.itemLimits[1];
    const itemLimit10 = state.itemLimits[2];
    const itemLimit15 = state.itemLimits[3];
    const itemLimit20 = state.itemLimits[4];

    let itemLimitsArray = [];
    itemLimitsArray.push(itemLimit0);
    itemLimitsArray.push(itemLimit5);
    itemLimitsArray.push(itemLimit10);
    itemLimitsArray.push(itemLimit15);
    itemLimitsArray.push(itemLimit20);

    setItemLinitsArray(itemLimitsArray);
  }, [state.itemLimits]);

  useEffect(() => {
    const authStatus = state.tokenAmounts.WETH_AUTHORIZATION;

    setAuthStatus(authStatus);
  }, [state.tokenAmounts]);

  useEffect(() => {
    const canPurchase = state.canPurchase;

    if (canPurchase) {
      setButtonMessage('Proceed to Mint');
    } else {
      setButtonMessage('Cooldown Period');
    }

    setCanPurchase(canPurchase);
  }, [state.canPurchase]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function approveWETH() {
    return (
      <Aux>
        <p className={styles.header}>Mint ICE Wearable</p>

        <p className={styles.description}>
          To mint a new ICE wearable, you first need to authorize Ethereum
          transactions for the amount of{' '}
          {state.tokenAmounts.WETH_COST_AMOUNT / Global.CONSTANTS.FACTOR} ETH
        </p>

        <div className={styles.upgrade_inner_container}>
          <div className={styles.upgrade_area}>
            <span onClick={() => metaTransaction()}>
              {!clicked && !done ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="white"
                    stroke-opacity="0.25"
                    stroke-width="4"
                  />
                </svg>
              ) : clicked && !done ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#35AB3A" />
                  <circle cx="16" cy="15.7" r="2.7" fill="white" />
                  <circle cx="8.7" cy="15.7" r="2.7" fill="white" />
                  <circle cx="23.3001" cy="15.7" r="2.7" fill="white" />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="16" cy="16" r="16" fill="#35AB3A" />
                  <path
                    d="M14.7197 23.5601C15.4375 23.5601 15.9941 23.3037 16.375 22.7471L23.084 12.8594C23.3477 12.4712 23.4648 12.0684 23.4648 11.7095C23.4648 10.6841 22.6445 9.90771 21.5898 9.90771C20.8794 9.90771 20.4106 10.1641 19.9785 10.8452L14.6904 19.0483L12.105 16.1553C11.7388 15.7378 11.2993 15.54 10.7134 15.54C9.65137 15.54 8.86768 16.3164 8.86768 17.3491C8.86768 17.8252 8.99219 18.1914 9.39502 18.6455L13.1523 22.8862C13.5698 23.355 14.0825 23.5601 14.7197 23.5601Z"
                    fill="white"
                  />
                </svg>
              )}
            </span>

            <div className={styles.upgrade_right}>
              <p className={styles.upgrade_top_text}>Authorize ETH</p>
              <p className={styles.upgrade_bottom_text}>
                Enables ETH Transaction
              </p>
            </div>
          </div>
        </div>
      </Aux>
    );
  }

  // send-off the API request to mint the user's Level 0 wearable
  async function mintToken(tokenID) {
    setMinting(true);
    setButtonMessage('Minting Token...');

    const json = await Fetch.MINT_TOKEN(tokenID);

    if (json.status) {
      // update global state token authorizations
      const refresh = !state.refreshTokenAuth;

      dispatch({
        type: 'refresh_token_auth',
        data: refresh,
      });
    } else if (!json.status) {
      setButtonMessage('Token Minting Error');
      console.log(json.result);
    } else if (json.status === 'error') {
      setButtonMessage(json.result);
      console.log(json.result);
    }

    setMinting(false);
  }

  // Biconomy API meta-transaction. User must authorize WETH token contract to access their funds
  async function metaTransaction() {
    try {
      setClicked(true);
      console.log('authorize amount: ' + state.tokenAmounts.WETH_COST_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, state.tokenAmounts.WETH_COST_AMOUNT)
        .encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        6,
        functionSignature,
        tokenContract,
        state.userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
        setClicked(false);
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state token authorizations
        const refresh = !state.refreshTokenAuth;

        dispatch({
          type: 'refresh_token_auth',
          data: refresh,
        });

        setDone(true);
      }
    } catch (error) {
      console.log('WETH authorization error: ' + error);
      setClicked(false);
    }
  }

  return (
    <Modal
      className={styles.withdraw_modal}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      close
      trigger={
        itemLimitsArray[props.index][0] ? (
          <Button className={styles.open_button}>
            Mint New Wearable ({itemLimitsArray[props.index][0]}) ID:{' '}
            {itemLimitsArray[props.index][1]}
          </Button>
        ) : (
          <Button disabled className={styles.open_button}>
            Sold Out! ID: {itemLimitsArray[props.index][1]}
          </Button>
        )
      }
    >
      <div className={styles.close_icon} onClick={() => setOpen(false)}>
        <span className={styles.button_close}>
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.464355 9.65869C0.0952148 10.0344 0.0754395 10.7266 0.477539 11.1221C0.879639 11.5242 1.56519 11.511 1.94092 11.1353L5.65869 7.41748L9.36987 11.1287C9.75879 11.5242 10.4312 11.5176 10.8267 11.1155C11.2288 10.72 11.2288 10.0476 10.8398 9.65869L7.12866 5.94751L10.8398 2.22974C11.2288 1.84082 11.2288 1.16846 10.8267 0.772949C10.4312 0.37085 9.75879 0.37085 9.36987 0.759766L5.65869 4.47095L1.94092 0.753174C1.56519 0.384033 0.873047 0.364258 0.477539 0.766357C0.0820312 1.16846 0.0952148 1.854 0.464355 2.22974L4.18213 5.94751L0.464355 9.65869Z"
              fill="white"
            />
          </svg>
        </span>
      </div>

      <div
        style={{
          color: 'white',
          display: 'flex',
          justifyContent: 'center',
          textAlign: 'center',
        }}
      >
        <div className={styles.upgrade_container}>
          {approveWETH()}

          {!minting ? (
            authStatus ? (
              canPurchase ? (
                <Button
                  className={styles.proceed_button}
                  onClick={() => mintToken(itemLimitsArray[props.index][1])}
                >
                  {buttonMessage}
                </Button>
              ) : (
                <Button disabled className={styles.proceed_button}>
                  {buttonMessage}
                </Button>
              )
            ) : (
              <Button disabled className={styles.proceed_button}>
                {buttonMessage}
              </Button>
            )
          ) : (
            <Button disabled className={styles.proceed_button}>
              {buttonMessage}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalEthAuth;
