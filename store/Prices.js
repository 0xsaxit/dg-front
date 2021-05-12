import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function DGPrices() {
  const [state, dispatch] = useContext(GlobalContext);

	useEffect(() => {
    async function fetchData () {
      try {
				let manaRes = await Fetch.MANA_PRICE();
				let manaJson = await manaRes.json();
				const priceMANA = manaJson.market_data.current_price.usd;

				let atriRes = await Fetch.ATRI_PRICE();
				let atriJson = await atriRes.json();

				const priceATRI = atriJson.market_data.current_price.usd;

				let ethRes = await Fetch.ETH_PRICE();
				let ethJson = await ethRes.json();

				const priceETH = ethJson.market_data.current_price.usd;

				dispatch({
					type: 'dg_prices',
					data: {
						mana: priceMANA,
						atri: priceATRI,
						eth: priceETH,
						dai: 1,
						usdt: 1
					}
				});

      } catch (error) {
        console.log('Get price error', error);
      }
    };

    fetchData();
  }, []);

	return null;
}

export default DGPrices;
