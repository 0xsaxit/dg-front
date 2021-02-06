import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // get user's play name, wallet address, avatar balance, and email address
  useEffect(() => {
    if (state.userAddress) {
      (async function () {
        const responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
        const json = await responseInfo.json();

        const name = json.avatarName;
        const address = json.address;
        const balance = json.playBalance.toLocaleString();
        const count = json.callCount;
        const email = '';

        const responseAvatar = await Fetch.AVATAR_IMAGE(state.userAddress);
        const jsonAvatar = await responseAvatar.json();

        const avatar = jsonAvatar.avatars[0].avatar.snapshots.face;

        const response = [name, address, balance, count, email, avatar];

        dispatch({
          type: 'user_info',
          data: response,
        });
      })();
    }
  }, [state.userAddress]);

  return null;
}

export default UserInfo;
