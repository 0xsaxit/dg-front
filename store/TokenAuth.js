import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_CHILD_TOKEN_ICE from '../components/ABI/ABIChildTokenICE';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function TokenAuth() {
  // dispatch user's token authorization status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGMaticContract, setDGMaticContract] = useState({});
  // const [ICEMaticContract, setICEMaticContract] = useState({});
  const [instances, setInstances] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const DGMaticContract = new maticWeb3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG
        );
        setDGMaticContract(DGMaticContract);

        // const ICEMaticContract = new maticWeb3.eth.Contract(
        //   ABI_CHILD_TOKEN_ICE,
        //   Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE
        // );
        // setICEMaticContract(ICEMaticContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(() => {
    if (instances) {
      (async function () {
        // update global state token authorization status
        const tokenAuthorizations = await getTokenAuthorizations();

        dispatch({
          type: 'token_authorizations',
          data: tokenAuthorizations,
        });
      })();
    }
  }, [instances]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function getTokenAuthorizations() {
    try {
      const DG_AUTHORIZATION = await Transactions.tokenAuthorization(
        DGMaticContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      //   const ICE_AUTHORIZATION = await Transactions.tokenAuthorization(
      //     ICEMaticContract,
      //     state.userAddress
      //   );

      // console.log('get token authorization: DG: ' + DG_AUTHORIZATION);
      // console.log('get token authorization: ICE: ' +  ICE_AUTHORIZATION)

      return {
        DG_AUTHORIZATION: DG_AUTHORIZATION,
        // ICE_AUTHORIZATION: ICE_AUTHORIZATION,
      };
    } catch (error) {
      console.log('Tokens get authorization error: ' + error);
    }
  }

  return null;
}

export default TokenAuth;
