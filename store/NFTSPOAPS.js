import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function NFTSPOAPS() {
  // dispatch treasury balances to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get user nfts statistics
  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        let json = await Fetch.NFTS_1(state.userAddress);

        let json_2 = await Fetch.NFTS_2(state.userAddress);

        let wearables = [];
        let i;
        for (i = 0; i < json.assets.length; i++) {
          wearables.push(json.assets[i]);
        }
        let j;
        for (j = 0; j < json_2.assets.length; j++) {
          wearables.push(json_2.assets[j]);
        }

        dispatch({
          type: 'wearables',
          data: wearables,
        });
      })();
    }
  }, [state.userStatus]);

  // get user poaps
  useEffect(() => {
    if (state.userStatus >= 4) {
      (async () => {
        let json_1 = await Fetch.POAPS(state.userAddress);

        let poaps = [];
        let k;
        for (k = 0; k < json_1.length; k++) {
          if (json_1[k].event.name.includes('Decentral Games') 
            || json_1[k].event.name.includes('BAYC')) {
            poaps.push(json_1[k].event);
          }
        }

        dispatch({
          type: 'poaps',
          data: poaps,
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default NFTSPOAPS;
