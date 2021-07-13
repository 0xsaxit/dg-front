import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';
import Global from '../components/Constants';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [manaPrice, setManaPrice] = useState(0);
  const [ethPrice, setEthPrice] = useState(0);
  const [atriPrice, setAtriPrice] = useState(0);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    (async function () {
      // get coin prices
      let response = await Fetch.MANA_PRICE();
      let json = await response.json();
      setManaPrice(json.market_data.current_price.usd);

      let response2 = await Fetch.ETH_PRICE();
      let json2 = await response2.json();
      setEthPrice(json2.market_data.current_price.usd);

      let response3 = await Fetch.ATRI_PRICE();
      let json3 = await response3.json();
      setAtriPrice(json3.market_data.current_price.usd);

    })()
  }, [manaPrice, ethPrice, atriPrice]);

  // get user's play name, wallet address, MANA balance, email address, players list, and token totals
  useEffect(() => {
    if (state.userAddress) {
      (async function () {
        const responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
        const jsonInfo = await responseInfo.json();

        const name = jsonInfo.avatarName;
        const id = jsonInfo._id.slice(-6);
        const balancePLAY = jsonInfo.playBalance.toLocaleString();
        const count = jsonInfo.callCount;
        const email = '';
        const playersList = jsonInfo.playersList;
        const tokenArray = jsonInfo.tokenArray;
        const responseData = await Fetch.PLAYER_DATA(state.userAddress);
        const jsonData = await responseData.json();

        const data = {
          name: name,
          id: id,
          balancePLAY: balancePLAY,
          count: count,
          email: email,
          playersList: playersList,
          tokenArray: tokenArray,
        };

        dispatch({
          type: 'user_info',
          data: data,
        });
      })();
    }
  }, [state.userAddress, state.updateInfo]);

  return null;
}

export default UserInfo;
