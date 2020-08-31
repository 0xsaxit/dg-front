import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userStatus >= 4) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // get user's play name, wallet address, and avatar balance
      (async function () {
        let responseInfo = await Global.FETCH.PLAYER_INFO(userAddress);
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
      })();
    }
  }, [state.userStatus]);

  return null;
}

export default UserInfo;
