import { useEffect, useContext } from 'react';
import { GlobalContext } from '../store';
import Global from './Constants';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  let userAddress = '';

  useEffect(() => {
    if (state.userStatus) {
      userAddress = window.web3.currentProvider.selectedAddress;

      // get user's play name, wallet address, and avatar balance
      (async function () {
        let responseInfo = await Global.FETCH.PLAYER_INFO(userAddress);
        let json = await responseInfo.json();

        const avatarName = json.avatarName;
        const avatarAddress = json.address;
        const avatarBalance = json.playBalance;

        const response = [avatarName, avatarAddress, avatarBalance];

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
