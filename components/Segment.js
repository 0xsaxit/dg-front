import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../store';
import { useRouter } from 'next/router';

const Segment = () => {
  // get user status from the Context API store
  const [state, dispatch] = useContext(GlobalContext);

  // define local variables
  const [DGStaking, setDGStaking] = useState(0);
  const [DGMainchain, setDGMainchain] = useState(0);
  const [complete, setComplete] = useState(false);

  const router = useRouter();

  /////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    console.log('User status: ' + state.userStatus);
  }, [state.userStatus]);

  // send current page data to Segment analytics
  useEffect(() => {
    analytics.page(router.pathname, {
      path: router.pathname,
      address: state.userAddress,
    });
  }, [router.pathname]);

  // get DG staking and DG mainchan amounts
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

  // send user identity data to Segment analytics
  useEffect(() => {
    if (complete && state.userInfo.length) {
      analytics.identify(state.userAddress, {
        name: state.userInfo[0],
        userStatus: state.userStatus,
        email: state.userInfo[4],
        DG: {
          stakedGovernance: DGStaking,
          mainchainWallet: DGMainchain,
        },
        PLAY: { slots: [], roulette: [], blackjack: [], poker: [] },
        DAI: { slots: [], roulette: [], blackjack: [], poker: [] },
        MANA: { slots: [], roulette: [], blackjack: [], poker: [] },
      });
    }
  }, [complete, state.userInfo]);

  return null;
};

export default Segment;
