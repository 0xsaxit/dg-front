import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../../store';
import Biconomy from '@biconomy/mexa';
import Web3 from 'web3';
import { Divider } from 'semantic-ui-react';
import Spinner from '../Spinner';
import ButtonAffiliates from '../button/ButtonAffiliates';
import ABI_DG_POINTER from '../ABI/ABIDGPointer';
import Global from '../Constants';
import MetaTx from '../../common/MetaTx';
import ContentFarming from '../content/ContentFarming';

const Farming = () => {
  // dispatch user's unclaimed DG balance from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGstate, setDGState] = useState('mining');
  const [isLoading, setIsLoading] = useState(true);
  const [pointerContract, setPointerContract] = useState({});
  const [userAddress, setUserAddress] = useState({});
  const [web3, setWeb3] = useState({});

  useEffect(() => {
    if (document.readyState === 'complete') {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (state.userStatus) {
      const userAddress = window.web3.currentProvider.selectedAddress;
      setUserAddress(userAddress);

      // initialize Web3 providers and create token contract instance
      const web3 = new Web3(window.ethereum); // pass MetaMask provider to Web3 constructor
      setWeb3(web3);

      const biconomy = new Biconomy(
        new Web3.providers.HttpProvider(Global.CONSTANTS.MATIC_URL),
        {
          apiKey: Global.KEYS.BICONOMY_API,
          debug: true,
        }
      );
      const getWeb3 = new Web3(biconomy); // pass Biconomy object to Web3 constructor

      (async function () {
        const addresses = await Global.API_ADDRESSES;

        const pointerContract = new getWeb3.eth.Contract(
          ABI_DG_POINTER,
          addresses.DG_POINTER_ADDRESS
        );

        setPointerContract(pointerContract);
      })();

      biconomy
        .onEvent(biconomy.READY, () => {
          console.log('Mexa is Ready: Active Status');
        })
        .onEvent(biconomy.ERROR, (error, message) => {
          console.error(error);
        });
    }
  }, [state.userStatus]);

  // Biconomy API meta-transaction. Dispatch DG tokens to player
  async function metaTransaction() {
    try {
      console.log('Dispatching DG tokens to address: ' + userAddress);

      // get function signature and send Biconomy API meta-transaction
      let functionSignature = pointerContract.methods.getMyTokens().encodeABI();

      const txHash = await MetaTx.executeMetaTransaction(
        2,
        functionSignature,
        '',
        pointerContract,
        userAddress,
        web3
      );

      if (txHash === false) {
        console.log('Biconomy meta-transaction failed');
      } else {
        console.log('Biconomy meta-transaction hash: ' + txHash);

        // update global state unclaimed DG balance to 0
        dispatch({
          type: 'dg_points',
          data: 0,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  // helper functions
  function submenu() {
    return (
      <div className="account-other-tabs">
        <span className="dg-tabs-desktop">
          <p className="account-other-p">
            {DGstate === 'mining' ? (
              <b className="account-hover active">GAMEPLAY MINING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('mining')}
              >
                GAMEPLAY MINING
              </abbr>
            )}

            {DGstate === 'liquidity' ? (
              <b className="account-hover active">LIQUIDITY FARMING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('liquidity')}
              >
                LIQUIDITY FARMING
              </abbr>
            )}

            {DGstate === 'governance' ? (
              <b className="account-hover active">GOVERNANCE</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('governance')}
              >
                GOVERNANCE
              </abbr>
            )}
          </p>

          <ButtonAffiliates />
        </span>

        <span className="dg-tabs-mobile">
          <p className="account-other-p">
            {DGstate === 'mining' ? (
              <b className="account-hover active">MINING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('mining')}
              >
                MINING
              </abbr>
            )}

            {DGstate === 'liquidity' ? (
              <b className="account-hover active">FARMING</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('liquidity')}
              >
                FARMING
              </abbr>
            )}

            {DGstate === 'governance' ? (
              <b className="account-hover active">GOV</b>
            ) : (
              <abbr
                className="account-hover"
                onClick={() => setDGState('governance')}
              >
                GOV
              </abbr>
            )}
          </p>

          <ButtonAffiliates />
        </span>
      </div>
    );
  }

  return (
    <div className="main-container">
      {isLoading ? <Spinner background={3} /> : null}

      <div className="page-container">
        <div className="account-other-inner-container ">
          {submenu()}

          <Divider style={{ marginTop: '18px', paddingBottom: '21px' }} />

          <ContentFarming content={DGstate} metaTransaction={metaTransaction} />
        </div>
      </div>
    </div>
  );
};

export default Farming;
