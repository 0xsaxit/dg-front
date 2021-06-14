import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Web3 from 'web3';
import Transactions from '../common/Transactions';
import Fetch from '../common/Fetch';
import Global from '../components/Constants';

function PricesBreakdown() {
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        try {
          const manaRes = await Fetch.MANA_PRICE();
          const manaJson = await manaRes.json();
          const priceMANA = manaJson.market_data.current_price.usd;

          const atriRes = await Fetch.ATRI_PRICE();
          const atriJson = await atriRes.json();
          const priceATRI = atriJson.market_data.current_price.usd;

          const ethRes = await Fetch.ETH_PRICE();
          const ethJson = await ethRes.json();
          const priceETH = ethJson.market_data.current_price.usd;

          dispatch({
            type: 'dg_prices',
            data: {
              mana: priceMANA,
              atri: priceATRI,
              eth: priceETH,
              dai: 1,
              usdt: 1,
            },
          });
        } catch (error) {
          console.log('Get prices error', error);
        }
      })();
    }
  }, [state.userStatus]);

  // this is for affiliates
  useEffect(() => {
    if (state.userStatus >= 4) {
      const maticWeb3 = new Web3(Global.CONSTANTS.MATIC_URL); // pass Matic provider URL to Web3 constructor

      (async () => {
        const pointerContractNew = await Transactions.pointerContractNew(
          maticWeb3
        );
        const atri = await pointerContractNew.methods
          .pointsBalancer(
            state.userAddress,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_ATRI
          )
          .call();

        const usdt = await pointerContractNew.methods
          .pointsBalancer(
            state.userAddress,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_USDT
          )
          .call();

        const mana = await pointerContractNew.methods
          .pointsBalancer(
            state.userAddress,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_MANA
          )
          .call();

        const dai = await pointerContractNew.methods
          .pointsBalancer(
            state.userAddress,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_DAI
          )
          .call();

        const eth = await pointerContractNew.methods
          .pointsBalancer(
            state.userAddress,
            Global.ADDRESSES.CHILD_TOKEN_ADDRESS_WETH
          )
          .call();

        dispatch({
          type: 'dg_breakdown',
          data: {
            mana: mana / Global.CONSTANTS.FACTOR,
            atri: atri / Global.CONSTANTS.FACTOR,
            eth: eth / Global.CONSTANTS.FACTOR,
            dai: dai / Global.CONSTANTS.FACTOR,
            usdt: usdt / Global.CONSTANTS.FACTOR,
          },
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default PricesBreakdown;