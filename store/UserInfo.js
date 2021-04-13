import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';
import Global from '../components/Constants';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get user's play name, wallet address, MANA balance, email address, players list, and token totals
  useEffect(() => {
    if (state.userAddress) {
      (async function () {
        const responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
        const jsonInfo = await responseInfo.json();

        const name = jsonInfo.avatarName;

        // const address = jsonInfo.address;
        const index = ''; // jsonInfo.id/

        const balancePLAY = jsonInfo.playBalance.toLocaleString();
        const count = jsonInfo.callCount;
        const email = '';
        const playersList = jsonInfo.playersList;
        const tokenArray = jsonInfo.tokenArray;
        const responseData = await Fetch.PLAYER_DATA(state.userAddress);
        const jsonData = await responseData.json();

        const totalPLAY = (
          jsonData.PLAY.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalDAI = (
          jsonData.DAI.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalMANA = (
          jsonData.MANA.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalUSDT = (
          jsonData.USDT.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalATRI = (
          jsonData.ATRI.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalWETH = (
          jsonData.WETH.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();

        const data = {
          name: name,
          // address,
          index: index,
          balancePLAY: balancePLAY,
          count: count,
          email: email,
          playersList: playersList,
          totalPLAY: totalPLAY,
          totalDAI: totalDAI,
          totalMANA: totalMANA,
          totalUSDT: totalUSDT,
          totalATRI: totalATRI,
          totalWETH: totalWETH,
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
