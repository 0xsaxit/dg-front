import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_ICE_REGISTRANT from '../components/ABI/ABIICERegistrant.json';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_CHILD_TOKEN_WETH from '../components/ABI/ABIChildTokenWETH';
import ABI_CHILD_TOKEN_ICE from '../components/ABI/ABIChildTokenICE';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';

function ICEAttributes() {
  // dispatch user's token authorization status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [ICERegistrantContract, setICERegistrantContract] = useState({});
  const [DGMaticContract, setDGMaticContract] = useState({});
  const [WETHMaticContract, setWETHMaticContract] = useState({});
  // const [ICEMaticContract, setICEMaticContract] = useState({});
  const [instances, setInstances] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (state.userStatus >= 4) {
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const ICERegistrantContract = new maticWeb3.eth.Contract(
          ABI_ICE_REGISTRANT,
          Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
        );
        setICERegistrantContract(ICERegistrantContract);

        const DGMaticContract = new maticWeb3.eth.Contract(
          ABI_DG_TOKEN,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG
        );
        setDGMaticContract(DGMaticContract);

        const WETHMaticContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_WETH,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
        );
        setWETHMaticContract(WETHMaticContract);

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

  // anytime user authorizes tokens on /ice pages this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        // update global state wearables limit amounts
        const itemLimits = await getItemLimits();

        dispatch({
          type: 'item_limits',
          data: itemLimits,
        });

        // update global state token amounts/authorization status
        const tokenAmounts = await getTokenAmounts();

        dispatch({
          type: 'token_amounts',
          data: tokenAmounts,
        });
      })();
    }
  }, [instances, state.refreshTokenAuth]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function getItemLimits() {
    try {
      const ITEM_LIMIT_0 = await ICERegistrantContract.methods.limits(0).call();
      const ITEM_LIMIT_1 = await ICERegistrantContract.methods.limits(1).call();
      const ITEM_LIMIT_2 = await ICERegistrantContract.methods.limits(2).call();
      const ITEM_LIMIT_3 = await ICERegistrantContract.methods.limits(3).call();
      const ITEM_LIMIT_4 = await ICERegistrantContract.methods.limits(4).call();

      console.log('Item limit (0): ' + ITEM_LIMIT_0);
      console.log('Item limit (1): ' + ITEM_LIMIT_1);
      console.log('Item limit (2): ' + ITEM_LIMIT_2);
      console.log('Item limit (3): ' + ITEM_LIMIT_3);
      console.log('Item limit (4): ' + ITEM_LIMIT_4);

      return {
        ITEM_LIMIT_0: parseInt(ITEM_LIMIT_0),
        ITEM_LIMIT_1: parseInt(ITEM_LIMIT_1),
        ITEM_LIMIT_2: parseInt(ITEM_LIMIT_2),
        ITEM_LIMIT_3: parseInt(ITEM_LIMIT_3),
        ITEM_LIMIT_4: parseInt(ITEM_LIMIT_4),
      };
    } catch (error) {
      console.log('Items get limits error: ' + error);
    }
  }

  async function getTokenAmounts() {
    try {
      const WETH_COST_AMOUNT = await ICERegistrantContract.methods
        .mintingPrice()
        .call();

      // const DG_COST_AMOUNT = await ICERegistrantContract.methods
      //   .levels()
      //   .call();

      //   const DG_MOVE_AMOUNT = await ICERegistrantContract.methods
      //   .levels()
      //   .call();

      //   const ICE_COST_AMOUNT = await ICERegistrantContract.methods
      //   .levels()
      //   .call();

      //   const ICE_MOVE_AMOUNT = await ICERegistrantContract.methods
      //   .levels()
      //   .call();

      const DG_AUTHORIZATION = await Transactions.tokenAuthorization(
        DGMaticContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      const WETH_AUTHORIZATION = await Transactions.tokenAuthorization(
        WETHMaticContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      // const ICE_AUTHORIZATION = await Transactions.tokenAuthorization(
      // ICEMaticContract,
      // state.userAddress,
      // Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      // );

      console.log('Get token authorization: DG: ' + DG_AUTHORIZATION);
      console.log('Get token authorization: WETH: ' + WETH_AUTHORIZATION);
      // console.log('Get token authorization: ICE: ' + ICE_AUTHORIZATION);

      return {
        WETH_COST_AMOUNT: WETH_COST_AMOUNT,
        // DG_COST_AMOUNT: DG_COST_AMOUNT,
        // DG_MOVE_AMOUNT: DG_MOVE_AMOUNT,
        // ICE_COST_AMOUNT: ICE_COST_AMOUNT,
        // ICE_MOVE_AMOUNT: ICE_MOVE_AMOUNT,
        DG_AUTHORIZATION: DG_AUTHORIZATION,
        WETH_AUTHORIZATION: WETH_AUTHORIZATION,
        // ICE_AUTHORIZATION: ICE_AUTHORIZATION,
      };
    } catch (error) {
      console.log('Tokens get amounts error: ' + error);
    }
  }

  return null;
}

export default ICEAttributes;
