import { useEffect, useContext } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  useEffect(() => {
    if (state.userStatus >= 4) {
      // get user's play name, wallet address, and avatar balance
      (async function () {
        let responseInfo = await Fetch.PLAYER_INFO(state.userAddress);
        let json = await responseInfo.json();

        const name = json.avatarName;
        const address = json.address;
        const balance = json.playBalance.toLocaleString();
        const count = json.callCount;

        const response = [name, address, balance, count];

        dispatch({
          type: 'user_info',
          data: response,
        });

        // send identity data to Segment
        analytics.identify(address, {
          name: name,
          balance: balance,
        });
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default UserInfo;
