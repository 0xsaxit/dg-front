import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from './index';
import Fetch from '../common/Fetch';

function UserInfo() {
  // dispatch user's information to the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGStaking, setDGStaking] = useState(0);
  const [DGMainchain, setDGMainchain] = useState(0);
  const [complete, setComplete] = useState(false);

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (
      state.stakingBalances.BALANCE_USER_GOVERNANCE &&
      state.DGBalances.BALANCE_ROOT_DG
    ) {
      const DGStaking = formatPrice(
        state.stakingBalances.BALANCE_USER_GOVERNANCE,
        3
      );
      const DGMainchain = formatPrice(state.DGBalances.BALANCE_ROOT_DG, 3);

      setDGStaking(DGStaking);
      setDGMainchain(DGMainchain);

      setComplete(true);
    }
  }, [
    state.stakingBalances.BALANCE_USER_GOVERNANCE,
    state.DGBalances.BALANCE_ROOT_DG,
  ]);

  function formatPrice(balance, units) {
    const balanceAdjusted = Number(balance)
      .toFixed(units)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return balanceAdjusted;
  }

  useEffect(() => {
    if (complete) {
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

        // send identity data to Segment analytics
        analytics.identify(address, {
          name: name,
          userStatus: state.userStatus,
          email: '',
          DG: {
            stakedGovernance: DGStaking,
            mainchainWallet: DGMainchain,
          },
          PLAY: { slots: [], roulette: [], blackjack: [], poker: [] },
          DAI: { slots: [], roulette: [], blackjack: [], poker: [] },
          MANA: { slots: [], roulette: [], blackjack: [], poker: [] },
        });
      })();
    }
  }, [complete]);

  return null;
}

export default UserInfo;
