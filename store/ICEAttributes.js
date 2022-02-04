import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import ABI_ICE_REGISTRANT from '../components/ABI/ABIICERegistrant.json';
import ABI_DG_TOKEN from '../components/ABI/ABIDGToken';
import ABI_DG_LIGHT_TOKEN from '../components/ABI/ABIDGLightToken';
import ABI_CHILD_TOKEN_WETH from '../components/ABI/ABIChildTokenWETH';
import ABI_CHILD_TOKEN_ICE from '../components/ABI/ABIChildTokenICE';
import ABI_COLLECTION_V2 from '../components/ABI/ABICollectionV2';
import ABI_COLLECTION_PH from '../components/ABI/ABICollectionPH';
import ABI_COLLECTION_LINENS from '../components/ABI/ABICollectionLinens';
import ABI_COLLECTION_BOMBER from '../components/ABI/ABICollectionBomber';
import ABI_COLLECTION_CRYPTO_DRIP from '../components/ABI/ABICollectionCryptoDrip.json';
import ABI_COLLECTION_FOUNDER_FATHER from '../components/ABI/ABICollectionFounderFather.json';
import ABI_COLLECTION_JOKER from '../components/ABI/ABICollectionJoker.json';
import ABI_COLLECTION_CHEF from '../components/ABI/ABICollectionChef.json';
import ABI_COLLECTION_BEACH from '../components/ABI/ABICollectionBeach.json';
import ABI_COLLECTION_AIRLINE from '../components/ABI/ABICollectionAirline.json';
import ABI_ICEToken from '../components/ABI/ABIICEToken';
import Global from '../components/Constants';
import Transactions from '../common/Transactions';
import Fetch from '../common/Fetch';

