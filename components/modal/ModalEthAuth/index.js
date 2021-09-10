import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../store';
import Biconomy from '@biconomy/mexa';
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
  const [open, setOpen] = useState(false);
  const [minting, setMinting] = useState(false);
  const [buttonMessage, setButtonMessage] = useState('Proceed to Mint');

  let authorizationStatus = 'false';

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
    if (state.tokenAuthorizations.WETH_AUTHORIZATION === true) {
      authorizationStatus = 'True';
    } else {
      authorizationStatus = 'False';
    }

    setAuthStatus(authorizationStatus);
  }, [state.tokenAuthorizations]);

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
          {Global.CONSTANTS.WEARABLE_AMOUNT / Global.CONSTANTS.FACTOR} ETH
        </p>

        <p className={styles.description}>
          ETH authorization status: {authStatus}
        </p>

        <div className={styles.upgrade_inner_container}>
          <div className={styles.upgrade_area}>
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

            {authStatus ? (
              <Button className={styles.enabled_button} disabled>
                Enable ETH
              </Button>
            ) : (
              <Button
                className={styles.enabled_button}
                onClick={() => metaTransaction()}
              >
                Enable ETH
              </Button>
            )}

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

  async function mintToken() {
    setMinting(true);
    setButtonMessage('Minting Token...');

    const json = await Fetch.MINT_TOKEN();

    // console.log('return data...');
    // console.log(json);

    if (json.status) {
      // update global state token authorizations
      const refresh = !state.refreshTokenAuth;

      dispatch({
        type: 'refresh_token_auth',
        data: refresh,
      });

      setButtonMessage('Proceed to Mint');
    } else {
      setAuthStatus(false);
      setButtonMessage('Token Minting Error');
    }

    setMinting(false);
  }

  // Biconomy API meta-transaction. User must authorize WETH token contract to access their funds
  async function metaTransaction() {
    try {
      console.log('authorize amount: ' + Global.CONSTANTS.WEARABLE_AMOUNT);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.CONSTANTS.WEARABLE_AMOUNT)
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
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state token authorizations
        const refresh = !state.refreshTokenAuth;

        dispatch({
          type: 'refresh_token_auth',
          data: refresh,
        });
      }
    } catch (error) {
      console.log('WETH authorization error: ' + error);
    }
  }

  return (
    <>
      <Modal
        className={styles.withdraw_modal}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        close
        trigger={<Button className={styles.open_button}>Mint</Button>}
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
                <Button
                  className={styles.proceed_button}
                  onClick={() => mintToken()}
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
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalEthAuth;
