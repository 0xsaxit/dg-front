import React, { ReactElement, useState, useContext, useEffect } from 'react';
import { GlobalContext } from '@/store';
import Newbie from './Newbie/Newbie';
import Delegate from './Delegate/Delegate';
import NonPremiumOwner from './NonPremiumOwner/NonPremiumOwner';
import PremiumOwner from './PremiumOwner/PremiumOwner';
import FoxAnimation from 'components/lottieAnimation/animations/fox';
import Images from 'common/Images';
import styles from './Home.module.scss';

export interface HomeProps {
  content?: any;
}

const IceHome = (props: HomeProps): ReactElement => {
  // get delegation data from the Context API store
  const [state] = useContext(GlobalContext);

  // define local variables
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setIsLoading(state.iceWearableItemsLoading || state.iceDelegatedItemsLoading ? true : false);
  }, [state.iceWearableItemsLoading, state.iceDelegatedItemsLoading]);

  useEffect(() => {
    // Get Active Wearables, Delegate Wearables
    const activeWearables = state.iceWearableItems.filter(item => item.isActivated && item.bonus > 0);
    const delegatedWearables = state.iceDelegatedItems;

    // Get xDG Balances
    const xdgTotal = parseFloat(state.stakingBalances.BALANCE_USER_GOVERNANCE) + parseFloat(state.DGBalances.BALANCE_CHILD_TOKEN_XDG);

    // Newbie
    if (activeWearables.length === 0 && delegatedWearables.length === 0) {
      setStep(0);

      return;
    }

    // Delegate
    if (activeWearables.length === 0 && delegatedWearables.length > 0) {
      setStep(1);

      return;
    }

    if (activeWearables.length > 0) {
      // Non-Premium, Premium
      setStep(xdgTotal < activeWearables.length * 1000 ? 2 : 3);
    }
  }, [state.iceWearableItems, state.iceDelegatedItems, state.stakingBalances.BALANCE_USER_GOVERNANCE, state.DGBalances.BALANCE_CHILD_TOKEN_XDG]);

  return (
    <section className={styles.home}>
      {!state.userLoggedIn ? (
        <section style={{ marginTop: '80px' }}>
          <FoxAnimation />
        </section>
      ) : isLoading ? (
        <div className={styles.spinner_wrapper}>
          <img src={Images.LOADING_SPINNER} />
        </div>
      ) : step === 0 ? (
        <Newbie />
      ) : step === 1 ? (
        <Delegate />
      ) : step === 2 ? (
        <NonPremiumOwner />
      ) : (
        <PremiumOwner />
      )}
    </section>
  );
};

export default IceHome;
