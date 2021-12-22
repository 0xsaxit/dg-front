import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../../store';
import { Biconomy } from '@biconomy/mexa';
import Web3 from 'web3';
import { Modal, Button } from 'semantic-ui-react';
import styles from './ModalIceAuth.module.scss';
import ABI_CHILD_TOKEN_ICE from '../../ABI/ABIChildTokenICE';
import MetaTx from '../../../common/MetaTx';
import Fetch from '../../../common/Fetch';
import Aux from '../../_Aux';
import Global from '../../Constants';
import MetamaskAction, { ActionLine } from 'components/common/MetamaskAction';
import ModalMintSuccess from '../ModalMintSuccess';
import { Loader } from 'semantic-ui-react';

const ModalIceAuth = props => {
  // dispatch user's treasury contract active status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [tokenContract, setTokenContract] = useState({});
  const [web3, setWeb3] = useState({});
  const [spenderAddress, setSpenderAddress] = useState('');
  const [authStatus, setAuthStatus] = useState(false);
  const [canPurchase, setCanPurchase] = useState(true);
  const [open, setOpen] = useState(false);
  const [openMintSuccess, setOpenMintSuccess] = useState(false);
  const [minting, setMinting] = useState(false);
  const [clickedAuthICE, setClickedAuthICE] = useState(false);
  const [clickedConfirm, setClickedConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [tickCount, setTickCount] = useState(0);
  const [intervalId, setIntervalId] = useState(0);
  const [mintStatus, setMintStatus] = useState({});
  const [biconomyReady, setBiconomyReady] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////
  // Update Open Modal Status
  useEffect(() => {
    if (Object.keys(mintStatus).length !== 0) {
      console.log('pooling status finished! ');
      clearInterval(intervalId);
      setIntervalId(0);

      completedMint(mintStatus);
    }
  }, [mintStatus]);

  useEffect(() => {
    const completeData = async () => {
      console.log('pooling timeout finished!');
      clearInterval(intervalId);
      setIntervalId(0);
      completedMint({}, true);
      setTickCount(0);
    };

    if (tickCount === Global.CONSTANTS.POOLING_LIMIT_COUNT && intervalId > 0) {
      completeData();
    }
  }, [tickCount]);

  useEffect(() => {
    setOpen(props.show);
  }, [props.show]);

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
        ABI_CHILD_TOKEN_ICE,
        Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE
      );

      setTokenContract(tokenContract);

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Approve ICE (wearables)');
          setBiconomyReady(true);
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // get WETH authorization status based on tokenAuths state object
  useEffect(() => {
    const authStatus = state.tokenAuths.ICE_AUTHORIZATION;
    setAuthStatus(authStatus);
  }, [state.tokenAuths]);

  useEffect(() => {
    const canPurchase = state.canPurchase;
    setCanPurchase(canPurchase);
  }, [state.canPurchase]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function approveICE() {
    return (
      <Aux>
        <div className={styles.header}>
          <p className={styles.header_text}>Mint Wearable</p>
        </div>

        <p className={styles.description}>
          To mint your wearable, confirm your purchase and sign the metamask
          transaction. We’ll cover the gas.
        </p>

        <div className={styles.upgrade_inner_container}>
          <MetamaskAction
            actionState={
              authStatus
                ? 'done'
                : !clickedAuthICE
                  ? 'initial'
                  : clickedAuthICE
                    ? 'clicked'
                    : null
            }
            disabled={true}
            primaryText="Authorize ICE"
            secondaryText="Enables ICE Transaction"
          />

          <ActionLine previousAction={authStatus ? 'done' : 'initial'} />

          <MetamaskAction
            actionState={
              !clickedConfirm ? 'initial' : clickedConfirm ? 'clicked' : null
            }
            disabled={true}
            primaryText="Confirm Purchase"
            secondaryText="Mint Wearable"
          />
        </div>
      </Aux>
    );
  }

  function showErrorCase() {
    return (
      <Aux>
        <div className={styles.error_text}>{errorText ? errorText : ''}</div>
      </Aux>
    );
  }

  async function fetchMintToken() {
    try {
      const json = await Fetch.MINT_TOKEN(props.itemID, props.address);
      console.log('pooling json: ', json);

      if (json.status) {
        setMintStatus(json);
      }
    } catch (error) {
      setErrorText('API Timeout');
      setLoading(false);
      setClickedConfirm(false);

      console.log(error); // API request timeout error
    }
  }

  // send-off the API request to mint the user's Level 1 wearable
  async function mintToken() {
    setErrorText(null);
    console.log('Minting NFT item ID: ' + props.itemID);
    setMinting(true);
    setLoading(true);
    setClickedConfirm(true);

    console.log('props.itemID', props.itemID);
    console.log('props.address', props.address);

    const intervalid = setInterval(() => {
      setTickCount(prevCount => prevCount + 1);
      fetchMintToken();
    }, Global.CONSTANTS.POOLING_TIME_OUT);

    setIntervalId(intervalid);
  }

  async function completedMint(json, timeout = false) {
    if (!timeout) {
      if (json.status) {
        // update global state token amounts
        const refresh1 = !state.refreshTokenAmounts;
        dispatch({
          type: 'refresh_token_amounts',
          data: refresh1,
        });

        // update global state wearables data
        const refresh2 = !state.refreshWearable;
        dispatch({
          type: 'refresh_wearable_items',
          data: refresh2,
        });

        // update global state wearable Inventory data
        const refresh3 = !state.refreshWearableInventory;
        dispatch({
          type: 'refresh_wearable_inventory_items',
          data: refresh3,
        });

        console.log('NFT minting successful');

        setOpenMintSuccess(true);
        setOpen(false);

        setLoading(false);
        setClickedConfirm(false);
        setErrorText(null);
        props.close();
      } else if (!json.status) {
        setErrorText('Token Minting Error');
        setLoading(false);
        setClickedConfirm(false);

        console.log('NFT minting error (a): ' + json.result);
      } else if (json.status === 'error') {
        setErrorText(json.result);
        setLoading(false);
        setClickedConfirm(false);

        console.log('NFT minting error (b): ' + json.result);
      }
    } else {
      setErrorText('Token Minting Error');
      setLoading(false);
      setClickedConfirm(false);
    }
    setMinting(false);
  }

  // Biconomy API meta-transaction. User must authorize WETH token contract to access their funds
  async function metaTransaction() {
    try {
      console.log('ICE authorization amount: ' + Global.CONSTANTS.MAX_AMOUNT);
      setClickedAuthEth(true);
      setLoading(true);
      setErrorText(null);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = tokenContract.methods
        .approve(spenderAddress, Global.CONSTANTS.MAX_AMOUNT)
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
        setErrorText('ICE Authorization failed, please try again');
        setClickedAuthEth(false);
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state token authorizations
        const refresh = !state.refreshTokenAuths;

        dispatch({
          type: 'refresh_token_auths',
          data: refresh,
        });
        setAuthStatus(true);
        setLoading(false);
      }
    } catch (error) {
      console.log('ICE authorization error: ' + error);
      setErrorText('ICE Authorization failed, please try again');

      setClickedAuthEth(false);
      setLoading(false);
    }
  }

  return (
    <Aux>
      <Modal
        className={styles.withdraw_modal}
        onClose={() => {
          setOpen(false);
          props.close();
        }}
        onOpen={() => setOpen(true)}
        open={open}
        close
      >
        <div className={styles.close_icon}>
          <span
            className={styles.button_close}
            onClick={() => {
              setOpen(false);
              props.back();
            }}
          >
            <svg
              width="10"
              height="15"
              viewBox="0 0 12 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.0107422 8.6543C0.0107422 9.11133 0.168945 9.48926 0.555664 9.8584L7.16504 16.3271C7.44629 16.6084 7.78027 16.7402 8.17578 16.7402C8.99316 16.7402 9.65234 16.0811 9.65234 15.2812C9.65234 14.8682 9.48535 14.499 9.17773 14.2002L3.44727 8.64551L9.17773 3.1084C9.48535 2.80078 9.65234 2.43164 9.65234 2.02734C9.65234 1.22754 8.99316 0.568359 8.17578 0.568359C7.78027 0.568359 7.44629 0.708984 7.16504 0.981445L0.555664 7.4502C0.177734 7.81934 0.0107422 8.18848 0.0107422 8.6543Z"
                fill="white"
              />
            </svg>
          </span>
        </div>

        <a href="https://decentral.games/discord" target="_blank">
          <div className={styles.help_icon}>
            <span className={styles.discord_svg}>
              <svg
                width="22"
                height="20"
                viewBox="0 0 22 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="22" height="20" fill="url(#pattern0)" />
                <defs>
                  <pattern
                    id="pattern0"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      href="#image0"
                      transform="translate(0.0965909) scale(0.00378788 0.00416667)"
                    />
                  </pattern>
                  <image
                    id="image0"
                    width="213"
                    height="240"
                    href="data:image/png;base64,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"
                  />
                </defs>
              </svg>
            </span>

            <p className={styles.help_text}>Help</p>
          </div>
        </a>

        <div
          style={{
            color: 'white',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <div className={styles.upgrade_container}>
            {approveICE()}

            {!minting ? (
              canPurchase ? (
                <Button
                  className={styles.proceed_button}
                  onClick={() => {
                    if (!authStatus) {
                      metaTransaction();
                    } else {
                      mintToken();
                    }
                  }}
                >
                  <img src="https://res.cloudinary.com/dnzambf4m/image/upload/c_scale,w_210,q_auto:good/v1620331579/metamask-fox_szuois.png" />
                  {loading ? (
                    <Loader />
                  ) : authStatus ? (
                    'Confirm Purchase'
                  ) : biconomyReady ? (
                    'Authorize ICE'
                  ) : (
                    'Biconomy Initializing'
                  )}
                </Button>
              ) : (
                <Button disabled className={styles.proceed_button}>
                  Cooldown Period
                </Button>
              )
            ) : (
              <Button disabled className={styles.proceed_button}>
                {loading ? <Loader /> : 'Confirm Purchase'}
              </Button>
            )}

            {showErrorCase()}
          </div>
        </div>
      </Modal>

      <ModalMintSuccess
        wearableImg={props.wearableImg}
        show={openMintSuccess}
        maxMintCounts={props.maxMintCounts}
        numberLeft={props.numberLeft}
        close={() => {
          setOpenMintSuccess(false);
        }}
      />
    </Aux>
  );
};

export default ModalIceAuth;
