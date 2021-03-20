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
        const address = jsonInfo.address;
        const balancePLAY = jsonInfo.playBalance.toLocaleString();
        const count = jsonInfo.callCount;
        const email = '';
        const playersList = jsonInfo.playersList;

        const responseData = await Fetch.PLAYER_DATA(state.userAddress);
        const jsonData = await responseData.json();

        const totalDAI = (
          jsonData.DAI.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalMANA = (
          jsonData.MANA.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();
        const totalPLAY = (
          jsonData.PLAY.payout_player / Global.CONSTANTS.FACTOR
        ).toLocaleString();

        const data = [
          name,
          address,
          balancePLAY,
          count,
          email,
          playersList,
          totalDAI,
          totalMANA,
          totalPLAY,
        ];

        dispatch({
          type: 'user_info',
          data: data,
        });
      })();
    }
  }, [state.userAddress]);

  return null;
}

export default UserInfo;