function ICEAttributes() {
  // dispatch user's token authorization status to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [instances, setInstances] = useState(false);
  const [ICERegistrantContract, setICERegistrantContract] = useState({});
  const [DGMaticLightContract, setDGMaticLightContract] = useState({});
  const [WETHMaticContract, setWETHMaticContract] = useState({});
  const [ICEMaticContract, setICEMaticContract] = useState({});
  const [collectionArray, setCollectionArray] = useState([]);
  const [iceTokenContract, setIceTokenContract] = useState({});

  useEffect(() => {
    if (state.userStatus >= 4) {
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      async function fetchData() {
        const ICERegistrantContract = new maticWeb3.eth.Contract(
          ABI_ICE_REGISTRANT,
          Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
        );
        setICERegistrantContract(ICERegistrantContract);

        const DGMaticLightContract = new maticWeb3.eth.Contract(
          ABI_DG_LIGHT_TOKEN,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DG_LIGHT
        );
        setDGMaticLightContract(DGMaticLightContract);

        const WETHMaticContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_WETH,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
        );
        setWETHMaticContract(WETHMaticContract);

        const ICEMaticContract = new maticWeb3.eth.Contract(
          ABI_CHILD_TOKEN_ICE,
          Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ICE
        );
        setICEMaticContract(ICEMaticContract);

        const collectionV2Contract = new maticWeb3.eth.Contract(
          ABI_COLLECTION_V2,
          Global.ADDRESSES.COLLECTION_V2_ADDRESS
        );
        const collectionV2Contract2 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_PH,
          Global.ADDRESSES.COLLECTION_PH_ADDRESS
        );
        const collectionV2Contract3 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_LINENS,
          Global.ADDRESSES.COLLECTION_LINENS_ADDRESS
        );
        const collectionV2Contract4 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_BOMBER,
          Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS
        );
        const collectionV2Contract5 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_CRYPTO_DRIP,
          Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS
        );
        const collectionV2Contract6 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_FOUNDER_FATHER,
          Global.ADDRESSES.COLLECTION_FOUNDER_FATHERS_ADDRESS
        );
        const collectionV2Contract7 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_JOKER,
          Global.ADDRESSES.COLLECTION_JOKER_ADDRESS
        );
        const collectionV2Contract8 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_CHEF,
          Global.ADDRESSES.COLLECTION_CHEF_ADDRESS
        );
        const collectionV2Contract9 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_BEACH,
          Global.ADDRESSES.COLLECTION_BEACH_ADDRESS
        );
        const collectionV2Contract10 = new maticWeb3.eth.Contract(
          ABI_COLLECTION_AIRLINE,
          Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS
        );

        const collectionArray = [];
        collectionArray.push([
          collectionV2Contract,
          Global.ADDRESSES.COLLECTION_V2_ADDRESS,
          [20, 10, 5, 0, 15],
          // [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract2,
          Global.ADDRESSES.COLLECTION_PH_ADDRESS,
          [20, 15, 10, 5, 0],
          // [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract3,
          Global.ADDRESSES.COLLECTION_LINENS_ADDRESS,
          [5, 0, 17, 13, 21],
          // [0, 5, 17, 13, 21],
        ]);
        collectionArray.push([
          collectionV2Contract4,
          Global.ADDRESSES.COLLECTION_BOMBER_ADDRESS,
          [20, 12, 16, 2, 7]
          // [2, 12, 16, 20, 7],
        ]);
        collectionArray.push([
          collectionV2Contract5,
          Global.ADDRESSES.COLLECTION_CRYPTO_DRIP_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract6,
          Global.ADDRESSES.COLLECTION_FOUNDER_FATHERS_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract7,
          Global.ADDRESSES.COLLECTION_JOKER_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract8,
          Global.ADDRESSES.COLLECTION_CHEF_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract9,
          Global.ADDRESSES.COLLECTION_BEACH_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        collectionArray.push([
          collectionV2Contract10,
          Global.ADDRESSES.COLLECTION_AIRLINE_ADDRESS,
          [0, 5, 10, 15, 20],
        ]);
        setCollectionArray(collectionArray);

        const IceTokenContract = new maticWeb3.eth.Contract(
          ABI_ICEToken,
          Global.ADDRESSES.ICE_TOKEN_ADDRESS
        );
        setIceTokenContract(IceTokenContract);

        setInstances(true); // contract instantiation complete
      }

      fetchData();
    }
  }, [state.userStatus]);

  useEffect(async () => {
    if (instances) {
      const paymentTokenAddress = await ICERegistrantContract.methods.paymentToken().call();
      dispatch({
        type: 'current_mint_token',
        data: paymentTokenAddress.toLowerCase() === '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' ? 'ETH' : 'ICE'
      })
    }
  }, [instances])

  // anytime user mints/updates/activates an NFT this code will execute
  useEffect(() => {
    if (instances) {
      async function fetchData() {
        if (!state.iceWearableItems || state.iceWearableItems.length === 0) {
          dispatch({
            type: 'ice_wearable_items_loading',
            data: true,
          });
        }

        let iceWearableItems = await Fetch.GET_WEARABLE_INVENTORY(state.userAddress);
        iceWearableItems.sort((a, b) => { return a.tokenId - b.tokenId })

        for (var i = 0; i < iceWearableItems.length; i++) {

          const collectionContract = collectionArray.find(
            collection => collection[1].toLowerCase() === iceWearableItems[i].contractAddress.toLowerCase()
          )
          iceWearableItems[i].index = i;
          iceWearableItems[i].collection = collectionContract[0];
        }

        console.log('iceWearableItems: ', iceWearableItems);

        dispatch({
          type: 'ice_wearable_items',
          data: iceWearableItems,
        });
        dispatch({
          type: 'ice_wearable_items_loading',
          data: false,
        });
      }

      fetchData();
    }
  }, [instances, state.refreshWearable]);


  // anytime user undelegates an NFT this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        dispatch({
          type: 'ice_delegated_items_loading',
          data: true,
        });
        let iceDelegatedItems = [];

        const wearableInventory = await Fetch.GET_WEARABLE_INVENTORY(
          state.userAddress
        );

        wearableInventory.forEach((wearable, i) => {
          if (wearable.delegationStatus.delegatedTo === state.userAddress)
            iceDelegatedItems.push(wearable);
        });

        dispatch({
          type: 'ice_delegated_items',
          data: iceDelegatedItems,
        });
        dispatch({
          type: 'ice_delegated_items_loading',
          data: false,
        });
      })();
    }
  }, [instances, state.refreshDelegation]);

  // anytime user mints/upgrades/activates NFTs on /ice pages this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        // update global state wearables limit amounts for each collection
        const itemLimits10 = await getItemLimits(9);
        dispatch({
          type: 'item_limits_10',
          data: itemLimits10,
        });

        const itemLimits9 = await getItemLimits(8);
        dispatch({
          type: 'item_limits_9',
          data: itemLimits9,
        });

        const itemLimits8 = await getItemLimits(7);
        dispatch({
          type: 'item_limits_8',
          data: itemLimits8,
        });

        const itemLimits7 = await getItemLimits(6);
        dispatch({
          type: 'item_limits_7',
          data: itemLimits7,
        });

        const itemLimits6 = await getItemLimits(5);
        dispatch({
          type: 'item_limits_6',
          data: itemLimits6,
        });

        const itemLimits5 = await getItemLimits(4);
        dispatch({
          type: 'item_limits_5',
          data: itemLimits5,
        });

        const itemLimits4 = await getItemLimits(3);
        dispatch({
          type: 'item_limits_4',
          data: itemLimits4,
        });

        const itemLimits3 = await getItemLimits(2);
        dispatch({
          type: 'item_limits_3',
          data: itemLimits3,
        });

        const itemLimits2 = await getItemLimits(1);
        dispatch({
          type: 'item_limits_2',
          data: itemLimits2,
        });

        const itemLimits1 = await getItemLimits(0);
        dispatch({
          type: 'item_limits_1',
          data: itemLimits1,
        });

        // get the user's cool-down status
        console.log(' ==== <Before getCoolDownStatus> ====');
        const canPurchase = await getCoolDownStatus();
        console.log('==== <After canPurchase> ==== ', canPurchase);

        dispatch({
          type: 'can_purchase',
          data: canPurchase,
        });

        // update global state token amounts/authorization status
        const tokenAmounts = await getTokenAmounts();
        console.log('==== <tokenAmounts> ==== ', tokenAmounts);

        dispatch({
          type: 'token_amounts',
          data: tokenAmounts,
        });

        console.log('Token status updates completed!');
      })();
    }
  }, [instances, state.refreshTokenAmounts]);

  // anytime user claims ICE rewards this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        try {
          const iceAmounts = await getICEAmounts();
          iceAmounts.ICE_AVAILABLE_AMOUNT = parseInt(
            iceAmounts.ICE_AVAILABLE_AMOUNT
          );
          iceAmounts.ICE_CLAIM_AMOUNT = parseInt(iceAmounts.ICE_CLAIM_AMOUNT);

          dispatch({
            type: 'ice_amounts',
            data: iceAmounts,
          });

          console.log('ICE amount updates completed!');
        } catch (error) {
          console.log('ICE Amounts not found: ' + error);
        }
      })();
    }
  }, [instances, state.refreshBalances, state.refreshICEAmounts]);

  // anytime user authorizes tokens on /ice pages this code will execute
  useEffect(() => {
    if (instances) {
      (async function () {
        const tokenAuths = await getTokenAuthorizations();

        console.log(
          'Get token authorization: DG_Light: ' +
          tokenAuths.DG_LIGHT_AUTHORIZATION
        );
        console.log(
          'Get token authorization: ICE: ' + tokenAuths.ICE_AUTHORIZATION
        );
        console.log(
          'Get token authorization: WETH: ' + tokenAuths.WETH_AUTHORIZATION
        );

        dispatch({
          type: 'token_auths',
          data: tokenAuths,
        });

        console.log('Token authorizations updates completed!');
      })();
    }
  }, [instances, state.refreshTokenAuths]);

  // anytime user authorizes NFTs on /ice pages this code will execute
  useEffect(() => {
    if (instances && state.iceWearableItems.length) {
      (async function () {
        let authArray = [];

        state.iceWearableItems.map(async (item, i) => {
          try {
            const NFTAuthorization = await Transactions.NFTApproved(
              item.collection,
              item.tokenId
            );

            authArray.push({
              tokenId: item.tokenId,
              authStatus: NFTAuthorization,
              contractAddress: item.contractAddress,
            });
          } catch (error) {
            console.log('Get NFT approved error: ' + error);
          }
        });

        dispatch({
          type: 'nft_authorizations',
          data: authArray,
        });
      })();
    }
  }, [instances, state.iceWearableItems, state.refreshNFTAuths]);

  async function getItemLimits(index) {
    const collectionAddress = collectionArray[index][1];
    const tokenIdArray = collectionArray[index][2];
    let itemsArray = [];

    try {
      const itemObject0 = await collectionArray[index][0].methods
        .items(tokenIdArray[0])
        .call();
      const ITEM_LIMIT_0 = itemObject0[Object.keys(itemObject0)[2]];

      const itemObject5 = await collectionArray[index][0].methods
        .items(tokenIdArray[1])
        .call();
      const ITEM_LIMIT_5 = itemObject5[Object.keys(itemObject5)[2]];

      const itemObject10 = await collectionArray[index][0].methods
        .items(tokenIdArray[2])
        .call();
      const ITEM_LIMIT_10 = itemObject10[Object.keys(itemObject10)[2]];

      const itemObject15 = await collectionArray[index][0].methods
        .items(tokenIdArray[3])
        .call();
      const ITEM_LIMIT_15 = itemObject15[Object.keys(itemObject15)[2]];

      const itemObject20 = await collectionArray[index][0].methods
        .items(tokenIdArray[4])
        .call();
      const ITEM_LIMIT_20 = itemObject20[Object.keys(itemObject20)[2]];

      console.log(
        'Token ID: ' + tokenIdArray[0] + ', quantity: ' + parseInt(ITEM_LIMIT_0)
      );
      console.log(
        'Token ID: ' + tokenIdArray[1] + ', quantity: ' + parseInt(ITEM_LIMIT_5)
      );
      console.log(
        'Token ID: ' +
        tokenIdArray[2] +
        ', quantity: ' +
        parseInt(ITEM_LIMIT_10)
      );
      console.log(
        'Token ID: ' +
        tokenIdArray[3] +
        ', quantity: ' +
        parseInt(ITEM_LIMIT_15)
      );
      console.log(
        'Token ID: ' +
        tokenIdArray[4] +
        ', quantity: ' +
        parseInt(ITEM_LIMIT_20)
      );

      itemsArray.push(
        [parseInt(ITEM_LIMIT_0), tokenIdArray[0]],
        [parseInt(ITEM_LIMIT_5), tokenIdArray[1]],
        [parseInt(ITEM_LIMIT_10), tokenIdArray[2]],
        [parseInt(ITEM_LIMIT_15), tokenIdArray[3]],
        [parseInt(ITEM_LIMIT_20), tokenIdArray[4]],
        collectionAddress
      );

      return itemsArray;
    } catch (error) {
      console.log('Get item limits index: ' + index + ', error: ' + error);
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
      const wethConstAmount = await ICERegistrantContract.methods
        .mintingPrice()
        .call();
      const WETH_COST_AMOUNT = wethConstAmount / Global.CONSTANTS.FACTOR;

      const levelsData1 = await ICERegistrantContract.methods
        .levels('1')
        .call();
      const DG_MOVE_AMOUNT = levelsData1[2] / Global.CONSTANTS.FACTOR;

      const levelsData2 = await ICERegistrantContract.methods
        .levels('2')
        .call();

      const DG_COST_AMOUNT_2 = levelsData2[1] / Global.CONSTANTS.FACTOR;
      const ICE_COST_AMOUNT_2 = levelsData2[3] / Global.CONSTANTS.FACTOR;

      const levelsData3 = await ICERegistrantContract.methods
        .levels('3')
        .call();
      const DG_COST_AMOUNT_3 = levelsData3[1] / Global.CONSTANTS.FACTOR;
      const ICE_COST_AMOUNT_3 = levelsData3[3] / Global.CONSTANTS.FACTOR;

      const levelsData4 = await ICERegistrantContract.methods
        .levels('4')
        .call();
      const DG_COST_AMOUNT_4 = levelsData4[1] / Global.CONSTANTS.FACTOR;
      const ICE_COST_AMOUNT_4 = levelsData4[3] / Global.CONSTANTS.FACTOR;

      const levelsData5 = await ICERegistrantContract.methods
        .levels('5')
        .call();
      const DG_COST_AMOUNT_5 = levelsData5[1] / Global.CONSTANTS.FACTOR;
      const ICE_COST_AMOUNT_5 = levelsData5[3] / Global.CONSTANTS.FACTOR;

      const ICE_AMOUNT = await iceTokenContract.methods
        .balanceOf(state.userAddress)
        .call();
      const ICE_AMOUNT_ADJUSTED = (
        ICE_AMOUNT / Global.CONSTANTS.FACTOR
      ).toString();

      const { delegatorSplits, xpUpgradeCosts } = await Fetch.GET_REWARDS_CONFIG();
      delegatorSplits.map(delegatorSplit => {
        delegatorSplit = Number(delegatorSplit)
      })
      dispatch({
        type: 'delegator_splits',
        data: delegatorSplits,
      })

      return {
        WETH_COST_AMOUNT: WETH_COST_AMOUNT,
        DG_MOVE_AMOUNT: DG_MOVE_AMOUNT,
        DG_COST_AMOUNT_2: DG_COST_AMOUNT_2,
        ICE_COST_AMOUNT_2: ICE_COST_AMOUNT_2,
        DG_COST_AMOUNT_3: DG_COST_AMOUNT_3,
        ICE_COST_AMOUNT_3: ICE_COST_AMOUNT_3,
        DG_COST_AMOUNT_4: DG_COST_AMOUNT_4,
        ICE_COST_AMOUNT_4: ICE_COST_AMOUNT_4,
        DG_COST_AMOUNT_5: DG_COST_AMOUNT_5,
        ICE_COST_AMOUNT_5: ICE_COST_AMOUNT_5,
        XP_COST_AMOUNT_2: xpUpgradeCosts[0],
        XP_COST_AMOUNT_3: xpUpgradeCosts[1],
        XP_COST_AMOUNT_4: xpUpgradeCosts[2],
        XP_COST_AMOUNT_5: xpUpgradeCosts[3],
      };
    } catch (error) {
      console.log('Get token amounts error: ' + error);
    }
  }

  async function getICEAmounts() {
    try {
      const ICE_AVAILABLE_AMOUNT = await iceTokenContract.methods
        .balanceOf(state.userAddress)
        .call();
      const ICE_AMOUNT_ADJUSTED = (
        ICE_AVAILABLE_AMOUNT / Global.CONSTANTS.FACTOR
      ).toString();

      console.log('Available ICE amount: ' + ICE_AMOUNT_ADJUSTED);

      const json = await Fetch.CLAIM_REWARDS_AMOUNT();
      const ICE_CLAIM_AMOUNT = json.totalUnclaimedAmount;

      console.log('Claim ICE rewards amount: ' + json.totalUnclaimedAmount);

      return {
        ICE_AVAILABLE_AMOUNT: ICE_AMOUNT_ADJUSTED,
        ICE_CLAIM_AMOUNT: ICE_CLAIM_AMOUNT,
      };
    } catch (error) {
      console.log('Get ICE amounts error: ' + error);
    }
  }

  async function getTokenAuthorizations() {
    try {
      const DG_LIGHT_AUTHORIZATION = await Transactions.tokenAuthorization(
        DGMaticLightContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      const ICE_AUTHORIZATION = await Transactions.tokenAuthorization(
        ICEMaticContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      const WETH_AUTHORIZATION = await Transactions.tokenAuthorization(
        WETHMaticContract,
        state.userAddress,
        Global.ADDRESSES.ICE_REGISTRANT_ADDRESS
      );

      return {
        DG_LIGHT_AUTHORIZATION: DG_LIGHT_AUTHORIZATION,
        ICE_AUTHORIZATION: ICE_AUTHORIZATION,
        WETH_AUTHORIZATION: WETH_AUTHORIZATION,
      };
    } catch (error) {
      console.log('Get token authorizations error: ' + error);
    }
  }

  return null;
}

export default ICEAttributes;
