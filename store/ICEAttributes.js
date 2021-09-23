import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_ICE_REGISTRANT from '../components/ABI/ABIICERegistrant.json';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_CHILD_TOKEN_WETH from '../components/ABI/ABIChildTokenWETH';
import ABI_CHILD_TOKEN_ICE from '../components/ABI/ABIChildTokenICE';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
import ABI_COLLECTION_V2 from '../components/ABI/ABICollectionV2';
import Fetch from '../common/Fetch';

function ICEAttributes() {
  // dispatch user's token authorization status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [ICERegistrantContract, setICERegistrantContract] = useState({});
  const [DGMaticContract, setDGMaticContract] = useState({});
  const [WETHMaticContract, setWETHMaticContract] = useState({});
  // const [ICEMaticContract, setICEMaticContract] = useState({});
  const [instances, setInstances] = useState(false);

  // const [collectionV2Contract, setCollectionV2Contract] = useState({});

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
        
        const CollectionV2Contract = new maticWeb3.eth.Contract(
          ABI_COLLECTION_V2,
          Global.ADDRESSES.COLLECTION_V2_ADDRESS
        );
        // setCollectionV2Contract(CollectionV2Contract);        
        fetchTokenOfOwnerByIndex(CollectionV2Contract);

        // const ICEMaticContract = new maticWeb3.eth.Contract(
        //   ABI_CHILD_TOKEN_ICE,
        //   Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE
        // );
        // setICEMaticContract(ICEMaticContract);

        setInstances(true); // contract instantiation complete
      }

      async function fetchTokenOfOwnerByIndex(collectionV2Contract){      
        const nLen = Object.keys(collectionV2Contract).length;
        const tokenURIs = [];

        if(nLen > 0) {
          const userWalletAddress = '0x7146cae915f1Cd90871ecc69999BEfFdcaf38ff9'; //hard coded, should be replaced with actual.

          try {
            for(let nIndex = 1; nIndex < 10; nIndex ++ ){
              const tokenURI = await collectionV2Contract.methods.tokenOfOwnerByIndex(userWalletAddress, nIndex).call();
              // console.log("tokenURI: =>", tokenURI);

              if(parseInt(tokenURI) > 100) {
                tokenURIs.push({index: nIndex, tokenUri: tokenURI})
              }              
            }
          } catch(error) {
            console.log("stack error: =>", error.message);
          }

          // console.log("tokenURIs: =>", tokenURIs);

          const iceWearableItems = await Promise.all(tokenURIs.map(async item => {
            const meta_json = await Fetch.GET_METADATA_FROM_TOKEN_URI(Global.ADDRESSES.COLLECTION_V2_ADDRESS, item.tokenUri);
            return {
              index: item.index,
              tokenUri: item.tokenUri,
              meta_data: meta_json
            }
          }))

          console.log("ice_meta_data: =>", iceWearableItems);
          dispatch({
            type: 'ice_wearable_items',
            data: iceWearableItems,
          });
          
        }
      }

      fetchData();
      // fetchTokenOfOwnerByIndex();
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

        // get the user's one-hour cool-down status
        const canPurchase = await getCoolDownStatus();
        console.log("canPurchase: ", canPurchase);

        dispatch({
          type: 'can_purchase',
          data: canPurchase,
        });

        // update global state token amounts/authorization status
        const tokenAmounts = await getTokenAmounts();
        console.log("tokenAmounts: ", tokenAmounts);

        dispatch({
          type: 'token_amounts',
          data: tokenAmounts,
        });
        console.log("instances completed!");

      })();
    }
  }, [instances, state.refreshTokenAuth]);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  async function getItemLimits() {
    try {
      const ITEM_LIMIT_0 = await ICERegistrantContract.methods.limits(0).call();
      const ITEM_LIMIT_5 = await ICERegistrantContract.methods.limits(5).call();
      const ITEM_LIMIT_10 = await ICERegistrantContract.methods
        .limits(10)
        .call();
      const ITEM_LIMIT_15 = await ICERegistrantContract.methods
        .limits(15)
        .call();
      const ITEM_LIMIT_20 = await ICERegistrantContract.methods
        .limits(20)
        .call();

      console.log('Item limit (0): ' + ITEM_LIMIT_0);
      console.log('Item limit (5): ' + ITEM_LIMIT_5);
      console.log('Item limit (10): ' + ITEM_LIMIT_10);
      console.log('Item limit (15): ' + ITEM_LIMIT_15);
      console.log('Item limit (20): ' + ITEM_LIMIT_20);

      return [
        [parseInt(ITEM_LIMIT_0), 0],
        [parseInt(ITEM_LIMIT_5), 5],
        [parseInt(ITEM_LIMIT_10), 10],
        [parseInt(ITEM_LIMIT_15), 15],
        [parseInt(ITEM_LIMIT_20), 20],
      ];
    } catch (error) {
      console.log('Get item limits error: ' + error);
    }
  }

  async function getCoolDownStatus() {
    try {
      const canPurchase = await ICERegistrantContract.methods
        .canPurchaseAgain(state.userAddress)
        .call();

      console.log('User allow purchase status: ' + canPurchase);

      return canPurchase;
    } catch (error) {
      console.log('Get user allow purchase status error: ' + error);
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
      console.log('Get token amounts error: ' + error);
    }
  }

  return null;
}

export default ICEAttributes;
